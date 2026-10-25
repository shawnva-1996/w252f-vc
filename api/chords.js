// Chord sheets. Chords for each song live in Firestore (w252f_chords), which
// only this server can read, so only people who are logged in can see them.
// Band charts copied from the church's chord chart files live in
// _lib/band-charts.js, also only sent from here.
//   GET  ?id=…           chords and band chart for one song
//   GET  ?list=1         which songs have chords or a band chart (song id -> key)
//   POST {action:'find', id}            look for the chords online (Gemini + Google Search)
//   POST {action:'save', id, chords}    save chords someone typed or fixed
// The Gemini keys live in Vercel settings (GEMINI_KEYS).
import { adminDb, caller, ADMIN_EMAIL } from './_lib/firebase.js';
import { isChord, stripChords, sameWords, moveChords } from '../js/chords.js';
import CHARTS from './_lib/band-charts.js';

export const config = { maxDuration: 300 };

const COL = 'w252f_chords';
const MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite'];
const isAdmin = me => (me?.email || '').toLowerCase() === ADMIN_EMAIL;

let base = null;
async function getSong(id, host) {
  const extra = await adminDb.collection('w252f_songs').doc(id).get();
  if (extra.exists && extra.data().deleted) return null;
  if (!base) base = await fetch(`https://${host}/data/songs.json`).then(r => r.json());
  const b = base.find(s => s.id === id);
  if (!b && !extra.exists) return null;
  return { ...b, ...(extra.exists ? extra.data() : {}), id, builtIn: !!b };
}

const words = sec => (sec.slides || []).flatMap(sl => sl.en || []);
const cleanLine = l => String(l).replace(/\[([^\]]*)\]/g, (m, c) => (isChord(c) ? `[${c.trim()}]` : '')).replace(/\s+$/, '');
const onlyChords = l => /\[/.test(l) && !stripChords(l).replace(/[\s|/.\-x\d]/gi, '');

// Keep chords only on lines whose words match ours exactly, so the sheet
// always shows our words. Returns the chords and how many lines got some.
export function fit(song, parts, intro) {
  const out = {};
  let total = 0, good = 0;
  for (const sec of song.sections || []) {
    const lines = words(sec);
    const got = (Array.isArray(parts?.[sec.id]) ? parts[sec.id] : []).map(cleanLine);
    if (!lines.length) {
      const prog = got.filter(onlyChords);
      if (prog.length) out[sec.id] = prog;
      continue;
    }
    total += lines.length;
    const used = new Set();
    out[sec.id] = lines.map((l, i) => {
      let k = got[i] != null && sameWords(stripChords(got[i]), l) ? i : got.findIndex((g, j) => !used.has(j) && sameWords(stripChords(g), l));
      if (k < 0 || !/\[/.test(got[k])) return l;
      used.add(k); good++;
      return moveChords(got[k], l);
    });
  }
  const pre = cleanLine(intro || '');
  return { parts: out, intro: onlyChords(pre) ? pre : '', share: total ? good / total : 0 };
}

function prompt(song) {
  const body = (song.sections || []).map(sec => {
    const lines = words(sec);
    return `[${sec.id}] ${sec.label}${lines.length ? '' : ' (music only, no words)'}\n` + lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
  }).join('\n\n');
  return `You help a church worship band. Find the real chord chart for this song online and put its chords on OUR lyric lines.

Song: "${song.title}"${song.artist ? ` by ${song.artist}` : ''}.${song.key ? ` We usually sing it in ${song.key}.` : ''}${song.langs?.length ? ` Language: ${song.langs.join(' + ')}.` : ''}

Our words, part by part. Part ids are in [brackets]:
${body}

Steps:
1. Search the web for a chord chart of this exact song (for example worshiptogether.com, praisecharts.com, ultimate-guitar.com, worshipchords.com, the songwriter's or publisher's site, or for songs in other languages a chord site in that language).
2. For every part, return our lines in the same order, with each chord in square brackets just before the syllable where it changes, ChordPro style: "[G]A pure [D/F#]heart". Never change, add or drop our words.
3. Use the chords from the chart you found, in that chart's key. Never invent chords. If you cannot find a chart for this song, set "found" to false.
4. Parts with no words (intro, instrumental, interlude): give the chord progression as chords only, e.g. "[G] [D] [Em] [C]". Put the song intro in "intro".

Reply with only this JSON, in a \`\`\`json block:
{"found": true, "key": "the key these chords are in, e.g. G or Em", "intro": "[G] [D] [Em] [C]", "parts": {"part-id": ["line with chords", ...]}}`;
}

const json = t => { const m = String(t).match(/```(?:json)?\s*([\s\S]*?)```/) || String(t).match(/(\{[\s\S]*\})/); return JSON.parse(m ? m[1] : t); };

async function askGemini(song) {
  const keys = (process.env.GEMINI_KEYS || '').split(',').map(s => s.trim()).filter(Boolean).sort(() => Math.random() - 0.5);
  let lastErr = 'no keys';
  for (let i = 0; i < Math.min(6, keys.length * MODELS.length); i++) {
    const key = keys[i % keys.length], model = MODELS[i % MODELS.length];
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt(song) }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.1 } })
      });
      if (!r.ok) { lastErr = `gemini ${model} ${r.status}`; continue; }
      const d = await r.json();
      const cand = d.candidates?.[0];
      const out = json((cand?.content?.parts || []).map(p => p.text || '').join(''));
      const sources = (cand?.groundingMetadata?.groundingChunks || []).map(c => c.web).filter(Boolean).map(w => ({ title: w.title || '', uri: w.uri || '' })).slice(0, 5);
      return { ...out, sources, model };
    } catch (e) { lastErr = String(e.message || e); }
  }
  throw new Error(lastErr);
}

export async function findChords(id, host, by) {
  const song = await getSong(id, host);
  if (!song) return { ok: false, error: 'Song not found.' };
  const ai = await askGemini(song);
  if (!ai.found || !ai.sources.length) { console.log('chords none', id, ai.model, ai.sources.length); return { ok: false, error: 'No chord chart found online for this song.' }; }
  const f = fit(song, ai.parts, ai.intro);
  if (f.share < 0.6) { console.log('chords mismatch', id, f.share.toFixed(2)); return { ok: false, error: 'The chords found online did not match our words.', share: f.share }; }
  const key = String(ai.key || '').trim().slice(0, 8);
  console.log('chords found', id, key, f.share.toFixed(2), ai.model, ai.sources.map(x => x.title).join(' '));
  const chords = { key, parts: f.parts, intro: f.intro, sources: ai.sources, share: Math.round(f.share * 100) / 100, by, from: 'online', at: new Date().toISOString() };
  await adminDb.collection(COL).doc(id).set(chords);
  return { ok: true, chords };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const host = req.headers.host;
  const me = await caller(req);
  if (!me) return res.status(401).json({ error: 'Please log in first.' });
  try {
    if (req.method === 'GET') {
      if (req.query.list) {
        const snap = await adminDb.collection(COL).select('key').get();
        const charts = Object.entries(CHARTS).map(([id, c]) => [id, c.key]);
        return res.json({ songs: Object.fromEntries([...charts, ...snap.docs.map(d => [d.id, d.get('key') || ''])]) });
      }
      const id = String(req.query.id || '');
      const d = await adminDb.collection(COL).doc(id).get();
      return res.json({ chords: d.exists ? d.data() : null, chart: CHARTS[id] || null });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Not allowed' });
    const { action, id, chords } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Which song?' });
    if (action === 'find') {
      const have = await adminDb.collection(COL).doc(id).get();
      if (have.exists && !isAdmin(me)) return res.json({ ok: true, chords: have.data() });
      const r = await findChords(id, host, me.uid);
      return res.status(r.ok ? 200 : 404).json(r);
    }
    if (action === 'save') {
      const song = await getSong(id, host);
      if (!song) return res.status(404).json({ error: 'Song not found.' });
      if (!isAdmin(me) && song.ownerUid !== me.uid) return res.status(403).json({ error: 'Only the admin or the person who added this song can change its chords.' });
      const f = fit(song, chords?.parts, chords?.intro);
      if (!f.share && !f.intro) { await adminDb.collection(COL).doc(id).delete(); return res.json({ ok: true, chords: null }); }
      const saved = { key: String(chords?.key || '').trim().slice(0, 8), parts: f.parts, intro: f.intro, sources: [], share: Math.round(f.share * 100) / 100, by: me.uid, from: 'typed', at: new Date().toISOString() };
      await adminDb.collection(COL).doc(id).set(saved);
      return res.json({ ok: true, chords: saved });
    }
    return res.status(400).json({ error: 'Unknown action.' });
  } catch (e) {
    console.error('chords failed', e);
    return res.status(502).json({ error: 'Could not get the chords right now.' });
  }
}

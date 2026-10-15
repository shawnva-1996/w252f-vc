// Song library: built-in songs (data/songs.json) plus songs people add or
// the admin changes (Firestore). Also turns a song + flow into slides.
import { db, C, collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from './firebase.js';

let library = null;

export async function loadLibrary(force = false) {
  if (library && !force) return library;
  const base = await fetch('/data/songs.json').then(r => r.json()).catch(() => []);
  const map = new Map(base.map(s => [s.id, { ...s, builtIn: true }]));
  try {
    const snap = await getDocs(collection(db, C.songs));
    snap.forEach(d => {
      const s = { ...d.data(), id: d.id };
      if (s.deleted) map.delete(d.id);
      else map.set(d.id, { ...map.get(d.id), ...s, builtIn: map.get(d.id)?.builtIn || false });
    });
  } catch (e) { console.warn('Could not load added songs', e); }
  library = [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
  return library;
}

export const getSong = id => (library || []).find(s => s.id === id);

export async function saveSong(song, uid) {
  const id = song.id || 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const data = {
    title: song.title, artist: song.artist || '', cat: song.cat || 'worship', key: song.key || '',
    sections: song.sections, flow: song.flow || song.sections.map(s => s.id),
    ownerUid: song.ownerUid || uid, updatedAt: serverTimestamp()
  };
  await setDoc(doc(db, C.songs, id), data, { merge: true });
  library = null;
  return id;
}

export async function removeSong(song, uid) {
  if (song.builtIn) await setDoc(doc(db, C.songs, song.id), { deleted: true, ownerUid: uid, title: song.title });
  else await deleteDoc(doc(db, C.songs, song.id));
  library = null;
}

export function labelFor(song, id) {
  if (id === 'title') return 'Song title';
  if (id === 'blank') return 'Blank';
  return song.sections.find(s => s.id === id)?.label || id;
}

// Turn a song and its flow into a flat list of slides.
export function buildSlides(song, flow, songIndex = 0) {
  const out = [];
  let n = 0;
  const id = () => `${songIndex}-${n++}-${Math.random().toString(36).slice(2, 6)}`;
  for (const step of flow) {
    if (step === 'title') out.push({ id: id(), song: songIndex, label: 'Song title', kind: 'title', title: song.title, artist: song.artist || '' });
    else if (step === 'blank') out.push({ id: id(), song: songIndex, label: 'Blank', kind: 'blank' });
    else {
      const sec = song.sections.find(s => s.id === step);
      if (!sec) continue;
      for (const sl of sec.slides) out.push({ id: id(), song: songIndex, label: sec.label, kind: 'lyric', en: [...(sl.en || [])], zh: [...(sl.zh || [])] });
    }
  }
  return out;
}

export const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'part';

const TYPES = [
  ['pre-chorus', /^(pre[\s-]?chorus|pre|pc)\b/i], ['chorus', /^(chorus|ch|c\d?|refrain|reff?)\b/i],
  ['verse', /^(verse|v\d?)\b/i], ['bridge', /^(bridge|b\d?)\b/i], ['tag', /^(tag|ending|end|outro|coda)\b/i],
  ['intro', /^intro\b/i], ['riff', /^(riff|interlude|instrumental)\b/i]
];

// Simple offline backup when the smart reader can't be reached:
// splits pasted text into parts using headings like "Verse 1" / "Chorus".
export function quickParse(text) {
  const lines = text.replace(/\r/g, '').split('\n').map(l => l.trim());
  const sections = [];
  let cur = null;
  const cjk = /[㐀-鿿]/;
  const push = (label, type) => { cur = { label, type, lines: [] }; sections.push(cur); };
  for (const raw of lines) {
    const l = raw.replace(/^\[|\]$/g, '').replace(/:$/, '').trim();
    if (!l) { if (cur && cur.lines.length) cur.gap = true; continue; }
    const t = TYPES.find(([, re]) => re.test(l) && l.length < 20);
    if (t) { push(l.replace(/\b\w/g, c => c.toUpperCase()), t[0]); continue; }
    if (/^(ccli|©|copyright|words and music|all rights)/i.test(l) || /^\d+$/.test(l)) continue;
    if (/^[A-G][#b]?(m|maj|min|sus|dim|add|\d|\/|\s)*$/.test(l.replace(/\s+/g, ' ')) && l.length < 30 && /\s/.test(l)) continue; // chord lines
    if (!cur || cur.gap) push(cur ? `Part ${sections.length + 1}` : 'Verse 1', 'verse');
    cur.lines.push(l);
  }
  const seen = {};
  const out = sections.filter(s => s.lines.length).map(s => {
    const en = s.lines.filter(l => !cjk.test(l)), zh = s.lines.filter(l => cjk.test(l));
    const slides = [];
    const n = Math.max(Math.ceil(en.length / 2), Math.ceil(zh.length / 2));
    for (let i = 0; i < n; i++) slides.push({ en: en.slice(i * 2, i * 2 + 2), zh: zh.slice(i * 2, i * 2 + 2) });
    let id = slugify(s.label); while (seen[id]) id += '-2'; seen[id] = 1;
    return { id, label: s.label, type: s.type, slides };
  });
  return { title: '', artist: '', sections: out, flow: out.map(s => s.id) };
}

// Reads pasted words or a file (PDF / photo) and sorts the song into parts
// (verse, chorus, bridge…) using Gemini. Keys live in Vercel settings (GEMINI_KEYS).
import { caller } from './_lib/firebase.js';

export const config = { maxDuration: 60, api: { bodyParser: { sizeLimit: '5mb' } } };

const PROMPT = `You turn song lyrics (pasted text, a PDF or a photo) into clean slide data for a church lyric projector.
Songs can be in any language (English, Chinese, Tagalog, Bahasa, Korean, Tamil, Spanish…) or in two languages.
Return ONLY JSON:
{"title": str, "artist": str or "", "key": str or "", "cat": "praise" or "worship",
 "langs": [main language name, second language name if there is one] (e.g. ["English","Chinese"], ["Tagalog"]),
 "sections":[{"label": "Verse 1"|"Pre-Chorus"|"Chorus"|"Bridge"|"Tag"|"Intro"|"Outro"|"Riff"|..., "type":"verse|prechorus|chorus|bridge|tag|intro|outro|riff|cue|other",
   "slides":[{"en":[up to 2 lines of the MAIN language], "zh":[up to 2 lines of the SECOND language]}]}],
 "flow":[section labels in the order the song is sung, repeats included]}
Rules:
- The field names "en" and "zh" are fixed slots, not languages. "en" holds the main language of the song, whatever it is. "zh" holds a second language that translates the same slide (Chinese, or any other). A song in one language puts every line in "en" and leaves "zh" empty. When English is one of two languages, English goes in "en".
- Keep every sung word exactly as written in its own language and script, with its accents, apostrophes and marks (e.g. 'Yo, Ika'y, ñ, é, Korean, Tamil). Never translate, never romanise, never drop lines because they are not English.
- Keep only sung lyrics. Remove chords, credits, copyright, CCLI, page numbers, file names, notes like "x2" (put repeats in flow). Remove pinyin or other romanisation only when the same words are also there in their own script.
- Each unique section appears ONCE in "sections". Number verses (Verse 1, Verse 2).
- Max 2 lines per language per slide; join very short lines. Never change words. Use normal sentence case.
- Songs printed twice (one language, then the other) are the same sections: merge and align them. Never invent translations. Remove spaces between Chinese characters.
- Music-only parts in the song flow (e.g. "Instrumental: 8 bars", "Spirit") become a section with type "cue", that label, and "slides": [].
- If there are no section headings, decide them from repetition (repeated block = chorus).
- cat: "praise" for upbeat celebration songs, "worship" for slower intimate songs.`;

const MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Not allowed' });
  if (!(await caller(req))) return res.status(401).json({ error: 'Please log in first.' });
  const { text, file } = req.body || {};
  if (!text && !file) return res.status(400).json({ error: 'Nothing to read.' });
  const parts = [{ text: PROMPT }];
  if (text) parts.push({ text: 'SONG TEXT:\n' + String(text).slice(0, 30000) });
  if (file) parts.push({ inline_data: { mime_type: file.mime, data: file.data } });
  const keys = (process.env.GEMINI_KEYS || '').split(',').map(s => s.trim()).filter(Boolean).sort(() => Math.random() - 0.5);
  let lastErr = 'no keys';
  for (let i = 0; i < Math.min(8, keys.length * MODELS.length); i++) {
    const key = keys[i % keys.length], model = MODELS[i % MODELS.length];
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } })
      });
      if (!r.ok) { lastErr = 'gemini ' + r.status; continue; }
      const d = await r.json();
      const out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (!out.sections?.length) { lastErr = 'empty'; continue; }
      return res.json(out);
    } catch (e) { lastErr = String(e.message || e); }
  }
  console.error('parse failed', lastErr);
  return res.status(502).json({ error: 'Could not read the song right now.' });
}

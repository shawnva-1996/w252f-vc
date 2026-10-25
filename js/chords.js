// Chords: read ChordPro lines ("[G]Amazing [C]grace"), change key, and show
// them as chords, Nashville numbers or words only. Pure code, no AI.

const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// The keys people pick from, written the way bands usually say them.
export const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const CHORD = /^([A-G])([#b]?)([^/\s]*)(?:\/([A-G])([#b]?))?$/;
export const isChord = s => CHORD.test(String(s).trim());

function noteIndex(letter, acc) {
  return (NOTE[letter] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0) + 12) % 12;
}

// "F#", "C#/Db", "Em", "Bbm" -> { root: 0-11, minor: bool } or null
export function parseKey(key) {
  const m = String(key || '').trim().split(/[\/ ]/)[0].match(/^([A-G])([#b]?)(m(?!aj))?/);
  return m ? { root: noteIndex(m[1], m[2]), minor: !!m[3], name: m[1] + m[2] + (m[3] ? 'm' : '') } : null;
}

// Flats for flat keys (F, Bb, Eb… and their relative minors), sharps otherwise.
export function useFlats(key) {
  const k = parseKey(key);
  if (!k) return false;
  if (/b/.test(k.name.slice(1))) return true;
  if (/#/.test(k.name)) return false;
  const major = k.minor ? (k.root + 3) % 12 : k.root;
  return [5, 10, 3, 8, 1, 6].includes(major);
}

export function transposeChord(chord, semis, flats) {
  const m = String(chord).trim().match(CHORD);
  if (!m) return chord;
  const names = flats ? FLAT : SHARP;
  const root = names[(noteIndex(m[1], m[2]) + semis + 120) % 12];
  const bass = m[4] ? '/' + names[(noteIndex(m[4], m[5]) + semis + 120) % 12] : '';
  return root + m[3] + bass;
}

// Nashville number for a chord in a key: 1, 4, 6m, 5/7, b7…
const DEGREE = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
export function nashvilleParts(chord, key) {
  const m = String(chord).trim().match(CHORD);
  const k = parseKey(key);
  if (!m || !k) return null;
  const tonic = k.minor ? (k.root + 3) % 12 : k.root; // minor songs count from their relative major (6m = home)
  const deg = n => DEGREE[(n - tonic + 12) % 12];
  return { num: deg(noteIndex(m[1], m[2])), kind: m[3], bass: m[4] ? deg(noteIndex(m[4], m[5])) : '' };
}
export function nashville(chord, key) {
  const n = nashvilleParts(chord, key);
  return n ? n.num + n.kind + (n.bass ? '/' + n.bass : '') : chord;
}

export function semitones(fromKey, toKey) {
  const a = parseKey(fromKey), b = parseKey(toKey);
  return a && b ? (b.root - a.root + 12) % 12 : 0;
}

// Capo hint: play easy open shapes (C, G, D, A, E) with a capo.
export function capoHint(key) {
  const k = parseKey(key);
  if (!k) return '';
  const shapes = k.minor ? [['Am', 9], ['Em', 4], ['Dm', 2]] : [['G', 7], ['C', 0], ['D', 2], ['A', 9], ['E', 4]];
  let best = null;
  for (const [name, root] of shapes) {
    const capo = (k.root - root + 12) % 12;
    if (capo === 0) return '';
    if (capo <= 5 && (!best || capo < best.capo)) best = { name, capo };
  }
  return best ? `Capo ${best.capo}, play ${best.name} shapes` : '';
}

// "[G]Amazing [C]grace" -> [{ chord: 'G', text: 'Amazing ' }, { chord: 'C', text: 'grace' }]
export function parseLine(line) {
  const parts = [];
  const re = /\[([^\]]*)\]/g;
  let last = 0, chord = '', m;
  while ((m = re.exec(line))) {
    if (m.index > last || chord) parts.push({ chord, text: line.slice(last, m.index) });
    chord = m[1].trim(); last = re.lastIndex;
  }
  parts.push({ chord, text: line.slice(last) });
  return parts.filter((p, i) => p.chord || p.text || i === 0);
}

export const stripChords = line => String(line).replace(/\[[^\]]*\]/g, '');

// Words compared loosely: case, spaces, punctuation and curly quotes don't matter.
export const sameWords = (a, b) => {
  const n = s => String(s).normalize('NFKC').toLowerCase().replace(/[’‘´`]/g, "'").replace(/[^\p{L}\p{N}]+/gu, '');
  return n(a) === n(b);
};

// Change every chord in a ChordPro line.
export function mapChords(line, fn) {
  return String(line).replace(/\[([^\]]*)\]/g, (_, c) => '[' + (isChord(c) ? fn(c.trim()) : c) + ']');
}

// Put the chords of a ChordPro line onto our own spelling of the same words
// (curly quotes, capitals, commas), counting letters so each chord lands on
// the same syllable.
export function moveChords(chordLine, words) {
  const isWord = ch => /[\p{L}\p{N}]/u.test(ch);
  const marks = [];
  let n = 0;
  for (const p of parseLine(chordLine)) {
    if (p.chord) marks.push([n, p.chord]);
    for (const ch of p.text) if (isWord(ch)) n++;
  }
  let out = '', seen = 0, k = 0;
  for (const ch of String(words)) {
    // A chord goes right before the letter it was on, after any spaces.
    if (isWord(ch)) { while (k < marks.length && marks[k][0] <= seen) out += `[${marks[k++][1]}]`; seen++; }
    out += ch;
  }
  while (k < marks.length) out += `[${marks[k++][1]}]`;
  return out;
}

// Band charts: one line of bars, like "E | A | F#m B | E (x2)". Only real
// chord names count (so "Bass" or "End" in a note stay as words).
const BAND = /^[A-G][#b]?(?:m(?!aj)|maj|min|dim|aug|sus|add|M|\+)?\d*(?:(?:sus|add|maj|b|#)\d+)*(?:\/[A-G][#b]?)?$/;
export const isBandChord = s => BAND.test(s);

// "(1st time) G | Am7 D | % (x2)" -> { before: '(1st time)', bars: [[{chord:'G'}], …], after: '(x2)' }
// Each bar is a list of { chord } or { note }. Notes in brackets that hold only
// chords, like "(A/C#)", become chords too.
export function parseBars(line) {
  const tok = s => (s.match(/\([^)]*\)|[^\s()]+/g) || []).flatMap(t => {
    if (t[0] !== '(') return [isBandChord(t) ? { chord: t } : { note: t }];
    const inner = t.slice(1, -1).trim().split(/\s+/);
    return inner.length && inner.every(isBandChord) ? inner.map(c => ({ chord: c, soft: true })) : [{ note: t }];
  });
  const bars = String(line).split('|').map(tok).filter(b => b.length);
  const out = { before: [], bars, after: [] };
  if (!bars.some(b => b.some(t => t.chord || t.note === '%'))) return { before: bars.flat(), bars: [], after: [] };
  // Notes before the first chord or after the last one go beside the bars,
  // but a bar that is only a note, like "(break)", stays a bar.
  const music = t => t.chord || t.note === '%';
  const first = bars[0], last = bars[bars.length - 1];
  if (first.some(music)) while (!music(first[0])) out.before.push(first.shift());
  if (last.some(music)) while (!music(last[last.length - 1])) out.after.unshift(last.pop());
  return out;
}

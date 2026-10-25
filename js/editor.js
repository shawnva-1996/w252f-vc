// Song library, adding a song (paste or upload), and changing a song.
import { auth } from './firebase.js';
import { show, esc, toast, header, confirmBox, icon, $, $$ } from './ui.js';
import { store, local } from './store.js';
import { loadLibrary, getLibrary, refreshLibrary, onLibrary, getSong, saveSong, removeSong, quickParse, slugify, labelFor, matches, langNote } from './songs.js';
import { menuButtons, bindMenu, loading } from './main.js';
import { canEdit, chordList, cachedChordList } from './sheet.js';

// The library opens straight away from what this device already knows, then
// redraws if added songs or chords arrive from the internet.
export async function songLibrary() {
  const back = local.get('role') === 'sheets' ? '#/' : '#/home';
  const top = header('Song library', { back, right: menuButtons() });
  let lib = getLibrary();
  if (!lib) {
    show(`<main class="page">${top}${loading('Getting the songs…')}</main>`);
    bindMenu();
    lib = await loadLibrary();
    if (location.hash !== '#/songs') return;
  }
  show(`<main class="page">
    ${top}
    <p class="lead">Tap a song for its words and chords, in any key.</p>
    <div class="sticky-tools">
      <input class="input search" id="q" type="search" placeholder="Type a song name…" aria-label="Search songs" value="${esc(lastSearch)}">
      <div class="seg"><button class="on" data-f="all">All</button><button data-f="praise">Praise</button><button data-f="worship">Worship</button><button data-f="chords">Chords</button></div>
    </div>
    <p class="small muted" id="n"></p>
    <ul class="song-list" id="list"></ul>
    <a class="btn primary big wide" href="#/song/new">${icon('plus')}Add a song</a>
  </main>`);
  bindMenu();
  let f = 'all';
  const draw = () => {
    const have = cachedChordList();
    const q = lastSearch = $('#q').value.trim().toLowerCase();
    const items = lib.filter(s => (f === 'all' || s.cat === f || (f === 'chords' && s.id in have)) && matches(s, q));
    $('#n').textContent = `${items.length} songs`;
    $('#list').innerHTML = items.map(s => `<li><a class="song-row" href="#/sheet/${s.id}"><span class="t"><b>${esc(s.title)}${langNote(s) ? `<span class="lang-tag">${esc(langNote(s))}</span>` : ''}${s.id in have ? '<span class="lang-tag chords-tag">Chords</span>' : ''}</b>
      <small>${s.cat === 'praise' ? 'Praise' : 'Worship'}${s.artist ? ' · ' + esc(s.artist) : ''}${s.key || have[s.id] ? ' · Key ' + esc(s.key || have[s.id]) : ''}${s.aka?.length ? ' · also called ' + s.aka.map(esc).join(', ') : ''}</small></span><span class="go">${icon('next')}</span></a></li>`).join('');
  };
  $('#q').oninput = draw;
  $$('[data-f]').forEach(b => b.onclick = () => { f = b.dataset.f; $$('[data-f]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  draw();
  const here = () => location.hash === '#/songs';
  const stop = onLibrary(next => { if (!here()) return stop(); lib = next; draw(); });
  chordList(() => here() && draw());
}
let lastSearch = '';

export async function songEditor(id) {
  if (id === 'new') return addSong();
  let s = getSong(id);
  if (!s) {
    show(`<main class="page narrow">${header('Change song', { back: '#/songs', right: menuButtons() })}${loading('Getting the song…')}</main>`);
    bindMenu();
    await loadLibrary();
    s = getSong(id) || (await refreshLibrary(), getSong(id));
  }
  if (!s) { toast('Song not found.'); location.hash = '#/songs'; return; }
  if (!canEdit(s)) { location.replace('#/sheet/' + id); return; }
  editForm(structuredClone(s));
}

// Step 1: paste or upload ---------------------------------------------------
function addSong() {
  show(`<main class="page narrow">
    ${header('Add a song', { back: '#/songs', right: menuButtons() })}
    <p class="lead">Paste the words, or choose a file. We'll sort out the verses and chorus for you. Any language works: English, Chinese, Tagalog, Bahasa, Korean and more.</p>
    <label>Paste the words here<textarea class="input" id="raw" rows="10" placeholder="Verse 1&#10;I give You glory…"></textarea></label>
    <div class="or">or</div>
    <label class="btn ghost big wide file-btn">${icon('file')}Choose a file (PDF, Word, PowerPoint, photo)
      <input type="file" id="file" accept=".pdf,.docx,.pptx,.txt,image/*" hidden></label>
    <p class="small muted center" id="fname"></p>
    <p class="error" id="err" role="alert"></p>
    <div class="bar"><button class="btn primary big" id="go">Read the words</button></div>
  </main>`);
  bindMenu();
  let picked = null;
  $('#file').onchange = e => { picked = e.target.files[0] || null; $('#fname').textContent = picked ? 'Chosen: ' + picked.name : ''; };
  $('#go').onclick = async () => {
    const btn = $('#go'); $('#err').textContent = '';
    const raw = $('#raw').value.trim();
    if (!raw && !picked) { $('#err').textContent = 'Please paste the words or choose a file first.'; return; }
    btn.disabled = true; btn.textContent = 'Reading the words…';
    try {
      const song = await readSong(raw, picked);
      editForm(song, true);
    } catch (e) {
      console.error(e);
      $('#err').textContent = e.message || 'Sorry, we could not read that. Try pasting the words instead.';
      btn.disabled = false; btn.textContent = 'Read the words';
    }
  };
}

async function readSong(raw, file) {
  let payload = {};
  let text = raw;
  if (file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.doc')) throw new Error('Old Word files (.doc) cannot be read. Please save it as .docx or PDF and try again.');
    if (name.endsWith('.docx')) text = await docxText(file);
    else if (name.endsWith('.pptx')) text = await pptxText(file);
    else if (name.endsWith('.txt')) text = await file.text();
    else {
      if (file.size > 3.5e6) throw new Error('That file is too big. Please use a smaller photo or PDF.');
      payload.file = { mime: file.type || (name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'), data: await b64(file) };
    }
  }
  if (text) payload.text = text;
  try {
    const token = await auth.currentUser.getIdToken();
    const r = await fetch('/api/parse', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error('reader ' + r.status);
    return fromParsed(await r.json());
  } catch (e) {
    console.warn('Smart reader not available, using simple reader', e);
    if (!text) throw new Error('We could not read that file just now. Please paste the words instead.');
    return fromParsed(quickParse(text));
  }
}

function fromParsed(p) {
  const seen = {};
  const sections = (p.sections || []).map(s => {
    let id = slugify(s.label); while (seen[id]) id += '-2'; seen[id] = 1;
    return { id, label: s.label, type: s.type || 'verse', slides: (s.slides || []).map(x => ({ en: x.en || [], zh: x.zh || [] })) };
  });
  const byLabel = Object.fromEntries(sections.map(s => [s.label.toLowerCase(), s.id]));
  let flow = (p.flow || []).map(l => byLabel[String(l).toLowerCase()] || (sections.find(s => s.id === l) || {}).id).filter(Boolean);
  if (!flow.length) flow = sections.map(s => s.id);
  const langs = (p.langs || []).filter(Boolean);
  return { title: p.title || '', artist: p.artist || '', cat: p.cat || 'worship', key: p.key || '', langs, sections, flow: ['title', ...flow] };
}

const b64 = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });

// The Word / PowerPoint reader only loads when someone adds a song.
let zipLib = null;
function loadZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  return zipLib ||= new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = () => res(window.JSZip); s.onerror = () => { zipLib = null; rej(new Error('Could not open that file. Please check the internet.')); };
    document.head.appendChild(s);
  });
}

async function docxText(file) {
  const JSZip = await loadZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = new DOMParser().parseFromString(await zip.file('word/document.xml').async('string'), 'application/xml');
  return [...xml.getElementsByTagName('w:p')].map(p => [...p.getElementsByTagName('w:t')].map(t => t.textContent).join('')).join('\n');
}
async function pptxText(file) {
  const JSZip = await loadZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const names = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)));
  const out = [];
  for (const n of names) {
    const xml = new DOMParser().parseFromString(await zip.file(n).async('string'), 'application/xml');
    out.push([...xml.getElementsByTagName('a:p')].map(p => [...p.getElementsByTagName('a:t')].map(t => t.textContent).join('')).filter(Boolean).join('\n'));
  }
  return out.join('\n\n');
}

// Step 2: check and save -----------------------------------------------------
const TYPES = [['verse', 'Verse'], ['prechorus', 'Pre-chorus'], ['chorus', 'Chorus'], ['bridge', 'Bridge'], ['tag', 'Tag / ending'], ['riff', 'Riff'], ['intro', 'Intro'], ['cue', 'Music only (no words)'], ['other', 'Other']];
const toBox = (slides, k) => slides.map(s => (s[k] || []).join('\n')).join('\n\n');
const fromBox = txt => txt.replace(/\r/g, '').split(/\n\s*\n/).map(b => b.split('\n').map(x => x.trim()).filter(Boolean));

function editForm(s, isNew = false) {
  show(`<main class="page narrow">
    ${header(isNew ? 'Check the song' : 'Change song', { back: isNew ? '#/song/new' : '#/sheet/' + s.id, right: menuButtons() })}
    ${isNew ? '<p class="note">Please check the words and parts below, then tap Save.</p>' : ''}
    <label>Song name<input class="input" id="title" value="${esc(s.title)}" required></label>
    <div class="row2">
      <label>Sung by<input class="input" id="artist" value="${esc(s.artist || '')}"></label>
      <label>Key<input class="input" id="key" value="${esc(s.key || '')}" maxlength="8"></label>
    </div>
    <div class="row2">
      <label>Main language<input class="input" id="lang1" value="${esc(s.langs?.[0] || '')}" placeholder="English" list="langlist"></label>
      <label>Second language <small>(if any)</small><input class="input" id="lang2" value="${esc(s.langs?.[1] || '')}" placeholder="Chinese" list="langlist"></label>
    </div>
    <datalist id="langlist">${['English', 'Chinese', 'Tagalog', 'Bahasa Indonesia', 'Bahasa Melayu', 'Korean', 'Japanese', 'Tamil', 'Hindi', 'Thai', 'Vietnamese', 'Spanish'].map(l => `<option value="${l}">`).join('')}</datalist>
    <div class="lbl">Type of song</div>
    <div class="seg big" id="cat"><button data-c="praise" class="${s.cat === 'praise' ? 'on' : ''}">Praise</button><button data-c="worship" class="${s.cat !== 'praise' ? 'on' : ''}">Worship</button></div>
    <p class="small muted">In each box, put a blank line between slides. Two lines per slide looks best. For a music-only part (like "Instrumental: 8 bars"), choose "Music only" and leave the boxes empty.</p>
    <div id="secs"></div>
    <button class="btn ghost wide" id="addsec">+ Add a part</button>
    <h3>Usual order</h3>
    <ol class="flow" id="flow"></ol>
    <div class="chips" id="flowadd"></div>
    <p class="error" id="err" role="alert"></p>
    <div class="bar">
      ${!isNew && s.id ? '<button class="btn ghost" id="del">Remove song</button>' : ''}
      <button class="btn primary big" id="save">Save song</button>
    </div>
  </main>`);
  bindMenu();
  const secs = s.sections;
  const lang1 = () => ($('#lang1')?.value || '').trim() || 'Main language';
  const lang2 = () => ($('#lang2')?.value || '').trim() || 'Second language';
  const drawSecs = () => {
    $('#secs').innerHTML = secs.map((sec, i) => `<fieldset class="sec" data-i="${i}">
      <div class="row2">
        <label>Part name<input class="input" data-k="label" value="${esc(sec.label)}"></label>
        <label>Kind<select class="input" data-k="type">${TYPES.map(([v, n]) => `<option value="${v}" ${sec.type === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <label>${esc(lang1())} words<textarea class="input" data-k="en" rows="${Math.min(10, sec.slides.length * 3 + 1)}">${esc(toBox(sec.slides, 'en'))}</textarea></label>
      <label>${esc(lang2())} words <small>(optional)</small><textarea class="input" data-k="zh" rows="${Math.min(10, sec.slides.length * 3 + 1)}">${esc(toBox(sec.slides, 'zh'))}</textarea></label>
      <div class="row"><button class="btn ghost small" data-rmsec="${i}">Remove this part</button></div>
    </fieldset>`).join('');
  };
  const collect = () => {
    $$('.sec').forEach(fs => {
      const sec = secs[fs.dataset.i];
      sec.label = $('[data-k=label]', fs).value.trim() || 'Part';
      sec.type = $('[data-k=type]', fs).value;
      const en = fromBox($('[data-k=en]', fs).value), zh = fromBox($('[data-k=zh]', fs).value);
      sec.slides = Array.from({ length: Math.max(en.length, zh.length) }, (_, k) => ({ en: en[k] || [], zh: zh[k] || [] }));
    });
  };
  const drawFlow = () => {
    $('#flow').innerHTML = s.flow.map((id, k) => `<li class="flow-row"><span class="n">${k + 1}</span><span class="t"><b>${esc(labelFor(s, id))}</b></span>
      <span class="acts"><button class="ic" data-fu="${k}" ${k === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up')}</button><button class="ic danger" data-fd="${k}" aria-label="Remove">${icon('x')}</button></span></li>`).join('');
    $('#flowadd').innerHTML = secs.map(x => `<button class="chip" data-fa="${esc(x.id)}">+ ${esc(x.label)}</button>`).join('') +
      '<button class="chip soft" data-fa="title">+ Song title</button><button class="chip soft" data-fa="blank">+ Blank</button>';
  };
  drawSecs(); drawFlow();
  ['#lang1', '#lang2'].forEach(q => $(q).onchange = () => { collect(); drawSecs(); });
  $('#cat').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; s.cat = b.dataset.c; $$('[data-c]').forEach(x => x.classList.toggle('on', x === b)); };
  $('#secs').addEventListener('change', () => { collect(); drawFlow(); });
  $('#secs').onclick = e => { const b = e.target.closest('[data-rmsec]'); if (!b) return; collect(); const [gone] = secs.splice(+b.dataset.rmsec, 1); s.flow = s.flow.filter(x => x !== gone.id); drawSecs(); drawFlow(); };
  $('#addsec').onclick = () => { collect(); let id = 'part-' + (secs.length + 1); while (secs.some(x => x.id === id)) id += 'b'; secs.push({ id, label: 'Verse ' + (secs.filter(x => x.type === 'verse').length + 1), type: 'verse', slides: [{ en: [], zh: [] }] }); drawSecs(); drawFlow(); };
  $('#flow').onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.fu) { const k = +b.dataset.fu; [s.flow[k - 1], s.flow[k]] = [s.flow[k], s.flow[k - 1]]; } if (b.dataset.fd) s.flow.splice(+b.dataset.fd, 1); drawFlow(); };
  $('#flowadd').onclick = e => { const b = e.target.closest('[data-fa]'); if (!b) return; collect(); s.flow.push(b.dataset.fa); drawFlow(); };
  const del = $('#del');
  if (del) del.onclick = async () => {
    if (!(await confirmBox(`Remove "${s.title}" from the library for everyone?`, 'Yes, remove'))) return;
    await removeSong(s, store.uid); toast('Song removed.'); location.hash = '#/songs';
  };
  $('#save').onclick = async () => {
    collect();
    s.title = $('#title').value.trim(); s.artist = $('#artist').value.trim(); s.key = $('#key').value.trim();
    s.langs = [$('#lang1').value.trim(), $('#lang2').value.trim()];
    while (s.langs.length && !s.langs[s.langs.length - 1]) s.langs.pop();
    s.sections = secs.filter(x => x.type === 'cue' || x.slides.some(sl => sl.en.length || sl.zh.length));
    s.flow = s.flow.filter(id => id === 'title' || id === 'blank' || s.sections.some(x => x.id === id));
    if (!s.title) { $('#err').textContent = 'Please give the song a name.'; return; }
    if (!s.sections.length) { $('#err').textContent = 'Please add some words first.'; return; }
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const id = await saveSong(s, store.uid);
      toast(`"${s.title}" is saved in the library.`);
      location.hash = '#/sheet/' + id;
    } catch (e) { console.error(e); $('#err').textContent = 'Could not save. Please check the internet.'; btn.disabled = false; btn.textContent = 'Save song'; }
  };
}

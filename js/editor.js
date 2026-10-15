// Song library, adding a song (paste or upload), and changing a song.
import { auth } from './firebase.js';
import { show, esc, toast, header, confirmBox, $, $$ } from './ui.js';
import { store } from './store.js';
import { loadLibrary, getSong, saveSong, removeSong, quickParse, slugify, labelFor } from './songs.js';
import { menuButtons, bindMenu, loading } from './main.js';

const canEdit = s => store.isAdmin || (s && s.ownerUid && s.ownerUid === store.uid);

export async function songLibrary() {
  show(`<main class="page">${header('Song library', { back: '#/home', right: menuButtons() })}${loading('Getting the songs…')}</main>`);
  bindMenu();
  const lib = await loadLibrary();
  show(`<main class="page">
    ${header('Song library', { back: '#/home', right: menuButtons() })}
    <div class="sticky-tools">
      <input class="input search" id="q" type="search" placeholder="Type a song name…" aria-label="Search songs">
      <div class="seg"><button class="on" data-f="all">All</button><button data-f="praise">Praise</button><button data-f="worship">Worship</button></div>
    </div>
    <p class="small muted" id="n"></p>
    <ul class="song-list" id="list"></ul>
    <a class="btn primary big wide" href="#/song/new">+ Add a song</a>
  </main>`);
  bindMenu();
  let f = 'all';
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    const items = lib.filter(s => (f === 'all' || s.cat === f) && (!q || s.title.toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q)));
    $('#n').textContent = `${items.length} songs`;
    $('#list').innerHTML = items.map(s => `<li><a class="song-row" href="#/song/${s.id}"><span class="t"><b>${esc(s.title)}</b>
      <small>${s.cat === 'praise' ? 'Praise' : 'Worship'}${s.artist ? ' · ' + esc(s.artist) : ''}${s.key ? ' · Key ' + esc(s.key) : ''}</small></span><span class="go">›</span></a></li>`).join('');
  };
  $('#q').oninput = draw;
  $$('[data-f]').forEach(b => b.onclick = () => { f = b.dataset.f; $$('[data-f]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  draw();
}

export async function songEditor(id) {
  await loadLibrary();
  if (id === 'new') return addSong();
  const s = getSong(id);
  if (!s) { toast('Song not found.'); location.hash = '#/songs'; return; }
  if (!canEdit(s)) return viewSong(s);
  editForm(structuredClone(s));
}

function viewSong(s) {
  show(`<main class="page narrow">
    ${header(s.title, { back: '#/songs', right: menuButtons() })}
    <p class="muted">${esc(s.artist || '')} ${s.key ? '· Key ' + esc(s.key) : ''}</p>
    ${s.sections.map(sec => `<section class="lyric"><h3>${esc(sec.label)}</h3>
      ${sec.slides.map(sl => `<p>${[...(sl.en || []), ...(sl.zh || [])].map(esc).join('<br>')}</p>`).join('')}</section>`).join('')}
    <p class="small muted">Usual order: ${(s.flow || []).map(x => esc(labelFor(s, x))).join(' → ')}</p>
    <p class="small muted">Only the admin or the person who added this song can change it.</p>
  </main>`);
  bindMenu();
}

// Step 1: paste or upload ---------------------------------------------------
function addSong() {
  show(`<main class="page narrow">
    ${header('Add a song', { back: '#/songs', right: menuButtons() })}
    <p class="lead">Paste the words, or choose a file. We'll sort out the verses and chorus for you.</p>
    <label>Paste the words here<textarea class="input" id="raw" rows="10" placeholder="Verse 1&#10;I give You glory…"></textarea></label>
    <div class="or">or</div>
    <label class="btn ghost big wide file-btn">📄 Choose a file (PDF, Word, PowerPoint, photo)
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
  return { title: p.title || '', artist: p.artist || '', cat: p.cat || 'worship', key: p.key || '', sections, flow: ['title', ...flow] };
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
const TYPES = [['verse', 'Verse'], ['prechorus', 'Pre-chorus'], ['chorus', 'Chorus'], ['bridge', 'Bridge'], ['tag', 'Tag / ending'], ['riff', 'Riff'], ['intro', 'Intro'], ['other', 'Other']];
const toBox = (slides, k) => slides.map(s => (s[k] || []).join('\n')).join('\n\n');
const fromBox = txt => txt.replace(/\r/g, '').split(/\n\s*\n/).map(b => b.split('\n').map(x => x.trim()).filter(Boolean));

function editForm(s, isNew = false) {
  show(`<main class="page narrow">
    ${header(isNew ? 'Check the song' : 'Change song', { back: isNew ? '#/song/new' : '#/songs', right: menuButtons() })}
    ${isNew ? '<p class="note">Please check the words and parts below, then tap Save.</p>' : ''}
    <label>Song name<input class="input" id="title" value="${esc(s.title)}" required></label>
    <div class="row2">
      <label>Sung by<input class="input" id="artist" value="${esc(s.artist || '')}"></label>
      <label>Key<input class="input" id="key" value="${esc(s.key || '')}" maxlength="4"></label>
    </div>
    <div class="lbl">Type of song</div>
    <div class="seg big" id="cat"><button data-c="praise" class="${s.cat === 'praise' ? 'on' : ''}">Praise</button><button data-c="worship" class="${s.cat !== 'praise' ? 'on' : ''}">Worship</button></div>
    <p class="small muted">In each box, put a blank line between slides. Two lines per slide looks best.</p>
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
  const drawSecs = () => {
    $('#secs').innerHTML = secs.map((sec, i) => `<fieldset class="sec" data-i="${i}">
      <div class="row2">
        <label>Part name<input class="input" data-k="label" value="${esc(sec.label)}"></label>
        <label>Kind<select class="input" data-k="type">${TYPES.map(([v, n]) => `<option value="${v}" ${sec.type === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <label>English<textarea class="input" data-k="en" rows="${Math.min(10, sec.slides.length * 3 + 1)}">${esc(toBox(sec.slides, 'en'))}</textarea></label>
      <label>Chinese <small>(optional)</small><textarea class="input" data-k="zh" rows="${Math.min(10, sec.slides.length * 3 + 1)}">${esc(toBox(sec.slides, 'zh'))}</textarea></label>
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
      <span class="acts"><button class="ic" data-fu="${k}" ${k === 0 ? 'disabled' : ''} aria-label="Move up">↑</button><button class="ic danger" data-fd="${k}" aria-label="Remove">✕</button></span></li>`).join('');
    $('#flowadd').innerHTML = secs.map(x => `<button class="chip" data-fa="${esc(x.id)}">+ ${esc(x.label)}</button>`).join('') +
      '<button class="chip soft" data-fa="title">+ Song title</button><button class="chip soft" data-fa="blank">+ Blank</button>';
  };
  drawSecs(); drawFlow();
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
    s.sections = secs.filter(x => x.slides.some(sl => sl.en.length || sl.zh.length));
    s.flow = s.flow.filter(id => id === 'title' || id === 'blank' || s.sections.some(x => x.id === id));
    if (!s.title) { $('#err').textContent = 'Please give the song a name.'; return; }
    if (!s.sections.length) { $('#err').textContent = 'Please add some words first.'; return; }
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const id = await saveSong(s, store.uid);
      await loadLibrary(true);
      toast(`"${s.title}" is saved in the library.`);
      void id;
      location.hash = '#/songs';
    } catch (e) { console.error(e); $('#err').textContent = 'Could not save. Please check the internet.'; btn.disabled = false; btn.textContent = 'Save song'; }
  };
}

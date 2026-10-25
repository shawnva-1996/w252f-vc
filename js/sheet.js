// Song sheets for the band: words only, chords, or Nashville numbers, in any
// key. Chords come from /api/chords, so only people who are logged in see them.
import { auth } from './firebase.js';
import { show, esc, toast, header, icon, $, $$ } from './ui.js';
import { store, local } from './store.js';
import { loadLibrary, getSong, refreshLibrary, labelFor, langNote } from './songs.js';
import { menuButtons, bindMenu, loading } from './main.js';
import { KEYS, parseKey, useFlats, transposeChord, nashville, semitones, capoHint, parseLine, stripChords } from './chords.js';

const MINOR = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
export const canEdit = s => store.isAdmin || (s && s.ownerUid && s.ownerUid === store.uid);

export async function chordsApi(method, query = '', body) {
  const token = await auth.currentUser.getIdToken();
  const r = await fetch('/api/chords' + query, {
    method, headers: { Authorization: 'Bearer ' + token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Could not get the chords right now.');
  return d;
}

// Which songs have chords (song id -> key). Kept on this device so the list shows at once.
let haveChords = local.get('chords.list') || null;
export async function chordList(onChange) {
  const was = JSON.stringify(haveChords);
  try {
    haveChords = (await chordsApi('GET', '?list=1')).songs;
    local.set('chords.list', haveChords);
    if (JSON.stringify(haveChords) !== was && onChange) onChange(haveChords);
  } catch (e) { console.warn(e); }
  return haveChords || {};
}
export const cachedChordList = () => haveChords || {};

export async function songSheet(id) {
  let song = getSong(id);
  if (!song) {
    show(`<main class="page">${header('Song sheet', { back: '#/songs', right: menuButtons() })}${loading('Getting the song…')}</main>`);
    bindMenu();
    await loadLibrary();
    song = getSong(id) || (await refreshLibrary(), getSong(id));
    if (!song) { toast('Song not found.'); location.hash = '#/songs'; return; }
  }
  let chords = local.get('chords.' + id);
  const prefs = { view: local.get('sheet.view', 'chords'), size: local.get('sheet.size', 0), lang2: local.get('sheet.lang2', false) };
  let looking = false;

  const fromKey = () => chords?.key || song.key || '';
  const toKey = () => local.get('sheet.key.' + id) || song.key || chords?.key || '';
  const draw = () => {
    const minor = parseKey(fromKey())?.minor;
    const keys = minor ? MINOR : KEYS;
    const cur = toKey(), from = fromKey();
    const shown = parseKey(cur);
    const has = chords && Object.keys(chords.parts || {}).length;
    const two = song.sections.some(sec => sec.slides.some(sl => sl.zh?.length));
    const view = has ? prefs.view : 'words';
    const semis = semitones(from, cur), flats = useFlats(cur);
    const chordOf = c => view === 'numbers' ? nashville(c, from) : transposeChord(c, semis, flats);
    const line = l => {
      if (view === 'words' || !/\[/.test(l)) return `<div class="sl">${esc(stripChords(l)) || '&nbsp;'}</div>`;
      return `<div class="sl cl">${parseLine(l).map(p => `<span class="cw"><b class="ch">${p.chord ? esc(chordOf(p.chord)) : ''}</b>${esc(p.text) || (p.chord ? '&nbsp;' : '')}</span>`).join('')}</div>`;
    };
    const prog = l => `<div class="sl prog">${parseLine(l).filter(p => p.chord).map(p => `<b class="ch">${esc(chordOf(p.chord))}</b>`).join(' ')}</div>`;
    const sections = song.sections.map(sec => {
      const got = chords?.parts?.[sec.id] || [];
      let i = 0;
      const body = sec.slides.map(sl => (sl.en || []).map(l => line(got[i++] || l)).join('') +
        (prefs.lang2 && sl.zh?.length ? sl.zh.map(z => `<div class="sl zh">${esc(z)}</div>`).join('') : '')).join('');
      const empty = !sec.slides.some(sl => sl.en?.length || sl.zh?.length);
      return `<section class="sheet-part"><h3>${esc(sec.label)}</h3>${empty ? (view !== 'words' && got.length ? got.map(prog).join('') : '<div class="sl muted">Music only</div>') : body}</section>`;
    }).join('');
    const order = (song.flow || []).filter(x => x !== 'title' && x !== 'blank').map(x => esc(labelFor(song, x)));
    const capo = view === 'chords' ? capoHint(cur) : '';
    show(`<main class="page sheet-page size-${prefs.size}">
      ${header(song.title, { back: '#/songs', right: menuButtons() })}
      <div class="sheet-tools">
        <div class="seg" role="group" aria-label="What to show">
          <button data-v="words" class="${view === 'words' ? 'on' : ''}">Words</button>
          <button data-v="chords" class="${view === 'chords' ? 'on' : ''}" ${has ? '' : 'disabled'}>Chords</button>
          <button data-v="numbers" class="${view === 'numbers' ? 'on' : ''}" ${has ? '' : 'disabled'}>Numbers</button>
        </div>
        ${from ? `<label class="keypick">Key <select class="input" id="key">${keys.map(k => `<option ${shown && parseKey(k).root === shown.root ? 'selected' : ''}>${k}</option>`).join('')}</select></label>` : ''}
        <span class="sizes"><button class="btn ghost small" id="smaller" aria-label="Smaller text">A−</button><button class="btn ghost small" id="bigger" aria-label="Bigger text">A+</button></span>
        ${two ? `<label class="check"><input type="checkbox" id="lang2" ${prefs.lang2 ? 'checked' : ''}> ${esc(song.langs?.[1] || (song.sections.some(sec => sec.slides.some(sl => /[\u3400-\u9fff]/.test((sl.zh || []).join('')))) ? 'Chinese' : 'Second language'))}</label>` : ''}
        <button class="btn ghost small" id="print">${icon('file')}Print</button>
      </div>
      <div class="sheet">
        <div class="sheet-head">
          <img class="sheet-logo" src="/img/chc-logo.svg" alt="">
          <div><h2>${esc(song.title)}</h2>
          <p class="muted">${[song.artist, cur && `Key ${cur}${from && cur !== from ? ` (written in ${from})` : ''}`, view === 'numbers' && from && `Numbers count from ${from}`, langNote(song)].filter(Boolean).map(esc).join(' · ')}</p></div>
        </div>
        ${capo ? `<p class="capo">${esc(capo)}</p>` : ''}
        ${order.length ? `<p class="order"><span>Order</span> ${order.join(' · ')}</p>` : ''}
        ${chords?.intro && view !== 'words' ? `<section class="sheet-part"><h3>Intro</h3>${prog(chords.intro)}</section>` : ''}
        ${sections}
      </div>
      <div class="sheet-foot">
        ${has ? `<p class="small muted">${chords.from === 'online' ? `Chords found online${chords.sources?.length ? ' from ' + chords.sources.map(s => `<a href="${esc(s.uri)}" target="_blank" rel="noopener">${esc(s.title || 'a chord site')}</a>`).join(', ') : ''}. Please check them before you play.` : 'Chords typed in by the team.'}</p>`
          : `<p class="note">${looking ? 'Looking for the chords online. This can take up to a minute…' : 'This song has no chords yet.'}</p>
             ${looking ? '' : '<button class="btn primary" id="find">Find the chords online</button>'}`}
        <div class="row gap wrap">
          ${canEdit(song) ? `<button class="btn ghost" id="editch">${icon('pencil')}${has ? 'Change chords' : 'Type the chords'}</button>
            ${has && store.isAdmin ? '<button class="btn ghost" id="refind">Look for the chords again</button>' : ''}
            <a class="btn ghost" href="#/song/${esc(song.id)}">${icon('pencil')}Change words</a>` : ''}
        </div>
      </div>
    </main>`, 'page-sheet');
    bindMenu();
    $$('[data-v]').forEach(b => b.onclick = () => { prefs.view = b.dataset.v; local.set('sheet.view', prefs.view); draw(); });
    const k = $('#key'); if (k) k.onchange = () => { local.set('sheet.key.' + id, k.value); draw(); };
    $('#smaller').onclick = () => { prefs.size = Math.max(-1, prefs.size - 1); local.set('sheet.size', prefs.size); draw(); };
    $('#bigger').onclick = () => { prefs.size = Math.min(3, prefs.size + 1); local.set('sheet.size', prefs.size); draw(); };
    const l2 = $('#lang2'); if (l2) l2.onchange = () => { prefs.lang2 = l2.checked; local.set('sheet.lang2', prefs.lang2); draw(); };
    $('#print').onclick = () => print();
    const find = force => async () => {
      looking = true; if (!force) draw(); else toast('Looking online. This can take up to a minute…', 5000);
      try {
        const d = await chordsApi('POST', '', { action: 'find', id });
        if (d.chords) { chords = d.chords; local.set('chords.' + id, chords); toast('Chords found. Please check them before you play.'); }
      } catch (e) { toast(e.message, 5000); }
      looking = false;
      if (location.hash === '#/sheet/' + id) draw();
    };
    const f = $('#find'); if (f) f.onclick = find(false);
    const rf = $('#refind'); if (rf) rf.onclick = find(true);
    const ed = $('#editch'); if (ed) ed.onclick = () => editChords(song, chords);
  };
  draw();
  // Get the newest chords in the background.
  chordsApi('GET', '?id=' + encodeURIComponent(id)).then(d => {
    const was = JSON.stringify(chords || null);
    chords = d.chords; if (chords) local.set('chords.' + id, chords); else local.del('chords.' + id);
    if (JSON.stringify(chords || null) !== was && location.hash === '#/sheet/' + id) draw();
  }).catch(e => console.warn(e));
}

// Type or fix the chords: one box per part, chords in [brackets] before the word.
function editChords(song, chords) {
  const back = '#/sheet/' + song.id;
  const box = sec => {
    const lines = sec.slides.flatMap(sl => sl.en || []);
    const got = chords?.parts?.[sec.id] || [];
    return lines.length ? lines.map((l, i) => got[i] || l).join('\n') : got.join('\n');
  };
  show(`<main class="page narrow">
    ${header('Chords: ' + song.title, { back, right: menuButtons() })}
    <p class="note">Put each chord in square brackets just before the word where it changes, like <b>[G]Amazing [D]grace</b>. Keep one line per line of words, and don't change the words. For music-only parts, type just the chords, like <b>[G] [D] [Em] [C]</b>.</p>
    <div class="row2">
      <label>Key these chords are in<input class="input" id="ck" value="${esc(chords?.key || song.key || '')}" maxlength="6" placeholder="G"></label>
      <label>Intro <small>(chords only)</small><input class="input" id="ci" value="${esc(chords?.intro || '')}" placeholder="[G] [D] [Em] [C]"></label>
    </div>
    ${song.sections.map(sec => `<label class="chord-box">${esc(sec.label)}<textarea class="input mono" data-sec="${esc(sec.id)}" rows="${Math.max(2, Math.min(12, box(sec).split('\n').length + 1))}">${esc(box(sec))}</textarea></label>`).join('')}
    <p class="error" id="err" role="alert"></p>
    <div class="bar"><a class="btn ghost" href="${back}">Cancel</a><button class="btn primary big" id="save">Save chords</button></div>
  </main>`);
  bindMenu();
  $('#save').onclick = async () => {
    const key = $('#ck').value.trim();
    if (key && !parseKey(key)) { $('#err').textContent = 'Please type a key like G, Bb or Em.'; return; }
    const parts = {};
    $$('[data-sec]').forEach(t => { parts[t.dataset.sec] = t.value.replace(/\r/g, '').split('\n').map(x => x.trimEnd()).filter((x, i, a) => x || i < a.length - 1); });
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const d = await chordsApi('POST', '', { action: 'save', id: song.id, chords: { key, intro: $('#ci').value.trim(), parts } });
      if (d.chords) local.set('chords.' + song.id, d.chords); else local.del('chords.' + song.id);
      toast(d.chords ? 'Chords saved.' : 'Chords removed.');
      location.hash = back;
    } catch (e) { $('#err').textContent = e.message; btn.disabled = false; btn.textContent = 'Save chords'; }
  };
}

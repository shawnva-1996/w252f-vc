// New set, step by step: place → TV connection → praise songs → worship songs → order → save.
import { show, esc, toast, header, $, $$, today } from './ui.js';
import { store, local, getDraft, saveDraft, createSet } from './store.js';
import { loadLibrary, getSong, buildSlides, labelFor } from './songs.js';
import { drawSlide, PLACES } from './render.js';

const STEPS = ['place', 'screen', 'praise-count', 'praise-pick', 'worship-count', 'worship-pick', 'flow', 'save'];

function steps(cur) {
  const i = STEPS.indexOf(cur);
  return `<div class="steps" aria-label="Step ${i + 1} of ${STEPS.length}">${STEPS.map((_, j) => `<i class="${j <= i ? 'on' : ''}"></i>`).join('')}</div>`;
}

let lib = [];

export async function wizard(step = 'place', arg) {
  const d = getDraft();
  lib = await loadLibrary();
  switch (step) {
    case 'place': return place(d);
    case 'screen': return screen(d);
    case 'praise-count': return count(d, 'praise');
    case 'worship-count': return count(d, 'worship');
    case 'praise-pick': return pick(d, 'praise');
    case 'worship-pick': return pick(d, 'worship');
    case 'flow': return flow(d, Number(arg) || 0);
    case 'save': return save(d);
    default: location.hash = '#/new/place';
  }
}

const SAMPLE = { kind: 'lyric', en: ['Your presence is an open door', 'We want You Lord like never before'], zh: ['祢同在 如天堂敞开', '渴望祢主 全新经历祢'] };

function place(d) {
  show(`<main class="page">
    ${header('Where are you today?', { back: '#/home' })}
    ${steps('place')}
    <p class="lead">Pick one. You'll see how the words will look.</p>
    <div class="place-grid">
      ${Object.entries(PLACES).map(([id, p]) => `<button class="place-card ${d.place === id ? 'sel' : ''}" data-place="${id}">
        <div class="pv" data-pv="${id}"></div><b>${p.name}</b>
        <small>${id === 'suntec' ? 'Words at the top, smaller' : 'Words in the middle, bigger'}</small>
      </button>`).join('')}
    </div>
    <div class="bar"><a class="btn primary big" href="#/new/screen">Next</a></div>
  </main>`);
  $$('[data-pv]').forEach(b => drawSlide(b, SAMPLE, { place: b.dataset.pv }));
  $$('[data-place]').forEach(b => b.onclick = () => {
    d.place = b.dataset.place; local.set('place', d.place); saveDraft();
    $$('[data-place]').forEach(x => x.classList.toggle('sel', x === b));
  });
}

function screen(d) {
  show(`<main class="page">
    ${header('How is the TV connected?', { back: '#/new/place' })}
    ${steps('screen')}
    <div class="choices">
      <button class="choice ${d.connection === 'cable' ? 'sel' : ''}" data-c="cable">
        <span class="ico" aria-hidden="true">🔌</span><b>With a cable (HDMI)</b>
        <small>The TV is plugged into this laptop</small></button>
      <button class="choice ${d.connection === 'device' ? 'sel' : ''}" data-c="device">
        <span class="ico" aria-hidden="true">📶</span><b>No cable</b>
        <small>Another device shows the words (a TV, iPad or second laptop). It needs internet.</small></button>
    </div>
    <div class="bar"><a class="btn primary big" href="#/new/praise-count">Next</a></div>
  </main>`);
  $$('[data-c]').forEach(b => b.onclick = () => {
    d.connection = b.dataset.c; local.set('connection', d.connection); saveDraft();
    $$('[data-c]').forEach(x => x.classList.toggle('sel', x === b));
  });
}

function count(d, cat) {
  const key = cat + 'Count';
  const back = cat === 'praise' ? '#/new/screen' : '#/new/praise-pick';
  show(`<main class="page">
    ${header(`How many ${cat} songs?`, { back })}
    ${steps(cat + '-count')}
    <div class="num-grid">${[0, 1, 2, 3, 4, 5].map(n => `<button class="num ${d[key] === n ? 'sel' : ''}" data-n="${n}">${n}</button>`).join('')}</div>
    <div class="bar"><button class="btn primary big" id="next">Next</button></div>
  </main>`);
  $$('[data-n]').forEach(b => b.onclick = () => {
    d[key] = Number(b.dataset.n);
    d[cat] = d[cat].slice(0, d[key]);
    saveDraft();
    $$('[data-n]').forEach(x => x.classList.toggle('sel', x === b));
  });
  $('#next').onclick = () => {
    if (d[key] === 0) location.hash = cat === 'praise' ? '#/new/worship-count' : (d.praiseCount ? '#/new/flow/0' : '#/new/praise-count');
    else location.hash = `#/new/${cat}-pick`;
  };
}

function pick(d, cat) {
  const need = d[cat + 'Count'];
  const all = lib;
  const back = `#/new/${cat}-count`;
  show(`<main class="page">
    ${header(`Choose ${need} ${cat} song${need > 1 ? 's' : ''}`, { back })}
    ${steps(cat + '-pick')}
    <div class="sticky-tools">
      <input class="input search" id="q" type="search" placeholder="Type a song name…" aria-label="Search songs">
      <div class="seg" role="tablist">
        <button class="on" data-f="${cat}">${cat === 'praise' ? 'Praise' : 'Worship'}</button>
        <button data-f="all">All songs</button>
      </div>
      <p class="picked" id="picked"></p>
    </div>
    <ul class="song-list" id="list"></ul>
    <p class="small muted center">Can't find it? <a href="#/song/new">Add a new song</a></p>
    <div class="bar"><button class="btn primary big" id="next">Next</button></div>
  </main>`);
  let filter = cat;
  const render = () => {
    const q = $('#q').value.trim().toLowerCase();
    const items = all.filter(s => (filter === 'all' || s.cat === filter) && (!q || s.title.toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q)));
    $('#list').innerHTML = items.map(s => {
      const on = d[cat].includes(s.id);
      return `<li><button class="song-row ${on ? 'sel' : ''}" data-id="${s.id}" aria-pressed="${on}">
        <span class="tick" aria-hidden="true">${on ? '✓' : ''}</span>
        <span class="t"><b>${esc(s.title)}</b><small>${esc(s.artist || '')}${s.key ? ' · Key ' + esc(s.key) : ''}</small></span></button></li>`;
    }).join('') || '<li class="muted">No songs found.</li>';
    $('#picked').textContent = `${d[cat].length} of ${need} chosen` + (d[cat].length ? ': ' + d[cat].map(id => getSong(id)?.title).join(', ') : '');
    $('#next').disabled = d[cat].length !== need;
  };
  $('#q').oninput = render;
  $$('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; $$('[data-f]').forEach(x => x.classList.toggle('on', x === b)); render(); });
  $('#list').onclick = e => {
    const b = e.target.closest('[data-id]'); if (!b) return;
    const id = b.dataset.id, arr = d[cat];
    if (arr.includes(id)) arr.splice(arr.indexOf(id), 1);
    else if (arr.length < need) arr.push(id);
    else { toast(`You already chose ${need}. Tap a chosen song to remove it.`); return; }
    saveDraft(); render();
  };
  $('#next').onclick = () => location.hash = cat === 'praise' ? '#/new/worship-count' : '#/new/flow/0';
  render();
}

function orderedSongs(d) {
  return [...d.praise.map(id => ({ id, cat: 'praise' })), ...d.worship.map(id => ({ id, cat: 'worship' }))].filter(x => getSong(x.id));
}

function flow(d, i) {
  const list = orderedSongs(d);
  if (!list.length) { toast('Please choose at least one song.'); location.hash = '#/new/praise-count'; return; }
  if (i >= list.length) { location.hash = '#/new/save'; return; }
  const song = getSong(list[i].id);
  if (!d.flows[song.id]) { d.flows[song.id] = [...(song.flow?.length ? song.flow : ['title', ...song.sections.map(s => s.id)])]; saveDraft(); }
  const f = d.flows[song.id];
  const back = i === 0 ? (d.worshipCount ? '#/new/worship-pick' : '#/new/praise-pick') : `#/new/flow/${i - 1}`;
  const first = id => { const s = song.sections.find(x => x.id === id); const sl = s?.slides?.[0]; return sl ? (sl.en?.[0] || sl.zh?.[0] || '') : ''; };
  const draw = () => {
    $('#flow').innerHTML = f.map((id, k) => `<li class="flow-row">
      <span class="n">${k + 1}</span>
      <span class="t"><b>${esc(labelFor(song, id))}</b><small>${esc(first(id))}</small></span>
      <span class="acts">
        <button class="ic" data-up="${k}" aria-label="Move up" ${k === 0 ? 'disabled' : ''}>↑</button>
        <button class="ic" data-down="${k}" aria-label="Move down" ${k === f.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="ic" data-copy="${k}" aria-label="Repeat this">⧉</button>
        <button class="ic danger" data-del="${k}" aria-label="Remove">✕</button>
      </span></li>`).join('') || '<li class="muted">Nothing yet. Tap a part below to add it.</li>';
    $('#count').textContent = buildSlides(song, f).length + ' slides';
  };
  show(`<main class="page">
    ${header('Set the song order', { back })}
    ${steps('flow')}
    <p class="lead"><b>${esc(song.title)}</b> <span class="muted">(${i + 1} of ${list.length} · ${list[i].cat})</span></p>
    <p class="small muted">Already set to how we usually sing it. Change it if you like. <span id="count"></span></p>
    <ol class="flow" id="flow"></ol>
    <p class="q">Tap to add a part at the end:</p>
    <div class="chips">
      ${song.sections.map(s => `<button class="chip" data-add="${esc(s.id)}">+ ${esc(s.label)}</button>`).join('')}
      <button class="chip soft" data-add="title">+ Song title</button>
      <button class="chip soft" data-add="blank">+ Blank</button>
    </div>
    <button class="link" id="reset">Start again from the usual order</button>
    <div class="bar"><button class="btn primary big" id="next">${i + 1 < list.length ? 'Next song' : 'Done'}</button></div>
  </main>`);
  draw();
  $('main').onclick = e => {
    const t = e.target.closest('button'); if (!t) return;
    const ds = t.dataset;
    if (ds.add) f.push(ds.add);
    else if (ds.up) { const k = +ds.up; [f[k - 1], f[k]] = [f[k], f[k - 1]]; }
    else if (ds.down) { const k = +ds.down; [f[k + 1], f[k]] = [f[k], f[k + 1]]; }
    else if (ds.copy) { const k = +ds.copy; f.splice(k + 1, 0, f[k]); }
    else if (ds.del) f.splice(+ds.del, 1);
    else return;
    saveDraft(); draw();
  };
  $('#reset').onclick = () => { d.flows[song.id] = [...(song.flow?.length ? song.flow : ['title', ...song.sections.map(s => s.id)])]; saveDraft(); flow(d, i); };
  $('#next').onclick = () => location.hash = `#/new/flow/${i + 1}`;
}

async function save(d) {
  const list = orderedSongs(d);
  const name = `${today()} · ${d.place === 'cell' ? 'Home cell group' : 'Suntec'}`;
  show(`<main class="page narrow">
    ${header('Save your set', { back: `#/new/flow/${Math.max(0, list.length - 1)}` })}
    ${steps('save')}
    <label>Name this set<input class="input" id="name" value="${esc(name)}"></label>
    <ol class="summary">${list.map(x => `<li>${esc(getSong(x.id).title)} <small class="muted">${x.cat}</small></li>`).join('')}</ol>
    <div class="bar"><button class="btn primary big" id="save">Save and start</button></div>
  </main>`);
  $('#save').onclick = async () => {
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    const songs = list.map(x => { const s = getSong(x.id); return { id: s.id, title: s.title, artist: s.artist || '', cat: x.cat, flow: d.flows[s.id] || s.flow }; });
    const slides = songs.flatMap((s, k) => buildSlides(getSong(s.id), s.flow, k));
    try {
      const id = await createSet({
        name: $('#name').value.trim() || name, place: d.place, connection: d.connection,
        showZh: true, bg: { type: 'gradient', id: 'forest' }, songs, slides
      });
      store.draft = null; sessionStorage.removeItem('w252f.draft');
      toast('Saved. You can find it again under "Your song sets".');
      location.hash = '#/set/' + id;
    } catch (e) {
      console.error(e); btn.disabled = false; btn.textContent = 'Save and start';
      toast('Could not save. Please check the internet and try again.');
    }
  };
}

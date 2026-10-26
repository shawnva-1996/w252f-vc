// The laptop "command centre": run the slides, change words, order and backgrounds.
import { show, esc, toast, header, modal, confirmBox, icon, $, $$ } from './ui.js';
import { store, getSet, updateSet, listMedia, addMedia, mediaUrl, removeMedia, shrinkImage, isVideo, uploadVideo, removeVideo } from './store.js';
import { drawSlide, GRADIENTS, PHOTOS, photoUrl, PLACES, LANGS, langOf, bgCss } from './render.js';
import { publish, republish, canCast, startCast } from './live.js';
import { loadLibrary, getSong, buildSlides, matches } from './songs.js';
import { menuButtons, bindMenu, loading } from './main.js';
import { db, C, doc, getDoc } from './firebase.js';

let S = null;          // the set
let at = 0, black = false, hidden = false, editing = false;
let saveTimer = null;
let keyHandler = null;
let remoteWatch = null;
let pendingDecks = [];   // slide files chosen while making a new set

// Slide files to add as soon as the new set opens.
export const queueDecks = files => { pendingDecks = [...files]; };

export async function controlScreen(id, then) {
  show(`<main class="page">${loading('Opening your set…')}</main>`);
  S = await getSet(id);
  if (!S) { toast('That set was not found.'); location.hash = '#/home'; return; }
  S.slides = S.slides || [];
  at = Math.min(Number(sessionStorage.getItem('w252f.at.' + id)) || 0, Math.max(0, S.slides.length - 1));
  black = hidden = editing = false;
  layout();
  send();
  // From "Add" on the home screen: show the add buttons straight away.
  if (then === 'add') {
    history.replaceState(null, '', '#/set/' + id);
    const row = $('#addrow');
    row.scrollIntoView({ block: 'center' });
    row.classList.add('flash');
  }
  if (pendingDecks.length) {
    const files = pendingDecks; pendingDecks = [];
    (async () => { for (const f of files) if (S?.id === id) await addDeck(f); })();
  }
  // Pictures and the song library load quietly after the screen is up.
  loadLibrary().catch(() => {});
  listMedia().catch(() => []).then(resolveMedia).then(() => { if (S?.id === id && hasImages()) { drawGrid(); refresh(); } });
  freshen(id);
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
  keyHandler = onKey;
  document.addEventListener('keydown', keyHandler);
  window.addEventListener('hashchange', () => document.removeEventListener('keydown', keyHandler), { once: true });
}

const hasImages = () => [S.bg, ...S.slides.map(s => s.bg)].some(b => b?.type === 'image');

// If this set was changed on another device, show the newer copy.
async function freshen(id) {
  try {
    const snap = await getDoc(doc(db, C.sets, id));
    if (!snap.exists() || S?.id !== id || editing) return;
    const d = snap.data();
    if ((d.updatedMs || 0) > (S.updatedMs || 0)) { S = { id, ...d, slides: d.slides || [] }; at = Math.min(at, Math.max(0, S.slides.length - 1)); layout(); send(); }
  } catch {}
}

async function resolveMedia() {
  const ids = new Set([S.bg, ...S.slides.map(s => s.bg)].filter(b => b?.type === 'image').map(b => b.mediaId));
  await Promise.all([...ids].map(mediaUrl));
}

const bgOf = sl => sl?.bg || S.bg || { type: 'gradient', id: 'forest' };
const renderBg = b => b?.type === 'image' ? (isVideo(b.mediaId)
    ? { type: 'video', url: store.media.get(b.mediaId), poster: store.posters.get(b.mediaId) || '' }
    : { type: 'image', url: store.media.get(b.mediaId) })
  : b?.type === 'photo' ? { type: 'image', url: location.origin + photoUrl(b.id) } : b;
const bgKey = b => b?.type === 'image' ? (store.media.has(b.mediaId) ? 'm:' + b.mediaId : 'loading') : b?.type === 'photo' ? 'p:' + b.id : (b?.id || 'forest');
// The background picker's value for a background, and back again.
const bgPick = b => !b ? 'same' : b.type === 'image' ? 'm:' + b.mediaId : b.type === 'photo' ? 'p:' + b.id : 'g:' + b.id;
const fromPick = v => v.startsWith('m:') ? { type: 'image', mediaId: v.slice(2) } : v.startsWith('p:') ? { type: 'photo', id: v.slice(2) } : { type: 'gradient', id: v.slice(2) };
// One of your own pictures or videos (videos show their still picture and a small play mark).
const mediaSwatch = (id, url, attr) => `<button class="bgsw ${isVideo(id) ? 'vid' : ''}" style="background:#000 center/cover url('${isVideo(id) ? store.posters.get(id) : url}')" ${attr}="${attr === 'data-m' ? id : 'm:' + id}" aria-label="${isVideo(id) ? 'Your video' : 'Your picture'}"></button>`;
const photoSwatches = attr => PHOTOS.map(p => `<button class="bgsw" style="background:center/cover url('${p.url}')" ${attr}="p:${p.id}" title="${p.name}" aria-label="${p.name}"></button>`).join('');
const opts = (sl, extra = {}) => ({ place: S.place, lang: langOf(S), bg: renderBg(bgOf(sl)), ...extra });

function send() {
  const sl = S.slides[at];
  const b = bgOf(sl);
  publish(store.uid, {
    setId: S.id, index: at, total: S.slides.length, frame: sl ? frameOf(sl) : { kind: 'blank' },
    black, hidden, place: S.place, lang: langOf(S), bgKey: bgKey(b), bg: renderBg(b), preload: preloadFrom(at + 1)
  });
  sessionStorage.setItem('w252f.at.' + S.id, at);
}
const frameOf = sl => ({ kind: sl.kind, en: sl.en || [], zh: sl.zh || [], title: sl.title || '', artist: sl.artist || '', label: sl.label || '', ...(sl.src ? { src: sl.src } : {}), ...(sl.vids ? { vids: sl.vids, ar: sl.ar } : {}) });
// The next slide pictures, so the TV can fetch them before they are needed.
const preloadFrom = i => S.slides.slice(i, i + 3).filter(s => s.kind === 'image' && s.src).map(s => s.src);

function persist(msg, ms) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await updateSet(S.id, { name: S.name, place: S.place, lang: langOf(S), bg: S.bg, slides: S.slides, songs: S.songs });
      if (msg) toast(msg, ms);
    } catch (e) { console.error(e); toast('Could not save the change. Check the internet.'); }
  }, 400);
}

// Screen layout ----------------------------------------------------------
function layout() {
  show(`<main class="control ${editing ? 'editing' : ''}">
    ${header(S.name || 'Song set', { back: '#/home', right: menuButtons() })}
    <section class="live-area">
      <div class="now-wrap">
        <div class="lbl">On the TV now <span class="badge" id="state"></span></div>
        <div class="now-info" id="info"></div>
        <div class="now stage" id="now" aria-label="Slide on the TV now"></div>
        <button class="status-banner" id="banner" hidden></button>
      </div>
      <div class="next-wrap">
        <div class="lbl">Next</div>
        <div class="next stage" id="next" aria-label="Next slide"></div>
        <div class="pos" id="pos"></div>
      </div>
    </section>
    <section class="pad">
      <button class="btn huge" id="back" aria-label="Back one slide">${icon('back')}Back</button>
      <button class="btn huge primary" id="fwd" aria-label="Next slide">Next${icon('next')}</button>
    </section>
    <section class="tools">
      <button class="btn tool" id="tv">${icon('tv')}Show on TV</button>
      <button class="btn tool ${black ? 'on' : ''}" id="black">${icon('black')}Black screen</button>
      <button class="btn tool ${hidden ? 'on' : ''}" id="hide">${icon('eyeoff')}Hide words</button>
      <button class="btn tool" id="look">${icon('look')}Look</button>
      <button class="btn tool" id="slidebg">${icon('image')}Slide background</button>
      <button class="btn tool ${editing ? 'on' : ''}" id="edit">${icon('pencil')}${editing ? 'Done changing' : 'Change slides'}</button>
    </section>
    ${editing ? `<p class="note">Tap the pencil to change words, the arrows to move, the double square to repeat, and the cross to remove. Changes save by themselves.</p>` : ''}
    <section class="add-row" id="addrow" aria-label="Add to this set">
      <button class="btn" id="addsong">${icon('plus')}Add a song</button>
      <label class="btn file-btn" id="adddeck">${icon('file')}<span>Add slides (PDF or PowerPoint)</span>
        <input type="file" id="deckfile" accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation" hidden></label>
    </section>
    <p class="small muted center add-hint">Greetings, sermon or announcement slides work too. New things go at the end. To move a song or slides, tap its ${icon('up')} or ${icon('down')} arrow.</p>
    <section class="grid" id="grid"></section>
    <nav class="remote" id="remote" aria-label="Slide remote" hidden>
      <button class="btn" id="r-back" aria-label="Back one slide">${icon('back')}</button>
      <button class="r-info" id="r-info" aria-label="Go to the top"><b id="r-pos"></b><small id="r-part"></small></button>
      <button class="btn primary" id="r-fwd" aria-label="Next slide">Next${icon('next')}</button>
    </nav>
  </main>`, 'page-control');
  bindMenu();
  $('#back').onclick = $('#r-back').onclick = () => goTo(at - 1);
  $('#fwd').onclick = $('#r-fwd').onclick = () => goTo(at + 1);
  $('#r-info').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // When the big Back / Next buttons scroll out of sight, keep a small remote on screen.
  remoteWatch?.disconnect();
  remoteWatch = new IntersectionObserver(([e]) => { const r = $('#remote'); if (r) r.hidden = e.isIntersecting; }, { threshold: 0.6 });
  remoteWatch.observe($('.pad'));
  $('#black').onclick = () => { black = !black; if (black) hidden = false; refresh(); };
  $('#hide').onclick = () => { hidden = !hidden; if (hidden) black = false; refresh(); };
  $('#tv').onclick = tvDialog;
  $('#look').onclick = lookDialog;
  $('#slidebg').onclick = () => slideBgDialog(at);
  $('#edit').onclick = () => { editing = !editing; layout(); };
  $('#addsong').onclick = addSongDialog;
  $('#deckfile').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) addDeck(f); };
  swipe($('#now'));
  drawGrid();
  refresh();
}

function refresh() {
  const sl = S.slides[at], nx = S.slides[at + 1];
  drawSlide($('#now'), sl ? frameOf(sl) : null, opts(sl, { black, hidden, preview: true }));
  drawSlide($('#next'), nx ? frameOf(nx) : { kind: 'blank' }, opts(nx, { preview: true, still: true }));
  $('#pos').textContent = S.slides.length ? `Slide ${at + 1} of ${S.slides.length}` : 'No slides yet';
  $('#state').textContent = black ? 'Black screen' : hidden ? 'Words hidden' : 'Live';
  $('#state').className = 'badge ' + (black || hidden ? 'warn' : 'ok');
  const song = sl ? S.songs[sl.song] : null;
  $('#info').innerHTML = sl ? `${esc(song?.title || '')} <small>· ${esc(sl.label || '')}</small>` : '';
  const banner = $('#banner');
  banner.hidden = !(black || hidden);
  banner.textContent = black ? 'The TV is black now. Tap here to show the words again.' : 'The words are hidden. Tap here to show them again.';
  banner.onclick = () => { black = hidden = false; refresh(); };
  $('#black').classList.toggle('on', black);
  $('#hide').classList.toggle('on', hidden);
  $('#back').disabled = $('#r-back').disabled = at <= 0;
  $('#fwd').disabled = $('#r-fwd').disabled = at >= S.slides.length - 1;
  $('#r-pos').textContent = S.slides.length ? `${at + 1} / ${S.slides.length}` : '';
  $('#r-part').textContent = black ? 'Black screen' : hidden ? 'Words hidden' : [song?.title, sl?.label].filter(Boolean).join(' · ');
  $$('.thumb').forEach(t => t.classList.toggle('cur', Number(t.dataset.i) === at));
  send();
}

function goTo(i) {
  if (i < 0 || i >= S.slides.length) return;
  at = i; black = false; hidden = false;
  refresh();
  const cur = $(`.thumb[data-i="${at}"]`);
  if (cur && !editing) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function drawGrid() {
  const groups = [];
  S.slides.forEach((sl, i) => {
    const g = groups[groups.length - 1];
    if (!g || g.song !== sl.song) groups.push({ song: sl.song, items: [{ sl, i }] });
    else g.items.push({ sl, i });
  });
  $('#grid').innerHTML = groups.map((g, gi) => {
    const song = S.songs[g.song] || { title: 'Extra slides' };
    return `<div class="group" data-g="${gi}"><h3>${groups.length > 1 ? `<span class="gmove"><button class="ic" data-gup="${gi}" aria-label="Move ${esc(song.title)} up" title="Move up" ${gi === 0 ? 'disabled' : ''}>${icon('up')}</button><button class="ic" data-gdown="${gi}" aria-label="Move ${esc(song.title)} down" title="Move down" ${gi === groups.length - 1 ? 'disabled' : ''}>${icon('down')}</button></span>` : ''}${esc(song.title)} ${song.cat ? `<small>${esc(song.cat)}</small>` : ''}
      ${editing && S.songs[g.song] ? `<span class="gacts">${song.deck ? '' : `<button class="btn ghost small" data-addpart="${g.song}">${icon('plus')}Add a part</button>`}<button class="btn ghost small" data-rmsong="${g.song}">${song.deck ? 'Remove these slides' : 'Remove song'}</button></span>` : ''}</h3>
      <div class="thumbs">${g.items.map(({ sl, i }) => `<div class="thumb ${i === at ? 'cur' : ''}" data-i="${i}">
        <button class="tbtn" data-go="${i}" aria-label="Show slide ${i + 1}"><div class="stage mini" data-mini="${i}"></div></button>
        <div class="tl"><span>${i + 1}. ${esc(sl.label || '')}</span></div>
        ${editing ? `<div class="tacts">
          ${sl.kind === 'image' ? '' : `<button class="ic" data-ed="${i}" aria-label="Change words">${icon('pencil')}</button>`}
          <button class="ic" data-mu="${i}" aria-label="Move earlier" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button>
          <button class="ic" data-md="${i}" aria-label="Move later" ${i === S.slides.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
          <button class="ic" data-cp="${i}" aria-label="Repeat this slide">${icon('copy')}</button>
          <button class="ic" data-bl="${i}" aria-label="Add blank slide after">${icon('blank')}</button>
          <button class="ic danger" data-rm="${i}" aria-label="Remove slide">${icon('x')}</button>
        </div>` : ''}
      </div>`).join('')}</div></div>`;
  }).join('') || '<p class="muted center">This set has no slides. Tap "Change slides" then "Add a song".</p>';
  // Draw thumbnails lazily so big sets stay fast.
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const i = Number(e.target.dataset.mini); const sl = S.slides[i];
    drawSlide(e.target, frameOf(sl), opts(sl, { preview: true, still: true })); io.unobserve(e.target);
  }), { rootMargin: '200px' });
  $$('[data-mini]').forEach(m => io.observe(m));
  $('#grid').onclick = e => {
    const b = e.target.closest('[data-gup], [data-gdown]');
    if (b) return moveGroup(groups, Number(b.dataset.gup ?? b.dataset.gdown), b.dataset.gup !== undefined ? -1 : 1);
    gridClick(e);
  };
}

// Move a whole group (a song, or greetings / sermon slides) one place up or down.
function moveGroup(groups, from, dir) {
  const to = from + dir;
  if (to < 0 || to >= groups.length) return;
  const cur = S.slides[at]?.id;
  const runs = groups.map(g => g.items.map(x => x.sl));
  [runs[from], runs[to]] = [runs[to], runs[from]];
  S.slides = runs.flat();
  at = Math.max(0, S.slides.findIndex(sl => sl.id === cur));
  persist('Moved.'); drawGrid(); refresh();
  // Keep the moved group in view.
  $$('#grid .group')[to]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function gridClick(e) {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset, n = k => Number(k);
  if (d.go !== undefined) { if (editing && S.slides[n(d.go)].kind !== 'image') return editSlide(n(d.go)); return goTo(n(d.go)); }
  if (d.ed !== undefined) return editSlide(n(d.ed));
  if (d.mu !== undefined) { const i = n(d.mu); swap(i, i - 1); }
  else if (d.md !== undefined) { const i = n(d.md); swap(i, i + 1); }
  else if (d.cp !== undefined) { const i = n(d.cp); S.slides.splice(i + 1, 0, { ...structuredClone(S.slides[i]), id: rid() }); }
  else if (d.bl !== undefined) { const i = n(d.bl); S.slides.splice(i + 1, 0, { id: rid(), song: S.slides[i].song, label: 'Blank', kind: 'blank' }); }
  else if (d.rm !== undefined) { const i = n(d.rm); S.slides.splice(i, 1); if (at >= S.slides.length) at = Math.max(0, S.slides.length - 1); }
  else if (d.addpart !== undefined) return addPartDialog(n(d.addpart));
  else if (d.rmsong !== undefined) return removeSong(n(d.rmsong));
  else return;
  persist(); drawGrid(); refresh();
}

function swap(a, b) {
  if (b < 0 || b >= S.slides.length) return;
  [S.slides[a], S.slides[b]] = [S.slides[b], S.slides[a]];
  const sa = S.slides[a].song, sb = S.slides[b].song;
  if (sa !== sb) { const t = S.slides[a].song; S.slides[a].song = S.slides[b].song; S.slides[b].song = t; }
  if (at === a) at = b; else if (at === b) at = a;
}
const rid = () => Math.random().toString(36).slice(2, 10);

// Your own pictures and videos, used as backgrounds. Each returns the new media id.
async function uploadPicture(file) {
  toast('Adding your picture…');
  const url = await shrinkImage(file);
  return addMedia(url);
}
async function uploadClip(file, onPct) {
  const { url, poster } = await uploadVideo(file, onPct);
  return addMedia(url, { kind: 'video', poster });
}
// The row of backgrounds to pick from, ending with "use my own picture / video".
const bgChoices = (attr, same) => `${same ? `<button class="bgsw" ${attr}="same">${same}</button>` : ''}
  ${GRADIENTS.map(g => `<button class="bgsw" style="background:${g.css}" ${attr}="g:${g.id}" title="${g.name}" aria-label="${g.name}"></button>`).join('')}
  ${photoSwatches(attr)}
  ${[...store.media.entries()].map(([id, url]) => mediaSwatch(id, url, attr)).join('')}
  <label class="bgsw upload" title="Use my own picture">${icon('plus')}My picture<input type="file" accept="image/*" data-uppic hidden></label>
  <label class="bgsw upload" title="Use my own video">${icon('plus')}<span>My video</span><input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.m4v,.webm" data-upvid hidden></label>`;
// Wire the upload buttons in a background row: new pictures and videos join the row and get picked.
function bindUploads(row, attr, onPick) {
  const add = id => {
    const b = document.createElement('div');
    b.innerHTML = mediaSwatch(id, store.media.get(id), attr);
    row.insertBefore(b.firstElementChild, $('.upload', row));
    onPick('m:' + id);
  };
  $('[data-uppic]', row).onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try { add(await uploadPicture(f)); toast('Picture added.'); } catch (err) { console.error(err); toast(err.message || 'Could not add that picture.'); }
  };
  $('[data-upvid]', row).onchange = async e => {
    const f = e.target.files[0], inp = e.target, lbl = inp.closest('label'), txt = $('span', lbl); inp.value = ''; if (!f) return;
    lbl.classList.add('busy'); inp.disabled = true; txt.textContent = 'Uploading…';
    try { add(await uploadClip(f, pc => { txt.textContent = `Uploading ${pc}%`; })); toast('Video added.'); }
    catch (err) { console.error(err); toast(err.message || 'Could not add that video.', 5000); }
    lbl.classList.remove('busy'); inp.disabled = false; txt.textContent = 'My video';
  };
}

// A picture, video or colour behind one slide (or the whole song), straight from the tools.
async function slideBgDialog(i) {
  const sl = S.slides[i];
  if (!sl) return;
  if (sl.kind === 'image') return toast('This is a slide from a PDF or PowerPoint file. It fills the whole screen, so it has no background.', 5000);
  const song = S.songs[sl.song];
  const p = modal(`<h2>Background for slide ${i + 1}</h2>
    <p class="muted">${esc([song?.title, sl.label].filter(Boolean).join(' · '))}</p>
    <div class="stage preview" id="m-pv"></div>
    <div class="bg-row" id="m-bg">${bgChoices('data-bgx', 'Same as the set')}</div>
    <p class="small muted">Videos play on a loop with no sound. A short MP4 works on every TV.</p>
    <div class="row gap wrap">
      <button class="btn ghost" data-v="cancel">Cancel</button>
      ${song && !song.deck ? `<button class="btn" data-v="song">Use for all of this song</button>` : ''}
      <button class="btn primary" data-v="slide">Use for this slide</button>
    </div>`, { wide: true });
  const w = modal.current, row = $('#m-bg', w);
  let pick = bgPick(sl.bg);
  const show = () => {
    $$('[data-bgx]', w).forEach(b => b.classList.toggle('sel', b.dataset.bgx === pick));
    drawSlide($('#m-pv', w), frameOf(sl), opts({ ...sl, bg: pick === 'same' ? undefined : fromPick(pick) }));
  };
  show();
  row.onclick = e => { const b = e.target.closest('[data-bgx]'); if (b) { pick = b.dataset.bgx; show(); } };
  bindUploads(row, 'data-bgx', v => { pick = v; show(); });
  const v = await p;
  if (!v) return;
  const bg = pick === 'same' ? null : fromPick(pick);
  const set = s => { if (bg) s.bg = bg; else delete s.bg; };
  if (v === 'song') S.slides.forEach(s => { if (s.song === sl.song && s.kind !== 'image') set(s); });
  else set(sl);
  persist(v === 'song' ? 'Background set for the whole song.' : 'Background set for this slide.');
  await resolveMedia(); drawGrid(); refresh();
}

// Change one slide's words and background
async function editSlide(i) {
  const sl = S.slides[i];
  const isLyric = sl.kind === 'lyric' || sl.kind === 'blank';
  const p = modal(`<h2>Change slide ${i + 1}</h2>
    <label>Name of this part<input class="input" id="m-label" value="${esc(sl.label || '')}"></label>
    ${sl.kind === 'title' ? `
      <label>Song title<input class="input" id="m-title" value="${esc(sl.title || '')}"></label>
      <label>Sung by<input class="input" id="m-artist" value="${esc(sl.artist || '')}"></label>` : `
      <label>Main words <small>(any language, one line per row)</small><textarea class="input" id="m-en" rows="3">${esc((sl.en || []).join('\n'))}</textarea></label>
      <label>Second language <small>(e.g. Chinese; leave empty if none)</small><textarea class="input" id="m-zh" rows="3">${esc((sl.zh || []).join('\n'))}</textarea></label>`}
    <div class="lbl">Background for this slide</div>
    <div class="bg-row" id="m-bg">${bgChoices('data-bgx', 'Same as the set')}</div>
    <div class="row gap"><button class="btn ghost" data-v="cancel">Cancel</button><button class="btn primary" data-v="ok">Save</button></div>`, { wide: true });
  const w = modal.current;
  let pickBg = bgPick(sl.bg);
  const mark = () => $$('[data-bgx]', w).forEach(b => b.classList.toggle('sel', b.dataset.bgx === pickBg));
  mark();
  $('#m-bg', w).onclick = e => { const b = e.target.closest('[data-bgx]'); if (b) { pickBg = b.dataset.bgx; mark(); } };
  bindUploads($('#m-bg', w), 'data-bgx', v => { pickBg = v; mark(); });
  w._collect = () => 'save';
  const v = await p;
  if (v !== 'save') return;
  sl.label = $('#m-label', w).value.trim();
  if (sl.kind === 'title') { sl.title = $('#m-title', w).value.trim(); sl.artist = $('#m-artist', w).value.trim(); }
  else {
    sl.en = $('#m-en', w).value.split('\n').map(x => x.trim()).filter(Boolean);
    sl.zh = $('#m-zh', w).value.split('\n').map(x => x.trim()).filter(Boolean);
    sl.kind = sl.en.length || sl.zh.length ? 'lyric' : 'blank';
  }
  if (pickBg === 'same') delete sl.bg;
  else sl.bg = fromPick(pickBg);
  void isLyric;
  persist('Saved.'); await resolveMedia(); drawGrid(); refresh();
}

async function addPartDialog(songIdx) {
  const ref = S.songs[songIdx], song = getSong(ref.id);
  if (!song) return toast('This song is no longer in the library.');
  const v = await modal(`<h2>Add a part of ${esc(song.title)}</h2>
    <p class="muted">It goes after the last slide of this song.</p>
    <div class="chips">${song.sections.map(s => `<button class="chip" data-v="${esc(s.id)}">${icon('plus')}${esc(s.label)}</button>`).join('')}
    <button class="chip soft" data-v="title">${icon('plus')}Song title</button><button class="chip soft" data-v="blank">${icon('plus')}Blank</button></div>
    <div class="row"><button class="btn ghost" data-v="cancel">Close</button></div>`);
  if (!v) return;
  const add = buildSlides(song, [v], songIdx);
  let last = -1; S.slides.forEach((s, i) => { if (s.song === songIdx) last = i; });
  S.slides.splice(last + 1, 0, ...add);
  persist('Added.'); drawGrid(); refresh();
}

async function removeSong(songIdx) {
  if (!(await confirmBox(`Remove "${S.songs[songIdx].title}" and its slides from this set?`, 'Yes, remove'))) return;
  dropSong(songIdx);
  persist('Removed.'); drawGrid(); refresh();
}
function dropSong(songIdx) {
  S.slides = S.slides.filter(s => s.song !== songIdx).map(s => ({ ...s, song: s.song > songIdx ? s.song - 1 : s.song }));
  S.songs.splice(songIdx, 1);
  at = Math.min(at, Math.max(0, S.slides.length - 1));
}

// Greetings, sermon or announcement slides from a PowerPoint or PDF file.
// They go at the end; the group's up arrow moves them anywhere (e.g. greetings first).
async function addDeck(file) {
  const lbl = $('#adddeck'), txt = $('span', lbl), inp = $('#deckfile');
  const say = t => { if (txt.isConnected) txt.textContent = t; };
  lbl.classList.add('busy'); inp.disabled = true; say('Opening the file…');
  const setId = S.id;
  try {
    const { uploadDeck } = await import('./deck.js');
    const { title, urls, kind, vids, ar, skipped } = await uploadDeck(file, say);
    if (S?.id !== setId) throw new Error('The slides were not added because you left the set. Please open it and add them again.');
    const deck = { id: 'deck-' + rid(), title, cat: 'slides', deck: true };
    const pics = k => urls.map((src, i) => ({ id: rid(), song: k, label: vids[i] ? `Slide ${i + 1} (video)` : `Slide ${i + 1}`, kind: 'image', src, ...(vids[i] ? { vids: vids[i], ar } : {}) }));
    S.songs.push(deck);
    const first = S.slides.length;
    S.slides.push(...pics(S.songs.length - 1));
    const nv = vids.filter(Boolean).length;
    const note = skipped ? ` ${skipped === 1 ? 'One video' : skipped + ' videos'} in this file cannot play here, so ${skipped === 1 ? 'it shows' : 'they show'} as a still picture. Save videos as MP4 in PowerPoint to play them.`
      : nv ? ` The video${nv === 1 ? '' : 's'} on ${nv === 1 ? 'one slide' : nv + ' slides'} will play on the TV.`
      : kind === 'pptx' ? ' PowerPoint files can look a little different here, so please check them. A PDF keeps the exact look.' : '';
    persist(`Added ${urls.length} slides. Tap the up arrow next to their name to move them.${note}`, note ? 9000 : undefined); drawGrid(); refresh();
    $(`.thumb[data-i="${first}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  } catch (e) { console.error(e); toast(e.message || 'Could not add those slides.', 6000); }
  if (lbl.isConnected) { lbl.classList.remove('busy'); inp.disabled = false; say('Add slides (PDF or PowerPoint)'); }
}

async function addSongDialog() {
  const lib = await loadLibrary();
  const p = modal(`<h2>Add a song to this set</h2>
    <input class="input" id="m-q" type="search" placeholder="Type a song name…" autofocus>
    <ul class="song-list short" id="m-list"></ul>
    <div class="row"><button class="btn ghost" data-v="cancel">Close</button></div>`, { wide: true });
  const w = modal.current;
  const draw = () => {
    const q = $('#m-q', w).value.trim().toLowerCase();
    $('#m-list', w).innerHTML = lib.filter(s => matches(s, q)).slice(0, 60)
      .map(s => `<li><button class="song-row" data-v="${s.id}"><span class="t"><b>${esc(s.title)}</b><small>${esc(s.cat)} ${s.artist ? '· ' + esc(s.artist) : ''}</small></span></button></li>`).join('');
  };
  $('#m-q', w).oninput = draw; draw();
  const id = await p;
  if (!id) return;
  const song = getSong(id);
  const flow = song.flow?.length ? song.flow : ['title', ...song.sections.map(s => s.id)];
  S.songs.push({ id: song.id, title: song.title, artist: song.artist || '', cat: song.cat, flow });
  S.slides.push(...buildSlides(song, flow, S.songs.length - 1));
  persist(`Added "${song.title}".`); drawGrid(); refresh();
}

// Words look: place, languages, background --------------------------------
async function lookDialog() {
  const p = modal(`<h2>How the words look</h2>
    <div class="lbl">Where are you?</div>
    <div class="seg big">${Object.entries(PLACES).map(([id, pl]) => `<button data-place="${id}" class="${S.place === id ? 'on' : ''}">${pl.name}</button>`).join('')}</div>
    <div class="lbl">Which words?</div>
    <div class="seg big wrap3">${LANGS.map(l => `<button data-lang="${l.id}" class="${langOf(S) === l.id ? 'on' : ''}">${l.name}<small>${l.hint}</small></button>`).join('')}</div>
    <div class="lbl">Background for all slides</div>
    <div class="bg-row" id="m-bg">
      ${GRADIENTS.map(g => `<button class="bgsw" style="background:${g.css}" data-g="${g.id}" aria-label="${g.name}" title="${g.name}"></button>`).join('')}
      ${photoSwatches('data-p')}
      ${[...store.media.entries()].map(([id, url]) => `<span class="bgwrap">${mediaSwatch(id, url, 'data-m')}<button class="x" data-rmm="${id}" aria-label="Delete">${icon('x')}</button></span>`).join('')}
      <label class="bgsw upload" title="Use my own picture">${icon('plus')}My picture<input type="file" accept="image/*" id="m-up" hidden></label>
      <label class="bgsw upload" id="m-vlbl" title="Use my own video">${icon('plus')}<span>My video</span><input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.m4v,.webm" id="m-vup" hidden></label>
    </div>
    <p class="small muted">Videos play on a loop with no sound. A short MP4 works on every TV.</p>
    <div class="stage preview" id="m-pv"></div>
    <div class="row"><button class="btn primary" data-v="cancel">Done</button></div>`, { wide: true });
  const w = modal.current;
  const pv = () => {
    const sl = S.slides[at] || { kind: 'lyric', en: ['Your presence is an open door'], zh: [] };
    drawSlide($('#m-pv', w), frameOf(sl), opts({ ...sl, bg: undefined }));
    $$('[data-place]', w).forEach(b => b.classList.toggle('on', b.dataset.place === S.place));
    $$('[data-lang]', w).forEach(b => b.classList.toggle('on', b.dataset.lang === langOf(S)));
    $$('[data-g]', w).forEach(b => b.classList.toggle('sel', (!S.bg?.type || S.bg.type === 'gradient') && S.bg?.id === b.dataset.g));
    $$('[data-p]', w).forEach(b => b.classList.toggle('sel', S.bg?.type === 'photo' && 'p:' + S.bg.id === b.dataset.p));
    $$('[data-m]', w).forEach(b => b.classList.toggle('sel', S.bg?.type === 'image' && S.bg.mediaId === b.dataset.m));
  };
  pv();
  w.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.place) S.place = b.dataset.place;
    else if (b.dataset.lang) S.lang = b.dataset.lang;
    else if (b.dataset.g) S.bg = { type: 'gradient', id: b.dataset.g };
    else if (b.dataset.p) S.bg = fromPick(b.dataset.p);
    else if (b.dataset.m) S.bg = { type: 'image', mediaId: b.dataset.m };
    else if (b.dataset.rmm) {
      const id = b.dataset.rmm, vid = isVideo(id);
      if (!(await confirmBox(vid ? 'Delete this video?' : 'Delete this picture?', 'Yes, delete'))) return;
      await (vid ? removeVideo(id) : removeMedia(id)).catch(() => {});
      if (S.bg?.mediaId === id) S.bg = { type: 'gradient', id: 'forest' };
      S.slides.forEach(s => { if (s.bg?.mediaId === id) delete s.bg; });
      b.closest('.bgwrap').remove();
    } else return;
    persist(); pv(); refresh(); drawGrid();
  });
  $('#m-up', w).onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      toast('Adding your picture…');
      const url = await shrinkImage(file);
      const id = await addMedia(url);
      S.bg = { type: 'image', mediaId: id };
      const sw = document.createElement('span'); sw.className = 'bgwrap';
      sw.innerHTML = `${mediaSwatch(id, url, 'data-m')}<button class="x" data-rmm="${id}" aria-label="Delete">${icon('x')}</button>`;
      $('#m-bg', w).insertBefore(sw, $('.upload', w));
      persist('Picture added.'); pv(); refresh(); drawGrid();
    } catch (err) { console.error(err); toast(err.message || 'Could not add that picture.'); }
  };
  $('#m-vup', w).onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    const lbl = $('#m-vlbl', w), txt = $('span', lbl), inp = e.target;
    lbl.classList.add('busy'); inp.disabled = true; txt.textContent = 'Uploading…';
    try {
      const { url, poster } = await uploadVideo(file, pc => { txt.textContent = `Uploading ${pc}%`; });
      const id = await addMedia(url, { kind: 'video', poster });
      S.bg = { type: 'image', mediaId: id };
      const sw = document.createElement('span'); sw.className = 'bgwrap';
      sw.innerHTML = `${mediaSwatch(id, url, 'data-m')}<button class="x" data-rmm="${id}" aria-label="Delete">${icon('x')}</button>`;
      $('#m-bg', w).insertBefore(sw, $('.upload', w));
      persist('Video added.'); pv(); refresh(); drawGrid();
    } catch (err) { console.error(err); toast(err.message || 'Could not add that video.', 5000); }
    lbl.classList.remove('busy'); inp.disabled = false; inp.value = ''; txt.textContent = 'My video';
  };
  await p;
}

// Show on TV ---------------------------------------------------------------
async function tvDialog() {
  const cable = S.connection !== 'device';
  const url = location.origin;
  const v = await modal(`<h2>Show the words on the TV</h2>
    <div class="tv-opt ${cable ? 'pick' : ''}">
      <h3>${icon('plug')}TV plugged into this laptop</h3>
      <ol><li>Tap <b>Open TV window</b>.</li><li>Drag that window onto the TV.</li><li>Tap it once. It will fill the whole TV.</li></ol>
      <button class="btn primary" data-v="window">Open TV window</button>
    </div>
    ${canCast() ? `<div class="tv-opt"><h3>${icon('cast')}Cast (Chromecast / Google TV)</h3>
      <p>Sends the words to a TV on the same Wi-Fi.</p><button class="btn" data-v="cast">Cast to TV</button></div>` : ''}
    <div class="tv-opt ${!cable ? 'pick' : ''}">
      <h3>${icon('wifi')}No cable: another device</h3>
      <ol><li>On the TV, iPad or other laptop, open <b>${esc(url.replace(/^https?:\/\//, ''))}</b></li>
      <li>Log in with <b>${esc(store.user.email)}</b></li><li>Tap <b>This is the TV screen</b>.</li></ol>
      <p class="small muted">The words will follow this laptop. Both need internet.</p>
    </div>
    <div class="row"><button class="btn ghost" data-v="cancel">Close</button></div>`, { wide: true });
  if (v === 'window') openTvWindow();
  if (v === 'cast') startCast(store.uid).then(() => toast('Casting. The TV will follow this laptop.')).catch(() => toast('Casting was stopped.'));
}

async function openTvWindow() {
  let features = 'popup,width=960,height=540';
  // Chrome can put the window straight onto the TV screen.
  try {
    if ('getScreenDetails' in window) {
      const sd = await window.getScreenDetails();
      const other = sd.screens.find(s => s !== sd.currentScreen);
      if (other) features = `popup,left=${other.availLeft},top=${other.availTop},width=${other.availWidth},height=${other.availHeight}`;
    }
  } catch {}
  const w = window.open('/?tv=local', 'w252f-tv', features);
  if (!w) { toast('Your browser blocked the TV window. Please allow pop-ups for this site.', 5000); return; }
  setTimeout(() => republish(store.uid), 800);
  setTimeout(() => republish(store.uid), 2500);
}

// Keyboard and swipe ---------------------------------------------------------
function onKey(e) {
  if (document.querySelector('.modal-wrap') || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); goTo(at + 1); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); goTo(at - 1); }
  else if (k === 'b' || k === 'B' || k === '.') { black = !black; refresh(); }
  else if (k === 'h' || k === 'H') { hidden = !hidden; refresh(); }
  else if (k === 'Home') goTo(0);
  else if (k === 'End') goTo(S.slides.length - 1);
}

function swipe(el) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) goTo(at + (dx < 0 ? 1 : -1));
  });
  el.addEventListener('click', () => goTo(at + 1));
}
export { bgCss };

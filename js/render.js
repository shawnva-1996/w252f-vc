// Draws one slide on a fixed 1920x1080 stage, scaled to fit any box.
// Used for the TV screen and every preview, so what you see is what shows.

export const W = 1920, H = 1080;

export const GRADIENTS = [
  { id: 'forest', name: 'Green', css: 'linear-gradient(160deg,#0f3a26 0%,#0b2b1d 55%,#03110a 100%)' },
  { id: 'night', name: 'Night blue', css: 'linear-gradient(160deg,#16294d 0%,#0b1630 55%,#04070f 100%)' },
  { id: 'royal', name: 'Purple', css: 'linear-gradient(160deg,#3a1f5c 0%,#22123a 55%,#0b0614 100%)' },
  { id: 'sunrise', name: 'Sunrise', css: 'linear-gradient(160deg,#7a3418 0%,#4a1c2c 55%,#160912 100%)' },
  { id: 'ocean', name: 'Ocean', css: 'linear-gradient(160deg,#0e4a52 0%,#0a2e3a 55%,#03121a 100%)' },
  { id: 'wine', name: 'Deep red', css: 'linear-gradient(160deg,#5c1420 0%,#350b14 55%,#120307 100%)' },
  { id: 'gold', name: 'Gold', css: 'linear-gradient(160deg,#6b5114 0%,#3d2c0b 55%,#140e03 100%)' },
  { id: 'black', name: 'Black', css: '#000' }
];

// Soft photo backgrounds (Adobe Stock, blurred and darkened so the words stand out).
export const PHOTOS = [
  { id: 'sky-gold', name: 'Golden sky', url: '/img/bg-sky-gold.jpg' },
  { id: 'sky-sunset', name: 'Sunset', url: '/img/bg-sky-sunset.jpg' },
  { id: 'sky-blue', name: 'Blue sky', url: '/img/bg-sky-blue.jpg' },
  { id: 'hands', name: 'Raised hands', url: '/img/bg-hands.jpg' }
];
export const photoUrl = id => (PHOTOS.find(p => p.id === id) || PHOTOS[0]).url;

export const PLACES = {
  suntec: { name: 'Suntec', size: 65, valign: 'top', top: 90 },
  cell: { name: 'Home cell group', size: 100, valign: 'center', top: 0 }
};

// Each slide has main words ("en") and, if the song has one, a second
// language ("zh"). The names are old: the main words can be any language
// (English, Tagalog, Bahasa, Korean…) and so can the second one.
export const LANGS = [
  { id: 'both', name: 'Both languages', hint: 'e.g. English and Chinese' },
  { id: 'en', name: 'Main words only', hint: 'e.g. English or Tagalog' },
  { id: 'zh', name: 'Second language only', hint: 'e.g. Chinese' }
];
// Older sets saved "showZh"; turn that into the new language choice.
export const langOf = o => o?.lang || (o?.showZh === false ? 'en' : 'both');

export function bgCss(bg) {
  if (!bg) return GRADIENTS[0].css;
  // Single quotes: this goes inside a style="…" attribute.
  const url = u => `center / cover no-repeat url('${String(u).replace(/'/g, '%27')}')`;
  if (bg.type === 'image' && bg.url) return url(bg.url);
  if (bg.type === 'video') return bg.poster ? url(bg.poster) : '#000';
  if (bg.type === 'photo') return url(photoUrl(bg.id));
  const g = GRADIENTS.find(x => x.id === bg.id);
  return g ? g.css : GRADIENTS[0].css;
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Which kind of writing a line uses, so each one gets the right look.
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af\u1100-\u11ff]/;
const JOINED = /[\u0590-\u08ff\u0900-\u0dff\u0e00-\u0eff\u1000-\u109f\u1780-\u17ff]/; // Hebrew, Arabic, Indian scripts, Thai, Lao, Myanmar, Khmer
const RTL = /[\u0590-\u08ff]/;
function line(text, cls, size) {
  const t = String(text);
  needFont(t);
  const c = CJK.test(t) ? 'ln zh' : JOINED.test(t) ? `ln ${cls} cs` : `ln ${cls}`;
  return `<div class="${c}"${RTL.test(t) ? ' dir="rtl"' : ''} style="font-size:${size}px">${esc(t)}</div>`;
}

// Fonts for other languages load only when a slide needs them.
const FONTS = [
  [/[\uac00-\ud7af\u1100-\u11ff]/, 'Noto+Sans+KR'], [/[\u3040-\u30ff]/, 'Noto+Sans+JP'],
  [/[\u0e00-\u0e7f]/, 'Noto+Sans+Thai'], [/[\u0900-\u097f]/, 'Noto+Sans+Devanagari'],
  [/[\u0b80-\u0bff]/, 'Noto+Sans+Tamil'], [/[\u0600-\u06ff]/, 'Noto+Sans+Arabic'],
  [/[\u0590-\u05ff]/, 'Noto+Sans+Hebrew'], [/[\u1000-\u109f]/, 'Noto+Sans+Myanmar'],
  [/[\u1780-\u17ff]/, 'Noto+Sans+Khmer']
];
const asked = new Set();
function needFont(t) {
  if (typeof document === 'undefined') return;
  for (const [re, fam] of FONTS) {
    if (asked.has(fam) || !re.test(t)) continue;
    asked.add(fam);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@700&display=swap`;
    l.onload = () => document.fonts?.ready.then(() => document.querySelectorAll('.stage').forEach(fitText));
    document.head.appendChild(l);
  }
}

// frame: { kind: 'lyric'|'title'|'blank'|'image', en: [], zh: [], title, artist, label, src }
export function slideHTML(frame, opts = {}) {
  const place = PLACES[opts.place] || PLACES.suntec;
  const lang = langOf(opts);
  const f = frame || { kind: 'blank' };
  // Sermon and announcement slides are pictures that fill the screen on black.
  if (f.kind === 'image') {
    const shown = !opts.black && !opts.hidden && f.src;
    return `<div class="stage-in pic" style="background:#000">${shown ? `<img class="slide-pic" src="${esc(f.src)}" alt="" decoding="async">${vidsHTML(f, opts)}` : ''}</div>`;
  }
  let inner = '';
  if (!opts.hidden && !opts.black) {
    if (f.kind === 'title') {
      inner = line(f.title, 'en', place.size * 1.25) +
        (f.artist ? line(f.artist, 'sub', Math.round(place.size * 0.55)) : '');
    } else if (f.kind !== 'blank') {
      const en = (f.en || []).filter(Boolean), zh = (f.zh || []).filter(Boolean);
      // If a slide has no words in the chosen language, show what it has rather than nothing.
      const useEn = lang !== 'zh' || !zh.length, useZh = lang !== 'en' || !en.length;
      const zhSize = useEn ? Math.round(place.size * 0.85) : place.size;
      if (useEn) inner += en.map(l => line(l, 'en', place.size)).join('');
      if (useZh) inner += zh.map(l => line(l, 'zh', zhSize)).join('');
    }
  }
  // On the laptop only: name the music-only parts ("Instrumental", "Spirit") on their blank slides.
  const cue = opts.preview && f.kind === 'blank' && f.label && f.label !== 'Blank' && !opts.black ? `<div class="cue">${esc(f.label)}</div>` : '';
  const bg = opts.black ? '#000' : bgCss(opts.bg);
  // Video backgrounds play behind the words (small previews show a still picture instead).
  const vid = !opts.black && !opts.still && opts.bg?.type === 'video' && opts.bg.url
    ? `<video class="bgv" src="${esc(opts.bg.url)}" autoplay muted loop playsinline preload="auto"></video>` : '';
  return `<div class="stage-in" style="background:${bg}">${vid}
    <div class="words ${place.valign}" style="padding-top:${place.valign === 'top' ? place.top : 0}px"><div class="blk">${inner}</div></div>${cue}</div>`;
}

// Videos from a PowerPoint slide, placed where they were on the slide. They
// play on the TV only; small previews show the slide picture and a note.
function vidsHTML(f, opts) {
  if (!f.vids?.length) return '';
  if (opts.preview || opts.still) return opts.preview && !opts.still ? '<div class="vcue">The video plays on the TV</div>' : '';
  // The picture is fitted inside the 1920 x 1080 screen, keeping its shape.
  const ar = f.ar || 16 / 9, w = ar >= 16 / 9 ? 1920 : Math.round(1080 * ar), h = Math.round(w / ar);
  const pct = n => (n * 100).toFixed(3) + '%';
  return `<div class="pic-box" style="width:${w}px;height:${h}px;left:${(1920 - w) / 2}px;top:${(1080 - h) / 2}px">${f.vids.map(v =>
    `<video class="slide-vid" src="${esc(v.url)}" playsinline preload="auto" style="left:${pct(v.x)};top:${pct(v.y)};width:${pct(v.w)};height:${pct(v.h)}"></video>`).join('')}</div>`;
}

// Put a slide into a box and scale it to fit. Shrinks long lines so nothing is cut off.
export function drawSlide(box, frame, opts = {}) {
  box.classList.add('stage');
  const html = slideHTML(frame, opts);
  // Nothing changed (the laptop sends the same slide again): leave it, so a
  // playing video carries on.
  if (box._html === html && box.firstElementChild) { fit(box); return; }
  box._html = html;
  const old = box.querySelector('video.bgv'), cur = box.firstElementChild;
  const next = document.createElement('div'); next.innerHTML = html;
  const fresh = next.firstElementChild, nv = fresh.querySelector('video.bgv');
  if (old && nv && cur && old.getAttribute('src') === nv.getAttribute('src')) {
    // Same video: change only the words around it. Taking a video out of the page,
    // even for a moment, pauses it in Safari, and it would then stay still.
    cur.setAttribute('style', fresh.getAttribute('style'));
    [...cur.childNodes].forEach(n => n !== old && n.remove());
    nv.remove();
    cur.append(...fresh.childNodes);
  } else {
    box.innerHTML = html;
  }
  box.querySelectorAll('video.bgv').forEach(playVideo);
  box.querySelectorAll('video.slide-vid').forEach(playSlideVideo);
  fit(box);
  fitText(box);
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => fitText(box));
}

// Start a video from a slide, with sound. If the browser does not allow sound
// yet, it plays without it until the TV screen is tapped.
export function playSlideVideo(v) {
  v.play?.().catch(() => { v.muted = true; v.play?.().catch(() => {}); });
}

// Start a background video. Browsers only play videos by themselves when they are muted.
export function playVideo(v) {
  v.muted = true; v.defaultMuted = true; v.playsInline = true;
  if (v.paused) v.play?.().catch(() => {});
}

export function fit(box) {
  const inner = box.firstElementChild;
  if (!inner) return;
  const w = box.clientWidth || box.getBoundingClientRect().width;
  const h = box.clientHeight || box.getBoundingClientRect().height;
  if (!w || !h) return;
  const s = Math.min(w / W, h / H);
  inner.style.transform = `translate(${(w - W * s) / 2}px, ${(h - H * s) / 2}px) scale(${s})`;
}

function fitText(box) {
  const words = box.querySelector('.words');
  if (!words) return;
  // Every lyric line stays on one line. If the longest line is too wide (or the
  // words run off the bottom), shrink all lines together so they still match.
  const lines = [...words.querySelectorAll('.ln')];
  if (!lines.length) return;
  const maxW = W - 120;
  const maxH = H - 60 - (parseFloat(words.style.paddingTop) || 0);
  const base = lines.map(ln => ({ size: parseFloat(ln.style.fontSize), gap: parseFloat(getComputedStyle(ln).letterSpacing) || 0 }));
  const apply = k => lines.forEach((ln, i) => {
    ln.style.fontSize = base[i].size * k + 'px';
    ln.style.letterSpacing = base[i].gap * k + 'px';
  });
  let k = 1;
  for (let pass = 0; pass < 4; pass++) {
    const widest = Math.max(...lines.map(ln => ln.scrollWidth));
    const tall = words.firstElementChild.offsetHeight;
    const f = Math.min(1, maxW / widest, maxH / tall);
    if (f > 0.995) break;
    k *= f * 0.99;
    apply(k);
  }
}

export function refitAll(root = document) {
  root.querySelectorAll('.stage').forEach(fit);
}
window.addEventListener('resize', () => refitAll());

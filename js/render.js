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

export const PLACES = {
  suntec: { name: 'Suntec', size: 65, valign: 'top', top: 90 },
  cell: { name: 'Home cell group', size: 100, valign: 'center', top: 0 }
};

export function bgCss(bg) {
  if (!bg) return GRADIENTS[0].css;
  if (bg.type === 'image' && bg.url) return `center / cover no-repeat url("${bg.url}")`;
  const g = GRADIENTS.find(x => x.id === bg.id);
  return g ? g.css : GRADIENTS[0].css;
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// frame: { kind: 'lyric'|'title'|'blank', en: [], zh: [], title, artist }
export function slideHTML(frame, opts = {}) {
  const place = PLACES[opts.place] || PLACES.suntec;
  const showZh = opts.showZh !== false;
  const f = frame || { kind: 'blank' };
  let inner = '';
  if (!opts.hidden && !opts.black) {
    if (f.kind === 'title') {
      inner = `<div class="ln en" style="font-size:${place.size * 1.25}px">${esc(f.title)}</div>` +
        (f.artist ? `<div class="ln sub" style="font-size:${Math.round(place.size * 0.55)}px">${esc(f.artist)}</div>` : '');
    } else if (f.kind !== 'blank') {
      inner = (f.en || []).filter(Boolean).map(l => `<div class="ln en" style="font-size:${place.size}px">${esc(l)}</div>`).join('');
      if (showZh) inner += (f.zh || []).filter(Boolean).map(l => `<div class="ln zh" style="font-size:${Math.round(place.size * 0.85)}px">${esc(l)}</div>`).join('');
    }
  }
  const bg = opts.black ? '#000' : bgCss(opts.bg);
  return `<div class="stage-in" style="background:${bg}">
    <div class="words ${place.valign}" style="padding-top:${place.valign === 'top' ? place.top : 0}px"><div class="blk">${inner}</div></div></div>`;
}

// Put a slide into a box and scale it to fit. Shrinks long lines so nothing is cut off.
export function drawSlide(box, frame, opts = {}) {
  box.classList.add('stage');
  box.innerHTML = slideHTML(frame, opts);
  fit(box);
  fitText(box);
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
  // Lines wrap (balanced) like PowerPoint; only shrink when the words run off the bottom.
  const maxH = H - 60 - (parseFloat(words.style.paddingTop) || 0);
  let guard = 0;
  const blk = words.firstElementChild;
  while (blk && blk.offsetHeight > maxH && guard++ < 30) {
    for (const ln of words.querySelectorAll('.ln')) ln.style.fontSize = parseFloat(ln.style.fontSize) * 0.94 + 'px';
  }
}

export function refitAll(root = document) {
  root.querySelectorAll('.stage').forEach(fit);
}
window.addEventListener('resize', () => refitAll());

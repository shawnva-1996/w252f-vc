// Sermon and announcement slides: turns a PDF or PowerPoint file into one
// picture per slide (1920 x 1080 at most) and stores them in Vercel Blob.
// PDFs keep their exact look. PowerPoint files are drawn in the browser, so
// fonts and layouts can come out a little different. Videos inside PowerPoint
// slides are uploaded too and play on the TV over the slide picture.
import { auth } from './firebase.js';
import { store } from './store.js';

const MAX_SLIDES = 150;
const MAX_MB = 100;

export const deckKind = file => {
  const n = (file?.name || '').toLowerCase();
  if (n.endsWith('.pdf') || file?.type === 'application/pdf') return 'pdf';
  if (n.endsWith('.pptx')) return 'pptx';
  if (n.endsWith('.ppt') || n.endsWith('.key')) return 'old';
  return null;
};

const loadScript = src => new Promise((res, rej) => {
  if (document.querySelector(`script[src="${src}"]`)) return res();
  const s = document.createElement('script');
  s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load the slide reader. Please check the internet.'));
  document.head.appendChild(s);
});
const toJpeg = canvas => new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.86));

async function pdfPictures(file, onStep) {
  const pdfjs = await import('/vendor/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.mjs';
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const n = Math.min(pdf.numPages, MAX_SLIDES), out = [];
  for (let i = 1; i <= n; i++) {
    onStep(i, n);
    const page = await pdf.getPage(i);
    const v1 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: Math.min(1920 / v1.width, 1080 / v1.height) });
    const c = document.createElement('canvas');
    c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    out.push(await toJpeg(c));
    page.cleanup();
  }
  pdf.destroy();
  return out;
}

// Videos inside a slide cannot play in a picture, and waiting for them to load
// can hold a slide up for a long time. Each becomes a still of an early frame
// (or a black box) in the picture, and is kept with its place on the slide to
// play on the TV. Sound and web pages in slides are left out.
const VIDEO_WAIT_MS = 4000;
function videoFrame(v) {
  return new Promise(res => {
    const done = ok => { clearTimeout(t); res(ok); };
    const t = setTimeout(() => done(false), VIDEO_WAIT_MS);
    v.muted = true; v.preload = 'auto';
    v.addEventListener('seeked', () => done(true), { once: true });
    v.addEventListener('error', () => done(false), { once: true });
    v.addEventListener('loadeddata', () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); }, { once: true });
    v.load();
  });
}
async function stillVideos(el) {
  el.querySelectorAll('audio, iframe, object, embed').forEach(n => n.remove());
  const box = el.getBoundingClientRect(), found = [];
  for (const v of el.querySelectorAll('video')) {
    const w = v.offsetWidth || Number(v.getAttribute('width')) || 320, h = v.offsetHeight || Number(v.getAttribute('height')) || 180;
    const r = v.getBoundingClientRect(), src = v.currentSrc || v.src;
    const c = document.createElement('canvas');
    c.width = w; c.height = h; c.style.cssText = v.style.cssText; c.style.width = w + 'px'; c.style.height = h + 'px';
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    const plays = await videoFrame(v);
    if (plays) { try { ctx.drawImage(v, 0, 0, w, h); } catch {} }
    // Kept even when this browser cannot show it: the TV may still play it.
    if (src) found.push({ src, x: (r.left - box.left) / box.width, y: (r.top - box.top) / box.height, w: r.width / box.width, h: r.height / box.height });
    v.replaceWith(c);
  }
  return found;
}
// Gives up on a step that takes too long, so one slide can never hold up the rest.
const inTime = (promise, ms, msg) => Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);

async function pptxPictures(file, onStep) {
  await Promise.all([loadScript('/vendor/pptx-preview.umd.js'), loadScript('/vendor/modern-screenshot.js')]);
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-30000px;top:0;width:1920px;pointer-events:none';
  document.body.appendChild(host);
  try {
    const pv = window.pptxPreview.init(host, { width: 1920, height: 1080, mode: 'list' });
    await pv.preview(await file.arrayBuffer());
    const els = [...host.querySelectorAll('.pptx-preview-slide-wrapper')].slice(0, MAX_SLIDES);
    if (!els.length) throw new Error('No slides found in that file.');
    const out = [], vids = [];
    let ar = 0;
    for (let i = 0; i < els.length; i++) {
      onStep(i + 1, els.length);
      const el = els[i], w = el.offsetWidth || 1920, h = el.offsetHeight || 1080;
      const s = Math.min(1920 / w, 1080 / h);
      vids[i] = await stillVideos(el);
      if (!ar) ar = w / h;
      // Pictures in the slide that will not load are skipped after a few seconds.
      out.push(await inTime(window.modernScreenshot.domToBlob(el, { type: 'image/jpeg', quality: 0.86, scale: s, width: w, height: h, timeout: 8000 }),
        60000, `Slide ${i + 1} could not be read. Please save the file as PDF in PowerPoint and add that instead.`));
    }
    out.vids = vids; out.ar = ar;
    return out;
  } finally { host.remove(); }
}

// The kind of video, from the first bytes of the file (PowerPoint does not say).
async function videoType(blob) {
  const b = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  const tag = String.fromCharCode(...b.slice(4, 12));
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return ['video/webm', 'webm'];
  if (tag.startsWith('ftyp')) return tag.slice(4, 6) === 'qt' ? ['video/quicktime', 'mov'] : ['video/mp4', 'mp4'];
  return null;
}
async function sendVideo(src, path, upload, token) {
  const blob = await fetch(src).then(r => r.blob());
  const type = await videoType(blob);
  if (!type) throw new Error('This kind of video cannot be played here.');
  const out = await upload(`${path}.${type[1]}`, blob, {
    access: 'public', handleUploadUrl: '/api/video', headers: { Authorization: 'Bearer ' + token }, contentType: type[0], multipart: blob.size > 20 * 1024 * 1024
  });
  return out.url;
}

// Returns { title, urls, kind, vids, ar, skipped }: vids[i] lists the videos on
// slide i with their place on it (fractions of the slide), ar is the slides'
// width / height, and skipped counts videos that cannot play here.
// onProgress(text) reports each step.
export async function uploadDeck(file, onProgress = () => {}) {
  const kind = deckKind(file);
  if (kind === 'old') throw new Error('Old PowerPoint (.ppt) and Keynote files cannot be read. Please save it as PDF or .pptx and try again.');
  if (!kind) throw new Error('Please choose a PDF or PowerPoint (.pptx) file.');
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`That file is too big. Please use one under ${MAX_MB} MB.`);
  const pics = await (kind === 'pdf' ? pdfPictures : pptxPictures)(file, (i, n) => onProgress(`Reading slide ${i} of ${n}…`));
  const [{ upload }, token] = await Promise.all([import('./blob-upload.js'), auth.currentUser.getIdToken()]);
  const base = (file.name || 'slides').replace(/\.[^.]+$/, '');
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'slides';
  // Each picture gets 60 seconds and three tries, so one slow upload cannot stall the rest.
  const sendPic = async (path, pic) => {
    for (let tryNo = 1; ; tryNo++) {
      const stop = new AbortController(), t = setTimeout(() => stop.abort(), 60000);
      try {
        const blob = await upload(path, pic, {
          access: 'public', handleUploadUrl: '/api/video', headers: { Authorization: 'Bearer ' + token }, contentType: 'image/jpeg', abortSignal: stop.signal
        });
        return blob.url;
      } catch (e) {
        if (tryNo >= 3) throw new Error('The slides could not be uploaded. Please check the internet and try again.');
      } finally { clearTimeout(t); }
    }
  };
  const urls = new Array(pics.length);
  let done = 0, next = 0;
  const worker = async () => {
    while (next < pics.length) {
      const i = next++;
      urls[i] = await sendPic(`slides/${store.uid}/${slug}-${String(i + 1).padStart(3, '0')}.jpg`, pics[i]);
      onProgress(`Uploading slide ${++done} of ${pics.length}…`);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  // Videos inside the slides: each file goes up once, even if several slides use it.
  const vids = [], sent = new Map();
  let failed = 0;
  const all = (pics.vids || []).flat();
  for (let i = 0; i < (pics.vids || []).length; i++) {
    for (const v of pics.vids[i] || []) {
      if (!sent.has(v.src)) {
        onProgress(`Uploading video ${sent.size + 1} of ${new Set(all.map(x => x.src)).size}…`);
        sent.set(v.src, await sendVideo(v.src, `videos/${store.uid}/${slug}-${sent.size + 1}`, upload, token).catch(e => { console.error(e); failed++; return null; }));
      }
      const url = sent.get(v.src);
      if (url) (vids[i] = vids[i] || []).push({ url, x: v.x, y: v.y, w: v.w, h: v.h });
    }
  }
  const title = base.replace(/[_-]+/g, ' ').trim() || 'Slides';
  return { title: title[0].toUpperCase() + title.slice(1), urls, kind, vids, ar: pics.ar || 16 / 9, skipped: failed };
}

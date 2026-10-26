// Keeps the site on this device so screens open instantly and it still
// works if the Wi-Fi drops. A new version is picked up the next time the
// site is opened (never in the middle of a song).
const VERSION = 'f211faa52a';
const CACHE = 'w252f-' + VERSION;
const SHELL = ["/index.html","/css/app.css","/data/songs.json","/data/presets.json","/img/bg-hands.jpg","/img/bg-sky-blue.jpg","/img/bg-sky-gold.jpg","/img/bg-sky-sunset.jpg","/img/chc-icon.png","/img/chc-logo.svg","/img/hero-tall.jpg","/img/hero.jpg","/js/admin.js","/js/blob-upload.js","/js/chords.js","/js/control.js","/js/deck.js","/js/editor.js","/js/firebase.js","/js/live.js","/js/main.js","/js/render.js","/js/sheet.js","/js/songs.js","/js/store.js","/js/tv.js","/js/ui.js","/js/wizard.js"];
const LONG = /^https:\/\/(www\.gstatic\.com\/firebasejs\/|cdnjs\.cloudflare\.com\/|fonts\.(googleapis|gstatic)\.com\/)/;

// Each file is fetched fresh (not from the browser's own cache), and one file
// that fails cannot hold the update back: it is fetched when first needed.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(SHELL.map(f => fetch(new Request(f, { cache: 'reload' }))
      .then(r => r.ok ? c.put(f, r) : null).catch(() => null))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('w252f-') && k !== CACHE && k !== 'w252f-ext').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;
    if (req.mode === 'navigate') {
      e.respondWith(caches.match('/index.html', { cacheName: CACHE }).then(r => r || fetch('/index.html', { cache: 'reload' })));
      return;
    }
    e.respondWith(caches.match(url.pathname, { cacheName: CACHE }).then(r => r || fetch(req).then(res => {
      if (res.ok && SHELL.includes(url.pathname)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.pathname, copy)); }
      return res;
    })));
    return;
  }
  if (LONG.test(req.url)) {
    e.respondWith(caches.open('w252f-ext').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
  }
});

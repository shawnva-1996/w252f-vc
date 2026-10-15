// Keeps the site on this device so screens open instantly and it still
// works if the Wi-Fi drops. A new version is picked up the next time the
// site is opened (never in the middle of a song).
const VERSION = '23626bf876';
const CACHE = 'w252f-' + VERSION;
const SHELL = ["/index.html","/css/app.css","/data/songs.json","/js/admin.js","/js/control.js","/js/editor.js","/js/firebase.js","/js/live.js","/js/main.js","/js/render.js","/js/songs.js","/js/store.js","/js/tv.js","/js/ui.js","/js/wizard.js"];
const LONG = /^https:\/\/(www\.gstatic\.com\/firebasejs\/|cdnjs\.cloudflare\.com\/|fonts\.(googleapis|gstatic)\.com\/)/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
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
      e.respondWith(caches.match('/index.html', { cacheName: CACHE }).then(r => r || fetch(req)));
      return;
    }
    e.respondWith(caches.match(url.pathname, { cacheName: CACHE }).then(r => r || fetch(req)));
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

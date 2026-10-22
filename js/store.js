// What the app remembers while it is open, plus the saved sets.
import {
  auth, db, C, ADMIN_EMAIL, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, getDocs, serverTimestamp
} from './firebase.js';

export const store = {
  user: null,
  get uid() { return this.user?.uid || null; },
  get isAdmin() { return (this.user?.email || '').toLowerCase() === ADMIN_EMAIL; },
  draft: null,
  media: new Map(),     // id -> picture or video address
  posters: new Map()    // id -> still picture, only for videos
};

const LS = 'w252f.';
export const local = {
  get(k, d = null) { try { const v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(LS + k); } catch {} }
};

export function newDraft() {
  store.draft = {
    place: local.get('place', 'suntec'), connection: local.get('connection', 'cable'), lang: local.get('lang', 'both'),
    praiseCount: 1, worshipCount: 2, praise: [], worship: [], flows: {}
  };
  saveDraft();
  return store.draft;
}
export function getDraft() {
  if (!store.draft) { try { store.draft = JSON.parse(sessionStorage.getItem(LS + 'draft')); } catch {} }
  return store.draft || newDraft();
}
export function saveDraft() { try { sessionStorage.setItem(LS + 'draft', JSON.stringify(store.draft)); } catch {} }

export async function ensureProfile(user, name) {
  const ref = doc(db, C.users, user.uid);
  const snap = await getDoc(ref).catch(() => null);
  const data = { email: user.email, lastSeen: serverTimestamp() };
  if (!snap || !snap.exists()) Object.assign(data, { createdAt: serverTimestamp(), name: name || user.displayName || '' });
  else if (name) data.name = name;
  await setDoc(ref, data, { merge: true }).catch(() => {});
}

// Saved sets ---------------------------------------------------------
// Kept in memory (and on this device) so screens open straight away;
// the internet copy refreshes quietly in the background.
const setCache = { uid: null, list: null };
const cacheKey = () => 'sets.' + store.uid;
const sortSets = l => l.sort((a, b) => (b.updatedMs || 0) - (a.updatedMs || 0));
function remember(list) {
  setCache.uid = store.uid; setCache.list = sortSets(list);
  local.set(cacheKey(), list.map(({ createdAt, ...s }) => s));
}
export function cachedSets() {
  if (setCache.uid === store.uid && setCache.list) return setCache.list;
  const saved = store.uid && local.get(cacheKey());
  if (saved) { setCache.uid = store.uid; setCache.list = sortSets(saved); return setCache.list; }
  return null;
}
export async function listSets() {
  const snap = await getDocs(query(collection(db, C.sets), where('ownerUid', '==', store.uid)));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  remember(list);
  return setCache.list;
}
export async function getSet(id) {
  const hit = (cachedSets() || []).find(s => s.id === id);
  if (hit) return structuredClone(hit);
  const snap = await getDoc(doc(db, C.sets, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function createSet(data) {
  const full = { ...data, ownerUid: store.uid, updatedMs: Date.now() };
  const ref = await addDoc(collection(db, C.sets), { ...full, createdAt: serverTimestamp() });
  remember([{ id: ref.id, ...full }, ...(cachedSets() || [])]);
  return ref.id;
}
export async function updateSet(id, data) {
  const updatedMs = Date.now();
  const list = cachedSets();
  if (list) remember(list.map(s => s.id === id ? { ...s, ...structuredClone(data), updatedMs } : s));
  await updateDoc(doc(db, C.sets, id), { ...data, updatedMs });
}
export async function removeSet(id) {
  const list = cachedSets();
  if (list) remember(list.filter(s => s.id !== id));
  await deleteDoc(doc(db, C.sets, id));
}

// Uploaded background pictures and videos ------------------------------
let mediaLoaded = null;
const keep = (id, d) => { store.media.set(id, d.url); if (d.kind === 'video') store.posters.set(id, d.poster || ''); };
export const isVideo = id => store.posters.has(id);
export async function listMedia() {
  if (mediaLoaded === store.uid) return [...store.media.entries()].map(([id, url]) => ({ id, url }));
  const snap = await getDocs(query(collection(db, C.media), where('ownerUid', '==', store.uid)));
  snap.docs.forEach(d => keep(d.id, d.data()));
  mediaLoaded = store.uid;
  return snap.docs.map(d => ({ id: d.id, url: d.data().url }));
}
export async function addMedia(url, extra = {}) {
  const data = { ownerUid: store.uid, url, ...extra };
  const ref = await addDoc(collection(db, C.media), { ...data, createdAt: serverTimestamp() });
  keep(ref.id, data);
  return ref.id;
}
export async function mediaUrl(id) {
  if (store.media.has(id)) return store.media.get(id);
  const snap = await getDoc(doc(db, C.media, id)).catch(() => null);
  const d = snap?.exists() ? snap.data() : null;
  if (d?.url) keep(id, d);
  return d?.url || null;
}
export const removeMedia = id => { store.media.delete(id); store.posters.delete(id); return deleteDoc(doc(db, C.media, id)); };

// Shrink a picture so it loads fast on any TV (max 1920x1080, small file).
export function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1920 / img.width, 1080 / img.height);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let q = 0.75, url = c.toDataURL('image/jpeg', q);
      while (url.length > 650000 && q > 0.3) { q -= 0.1; url = c.toDataURL('image/jpeg', q); }
      URL.revokeObjectURL(img.src);
      resolve(url);
    };
    img.onerror = () => reject(new Error('That picture could not be opened.'));
    img.src = URL.createObjectURL(file);
  });
}

// Videos are too big for the database, so they go to Vercel Blob storage.
export const MAX_VIDEO_MB = 300;
export async function uploadVideo(file, onProgress) {
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`That video is too big. Please use one under ${MAX_VIDEO_MB} MB (a short loop is best).`);
  const [{ upload }, poster, token] = await Promise.all([import('./blob-upload.js'), videoStill(file), auth.currentUser.getIdToken()]);
  const name = (file.name || 'video.mp4').toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const blob = await upload(`videos/${store.uid}/${name}`, file, {
    access: 'public', handleUploadUrl: '/api/video', headers: { Authorization: 'Bearer ' + token },
    contentType: file.type || 'video/mp4', multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: e => onProgress && onProgress(Math.round(e.percentage))
  });
  return { url: blob.url, poster };
}
export async function removeVideo(id) {
  const url = store.media.get(id);
  const token = await auth.currentUser.getIdToken();
  await fetch('/api/video', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ action: 'delete', url }) }).catch(() => {});
  return removeMedia(id);
}

// A small still picture from the video, shown on the slide list and while the video loads.
function videoStill(file) {
  return new Promise(resolve => {
    const v = document.createElement('video');
    const src = URL.createObjectURL(file);
    const done = url => { clearTimeout(timer); URL.revokeObjectURL(src); resolve(url); };
    const timer = setTimeout(() => done(''), 10000);
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.onloadeddata = () => { v.currentTime = Math.min(1, (v.duration || 2) / 3); };
    v.onseeked = () => {
      try {
        const s = Math.min(1, 640 / v.videoWidth);
        const c = document.createElement('canvas');
        c.width = Math.round(v.videoWidth * s); c.height = Math.round(v.videoHeight * s);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        done(c.toDataURL('image/jpeg', 0.7));
      } catch { done(''); }
    };
    v.onerror = () => done('');
    v.src = src;
    v.load();
  });
}

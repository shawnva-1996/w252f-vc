// What the app remembers while it is open, plus the saved sets.
import {
  db, C, ADMIN_EMAIL, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, getDocs, serverTimestamp
} from './firebase.js';

export const store = {
  user: null,
  get uid() { return this.user?.uid || null; },
  get isAdmin() { return (this.user?.email || '').toLowerCase() === ADMIN_EMAIL; },
  draft: null,
  media: new Map()
};

const LS = 'w252f.';
export const local = {
  get(k, d = null) { try { const v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(LS + k); } catch {} }
};

export function newDraft() {
  store.draft = {
    place: local.get('place', 'suntec'), connection: local.get('connection', 'cable'),
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
export async function listSets() {
  const snap = await getDocs(query(collection(db, C.sets), where('ownerUid', '==', store.uid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.updatedMs || 0) - (a.updatedMs || 0));
}
export async function getSet(id) {
  const snap = await getDoc(doc(db, C.sets, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function createSet(data) {
  const ref = await addDoc(collection(db, C.sets), { ...data, ownerUid: store.uid, createdAt: serverTimestamp(), updatedMs: Date.now() });
  return ref.id;
}
export async function updateSet(id, data) {
  await updateDoc(doc(db, C.sets, id), { ...data, updatedMs: Date.now() });
}
export const removeSet = id => deleteDoc(doc(db, C.sets, id));

// Uploaded background pictures ----------------------------------------
export async function listMedia() {
  const snap = await getDocs(query(collection(db, C.media), where('ownerUid', '==', store.uid)));
  snap.docs.forEach(d => store.media.set(d.id, d.data().url));
  return snap.docs.map(d => ({ id: d.id, url: d.data().url }));
}
export async function addMedia(url) {
  const ref = await addDoc(collection(db, C.media), { ownerUid: store.uid, url, createdAt: serverTimestamp() });
  store.media.set(ref.id, url);
  return ref.id;
}
export async function mediaUrl(id) {
  if (store.media.has(id)) return store.media.get(id);
  const snap = await getDoc(doc(db, C.media, id)).catch(() => null);
  const url = snap?.exists() ? snap.data().url : null;
  if (url) store.media.set(id, url);
  return url;
}
export const removeMedia = id => { store.media.delete(id); return deleteDoc(doc(db, C.media, id)); };

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

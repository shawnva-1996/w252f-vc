// Firebase setup. The web config below is public by design; access is
// controlled by Firestore rules (see firestore.rules).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, updateProfile
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where,
  getDocs, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const app = initializeApp({
  apiKey: 'AIzaSyBrA5exbRIyitjPNa5D9AU7XfIXn1lff0Y',
  authDomain: 'lemuel-31-sot.firebaseapp.com',
  projectId: 'lemuel-31-sot',
  storageBucket: 'lemuel-31-sot.firebasestorage.app',
  messagingSenderId: '605411054097',
  appId: '1:605411054097:web:0c28dd37214fc5e46cd7b0'
});

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

let cache;
try { cache = persistentLocalCache({ tabManager: persistentMultipleTabManager() }); } catch { cache = undefined; }
export const db = initializeFirestore(app, cache ? { localCache: cache } : {});

export const ADMIN_EMAIL = 'slides@w252f.com';
export const C = { users: 'w252f_users', songs: 'w252f_songs', sets: 'w252f_sets', live: 'w252f_live', media: 'w252f_media' };

export {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile,
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp
};

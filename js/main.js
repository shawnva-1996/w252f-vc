import {
  auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile, isTv
} from './firebase.js';
import { show, esc, toast, header, confirmBox, icon, $ } from './ui.js';
import { store, local, ensureProfile, listSets, cachedSets, createSet, removeSet, newDraft, listMedia } from './store.js';
import { loadLibrary, getSong, buildSlides } from './songs.js';
import { wizard } from './wizard.js';
import { controlScreen } from './control.js';
import { tvScreen } from './tv.js';
import { songEditor, songLibrary } from './editor.js';
import { adminScreen } from './admin.js';

const params = new URLSearchParams(location.search);
if (local.get('bigtext')) document.documentElement.classList.add('bigtext');
let authReady = false;
let pendingAfterLogin = null;

// Screens that don't need a login show straight away, before Firebase wakes up.
const firstPage = location.hash.replace(/^#\/?/, '').split('/')[0];
let shownEarly = false;
if (!params.get('tv') && ['', 'login'].includes(firstPage)) { shownEarly = true; route(); }

onAuthStateChanged(auth, async user => {
  store.user = user;
  if (user) {
    ensureProfile(user);
    // Get things ready in the background so the next screens open instantly.
    loadLibrary().catch(() => {});
    if (local.get('role') !== 'tv') { listSets().catch(() => {}); listMedia().catch(() => {}); }
  }
  if (!authReady) { authReady = true; if (!shownEarly || user) route(); return; }
  if (user && pendingAfterLogin) { const to = pendingAfterLogin; pendingAfterLogin = null; go(to); }
});

window.addEventListener('hashchange', () => authReady && route());

export function go(hash) { if (location.hash === hash || (hash === '#/' && !location.hash)) route(); else location.hash = hash; }

// Screen router -----------------------------------------------------------
async function route() {
  if (params.get('tv')) return tvScreen({ mode: params.get('tv') });
  const hash = location.hash.replace(/^#\/?/, '');
  const [page, arg, arg2] = hash.split('/');
  const needsLogin = !['', 'login'].includes(page || '');
  if (needsLogin && !store.user) { pendingAfterLogin = '#/' + hash; return loginScreen(); }
  try {
    switch (page || '') {
      case '': return welcome();
      case 'login': return loginScreen();
      case 'home': return home();
      case 'new': return wizard(arg, arg2);
      case 'set': return controlScreen(arg);
      // Reload once so the TV starts with its own live connection (see firebase.js).
      case 'tv': return isTv ? tvScreen({ mode: 'cloud' }) : location.reload();
      case 'songs': return songLibrary();
      case 'song': return songEditor(arg);
      case 'admin': return store.isAdmin ? adminScreen(arg) : (location.hash = '#/home');
      default: location.hash = '#/';
    }
  } catch (e) {
    console.error(e);
    show(`<main class="center-page"><h2>Something went wrong.</h2><p>${esc(e.message || e)}</p>
      <a class="btn primary" href="#/home">Go back home</a></main>`);
  }
}

// 1. Welcome --------------------------------------------------------------
function welcome() {
  const last = local.get('role');
  show(`<header class="hero"><div class="hero-in">
      <p class="eyebrow">Worship slides</p>
      <h1>Sing with your <em>whole heart</em></h1>
      <p class="lead">Let's get the words up, so everyone can sing along.</p>
    </div></header>
    <main class="page welcome">
    <p class="eyebrow">Which screen is this?</p>
    <div class="choices">
      <button class="choice ${last === 'control' ? 'last' : ''}" id="pick-control">
        <span class="ico">${icon('laptop')}</span>
        <b>I'm running the songs</b>
        <small>This laptop or phone controls the slides</small>
      </button>
      <button class="choice ${last === 'tv' ? 'last' : ''}" id="pick-tv">
        <span class="ico">${icon('tv')}</span>
        <b>This is the TV screen</b>
        <small>This screen only shows the words</small>
      </button>
    </div>
    ${store.user ? `<p class="small muted signed-in">Logged in as ${esc(store.user.email)} · <button class="link" id="logout">Log out</button></p>` : ''}
  </main>`, 'page-welcome');
  $('#pick-control').onclick = () => { local.set('role', 'control'); location.hash = '#/home'; };
  $('#pick-tv').onclick = () => { local.set('role', 'tv'); location.hash = '#/tv'; };
  const lo = $('#logout'); if (lo) lo.onclick = doLogout;
}

async function doLogout() {
  if (store.uid) local.del('sets.' + store.uid);
  await signOut(auth);
  store.draft = null;
  toast('You are logged out. See you again soon.');
  go('#/');
}

// Log in / sign up --------------------------------------------------------
function loginScreen(mode = 'login') {
  const tv = local.get('role') === 'tv' && (pendingAfterLogin || '').includes('tv');
  show(`<main class="center-page narrow">
    ${header(mode === 'login' ? 'Log in' : 'Make an account', { back: '#/' })}
    ${tv ? `<p class="note">Use the <b>same account</b> as the laptop running the songs.</p>` : ''}
    <form id="f" class="stack" autocomplete="on">
      ${mode === 'signup' ? `<label>Your name<input class="input" name="name" autocomplete="name" required></label>` : ''}
      <label>Email<input class="input" name="email" type="email" autocomplete="email" inputmode="email" required autofocus></label>
      <label>Password<input class="input" name="pw" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" minlength="6" required>
        ${mode === 'signup' ? '<small>At least 6 letters or numbers.</small>' : ''}</label>
      <label class="check"><input type="checkbox" id="showpw"> Show password</label>
      <p class="error" id="err" role="alert"></p>
      <button class="btn primary big" type="submit">${mode === 'login' ? 'Log in' : 'Make my account'}</button>
    </form>
    <div class="stack center">
      ${mode === 'login'
        ? `<button class="btn ghost" id="swap">New here? Make an account</button><button class="link" id="forgot">Forgot password?</button>`
        : `<button class="btn ghost" id="swap">I already have an account</button>`}
    </div>
  </main>`);
  const f = $('#f');
  $('#showpw').onchange = e => { f.pw.type = e.target.checked ? 'text' : 'password'; };
  $('#swap').onclick = () => loginScreen(mode === 'login' ? 'signup' : 'login');
  const fg = $('#forgot');
  if (fg) fg.onclick = async () => {
    if (!f.email.value) { $('#err').textContent = 'Type your email first, then tap "Forgot password?" again.'; return; }
    try { await sendPasswordResetEmail(auth, f.email.value.trim()); toast('We sent you an email to reset your password.'); }
    catch (e) { $('#err').textContent = friendly(e); }
  };
  f.onsubmit = async e => {
    e.preventDefault();
    const btn = f.querySelector('button[type=submit]');
    btn.disabled = true; $('#err').textContent = '';
    try {
      if (!pendingAfterLogin) pendingAfterLogin = local.get('role') === 'tv' ? '#/tv' : '#/home';
      if (mode === 'login') await signInWithEmailAndPassword(auth, f.email.value.trim(), f.pw.value);
      else {
        const cred = await createUserWithEmailAndPassword(auth, f.email.value.trim(), f.pw.value);
        await updateProfile(cred.user, { displayName: f.name.value.trim() }).catch(() => {});
        await ensureProfile(cred.user, f.name.value.trim());
      }
    } catch (err) { $('#err').textContent = friendly(err); btn.disabled = false; }
  };
}

function friendly(e) {
  const c = e.code || '';
  if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found')) return 'That email or password is not right. Please try again.';
  if (c.includes('email-already-in-use')) return 'This email already has an account. Tap "I already have an account".';
  if (c.includes('weak-password')) return 'Please use a longer password (at least 6).';
  if (c.includes('invalid-email')) return 'Please check the email address.';
  if (c.includes('too-many-requests')) return 'Too many tries. Please wait a minute and try again.';
  if (c.includes('user-disabled')) return 'This account is switched off. Please ask the admin.';
  if (c.includes('network')) return 'No internet right now. Please check the Wi-Fi.';
  return 'Something went wrong. Please try again.';
}

// Home: saved sets --------------------------------------------------------
async function home() {
  const cached = cachedSets();
  // Ready-made sets come from the site itself, so show them even if the saved sets are slow to load.
  const ready = await readySets();
  const todo = sets => ready.filter(p => !sets.some(s => s.preset === p.id));
  const key = sets => JSON.stringify([sets.map(x => [x.id, x.updatedMs]), todo(sets).map(p => p.id)]);
  if (cached) drawHome(cached, todo(cached));
  else if (ready.length) drawHome([], ready);
  else show(`<main class="page">${header('Your song sets', { back: '#/', right: menuButtons() })}${loading('Getting your song sets…')}</main>`), bindMenu();
  let sets;
  try { sets = await listSets(); }
  catch (e) { console.warn(e); if (!cached) toast('Could not load your sets. Please check the internet.'); return; }
  if (!location.hash.startsWith('#/home')) return;
  if (!sets.length && !ready.length) { newDraft(); location.hash = '#/new/place'; return; }
  if (key(sets) !== key(cached || [])) drawHome(sets, todo(sets));
}

// Ready-made sets (data/presets.json) that someone prepared for this account.
async function readySets() {
  const list = await fetch('/data/presets.json').then(r => r.ok ? r.json() : []).catch(() => []);
  const now = new Date().toISOString().slice(0, 10);
  return list.filter(p => (!p.admin || store.isAdmin) && (!p.until || p.until >= now));
}

async function addReady(p) {
  await loadLibrary();
  const songs = p.songs.map(x => getSong(x.id)).filter(Boolean).map((s, k) => ({
    id: s.id, title: s.title, artist: s.artist || '', cat: p.songs[k].cat || s.cat, flow: p.songs[k].flow || s.flow
  }));
  if (!songs.length) throw new Error('The songs for this set are not in the library yet.');
  const slides = songs.flatMap((s, k) => buildSlides(getSong(s.id), s.flow, k));
  return createSet({
    name: p.name, place: p.place || 'suntec', connection: local.get('connection', 'cable'), lang: p.lang || 'both',
    bg: p.bg || { type: 'gradient', id: 'forest' }, songs, slides, preset: p.id
  });
}

function drawHome(sets, ready) {
  const first = (store.user?.displayName || '').split(' ')[0];
  const card = s => `<div class="set-card">
        <a class="set-open" href="#/set/${s.id}">
          <span class="play">${icon('play')}</span>
          <span class="set-text">
            <b>${esc(s.name || 'Song set')}</b>
            <span class="songs">${(s.songs || []).map(x => esc(x.title)).join(' · ')}</span>
            <small>${s.place === 'cell' ? 'Home cell group' : 'Suntec'} · ${(s.slides || []).length} slides</small>
          </span>
        </a>
        <button class="link danger small" data-del="${s.id}" aria-label="Remove ${esc(s.name)}">Remove</button>
      </div>`;
  show(`<main class="page">
    ${header('Your song sets', { back: '#/', right: menuButtons() })}
    <p class="lead">${first ? `Hi ${esc(first)}! ` : ''}Tap a set to start.</p>
    ${ready.length ? `<section class="ready"><p class="eyebrow">Ready for you</p><div class="set-list">
      ${ready.map(p => `<div class="set-card"><button class="set-open" data-ready="${esc(p.id)}">
        <span class="play">${icon('plus')}</span>
        <span class="set-text"><b>${esc(p.name)}</b>
          <span class="songs">${p.songs.map(x => esc(x.title || x.id)).join(' · ')}</span>
          <small>Prepared for you. Tap to add it to your sets.</small></span>
      </button></div>`).join('')}</div></section>` : ''}
    ${sets.length ? `<div class="set-list">${sets.map(card).join('')}</div>` : ''}
    <a class="btn primary big wide" href="#/new/place" id="newset">${icon('plus')}Make a new set</a>
  </main>`);
  bindMenu();
  $('#newset').onclick = () => newDraft();
  document.querySelectorAll('[data-ready]').forEach(b => b.onclick = async () => {
    const p = ready.find(x => x.id === b.dataset.ready);
    b.disabled = true;
    try { const id = await addReady(p); toast(`"${p.name}" is ready.`); location.hash = '#/set/' + id; }
    catch (e) { console.error(e); b.disabled = false; toast(e.message || 'Could not add the set. Please check the internet.'); }
  });
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
    if (!(await confirmBox('Remove this set? This cannot be undone.', 'Yes, remove'))) return;
    await removeSet(b.dataset.del); toast('Set removed.'); home();
  });
}

export const loading = (msg = 'Loading…') => `<div class="loading" role="status"><span class="spin" aria-hidden="true"></span>${esc(msg)}</div>`;

export function menuButtons() {
  return `<details class="menu"><summary class="btn ghost small" aria-label="Menu">${icon('menu')}Menu</summary><div class="menu-list">
    <a href="#/home">My song sets</a>
    <a href="#/songs">Song library</a>
    <a href="#/song/new">Add a song</a>
    ${store.isAdmin ? '<a href="#/admin">Admin</a>' : ''}
    <button class="link" data-bigtext>${document.documentElement.classList.contains('bigtext') ? 'Aa Normal text size' : 'Aa Bigger text'}</button>
    <a href="#/">Switch screen</a>
    <button class="link" data-logout>Log out</button>
  </div></details>`;
}
export function bindMenu() {
  document.querySelectorAll('[data-logout]').forEach(b => b.onclick = doLogout);
  document.querySelectorAll('[data-bigtext]').forEach(b => b.onclick = () => {
    const on = document.documentElement.classList.toggle('bigtext');
    local.set('bigtext', on);
    b.textContent = on ? 'Aa Normal text size' : 'Aa Bigger text';
    b.closest('details').open = false;
  });
  // Close the menu when tapping anywhere else.
  document.querySelectorAll('details.menu').forEach(d => d.ontoggle = () => {
    if (!d.open) return;
    const off = e => { if (!d.contains(e.target)) { d.open = false; document.removeEventListener('click', off, true); } };
    setTimeout(() => document.addEventListener('click', off, true));
  });
  document.querySelectorAll('.menu-list a').forEach(a => a.onclick = () => a.closest('details').open = false);
}
window.__w252f = { route };

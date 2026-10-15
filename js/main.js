import {
  auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile
} from './firebase.js';
import { show, esc, toast, header, confirmBox, $ } from './ui.js';
import { store, local, ensureProfile, listSets, removeSet, newDraft } from './store.js';
import { wizard } from './wizard.js';
import { controlScreen } from './control.js';
import { tvScreen } from './tv.js';
import { songEditor, songLibrary } from './editor.js';
import { adminScreen } from './admin.js';

const params = new URLSearchParams(location.search);
let authReady = false;
let pendingAfterLogin = null;

onAuthStateChanged(auth, async user => {
  store.user = user;
  if (user) ensureProfile(user);
  if (!authReady) { authReady = true; route(); return; }
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
      case 'tv': return tvScreen({ mode: 'cloud' });
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
  show(`<main class="center-page welcome">
    <div class="logo-mark" aria-hidden="true"></div>
    <h1>Welcome</h1>
    <p class="lead">Let's get the words up, so everyone can sing with their whole heart.</p>
    <p class="q">Which screen is this?</p>
    <div class="choices">
      <button class="choice ${last === 'control' ? 'last' : ''}" id="pick-control">
        <span class="ico" aria-hidden="true">💻</span>
        <b>I'm running the songs</b>
        <small>This laptop or phone controls the slides</small>
      </button>
      <button class="choice ${last === 'tv' ? 'last' : ''}" id="pick-tv">
        <span class="ico" aria-hidden="true">📺</span>
        <b>This is the TV screen</b>
        <small>This screen only shows the words</small>
      </button>
    </div>
    ${store.user ? `<p class="small muted">Logged in as ${esc(store.user.email)} · <button class="link" id="logout">Log out</button></p>` : ''}
  </main>`, 'page-welcome');
  $('#pick-control').onclick = () => { local.set('role', 'control'); location.hash = '#/home'; };
  $('#pick-tv').onclick = () => { local.set('role', 'tv'); location.hash = '#/tv'; };
  const lo = $('#logout'); if (lo) lo.onclick = doLogout;
}

async function doLogout() {
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
  show(`<main class="page">${header('Your song sets', { back: '#/', right: menuButtons() })}<p class="muted">Loading…</p></main>`);
  bindMenu();
  let sets = [];
  try { sets = await listSets(); } catch (e) { console.warn(e); toast('Could not load your sets. Check the internet.'); }
  if (!sets.length) { newDraft(); location.hash = '#/new/place'; return; }
  show(`<main class="page">
    ${header('Your song sets', { back: '#/', right: menuButtons() })}
    <p class="lead">Tap a set to start.</p>
    <div class="set-list">
      ${sets.map(s => `<div class="set-card">
        <a class="set-open" href="#/set/${s.id}">
          <b>${esc(s.name || 'Song set')}</b>
          <span>${(s.songs || []).map(x => esc(x.title)).join(' · ')}</span>
          <small>${s.place === 'cell' ? 'Home cell group' : 'Suntec'} · ${(s.slides || []).length} slides</small>
        </a>
        <button class="btn ghost small" data-del="${s.id}" aria-label="Remove ${esc(s.name)}">Remove</button>
      </div>`).join('')}
    </div>
    <a class="btn primary big wide" href="#/new/place" id="newset">+ Make a new set</a>
  </main>`);
  bindMenu();
  $('#newset').onclick = () => newDraft();
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
    if (!(await confirmBox('Remove this set? This cannot be undone.', 'Yes, remove'))) return;
    await removeSet(b.dataset.del); toast('Set removed.'); home();
  });
}

export function menuButtons() {
  return `<details class="menu"><summary class="btn ghost small" aria-label="Menu">☰ Menu</summary><div class="menu-list">
    <a href="#/home">My song sets</a>
    <a href="#/songs">Song library</a>
    <a href="#/song/new">Add a song</a>
    ${store.isAdmin ? '<a href="#/admin">Admin</a>' : ''}
    <a href="#/">Switch screen</a>
    <button class="link" data-logout>Log out</button>
  </div></details>`;
}
export function bindMenu() {
  document.querySelectorAll('[data-logout]').forEach(b => b.onclick = doLogout);
  document.querySelectorAll('.menu-list a').forEach(a => a.onclick = () => a.closest('details').open = false);
}
window.__w252f = { route };

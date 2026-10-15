// Admin: look after people and songs.
import { auth } from './firebase.js';
import { show, esc, toast, header, confirmBox, askText, $ } from './ui.js';
import { menuButtons, bindMenu } from './main.js';

async function api(action, body = {}) {
  const token = await auth.currentUser.getIdToken();
  const r = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ action, ...body }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Something went wrong.');
  return d;
}

export async function adminScreen() {
  show(`<main class="page">${header('Admin', { back: '#/home', right: menuButtons() })}<p class="muted">Loading people…</p></main>`);
  bindMenu();
  let users = [];
  try { users = (await api('list')).users; } catch (e) { toast(e.message); }
  show(`<main class="page">
    ${header('Admin', { back: '#/home', right: menuButtons() })}
    <div class="row gap wrap"><a class="btn ghost" href="#/songs">Songs: add, change, remove</a></div>
    <h2>People (${users.length})</h2>
    <form id="add" class="add-user">
      <input class="input" name="email" type="email" placeholder="Email" required>
      <input class="input" name="pw" type="text" placeholder="Password (6 or more)" minlength="6" required>
      <input class="input" name="name" placeholder="Name (optional)">
      <button class="btn primary">+ Add person</button>
    </form>
    <ul class="people">${users.map(u => `<li class="${u.disabled ? 'off' : ''}">
      <span class="t"><b>${esc(u.name || u.email)}</b><small>${esc(u.email)} · joined ${esc(u.created || '')}${u.lastLogin ? ' · last in ' + esc(u.lastLogin) : ''}${u.disabled ? ' · switched off' : ''}</small></span>
      <span class="acts">
        <button class="btn ghost small" data-pw="${u.uid}">New password</button>
        <button class="btn ghost small" data-tog="${u.uid}" data-off="${u.disabled ? 1 : 0}">${u.disabled ? 'Switch on' : 'Switch off'}</button>
        <button class="btn ghost small danger" data-rm="${u.uid}" data-email="${esc(u.email)}">Remove</button>
      </span></li>`).join('')}</ul>
  </main>`);
  bindMenu();
  $('#add').onsubmit = async e => {
    e.preventDefault();
    const f = e.target;
    try { await api('create', { email: f.email.value.trim(), password: f.pw.value, name: f.name.value.trim() }); toast('Person added.'); adminScreen(); }
    catch (err) { toast(err.message); }
  };
  $('.people').onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    try {
      if (b.dataset.pw) {
        const pw = await askText('Type a new password (6 or more letters or numbers):', '', { ok: 'Set password' });
        if (!pw) return;
        await api('password', { uid: b.dataset.pw, password: pw }); toast('Password changed.');
      } else if (b.dataset.tog) {
        await api('disable', { uid: b.dataset.tog, disabled: b.dataset.off !== '1' }); toast('Done.'); adminScreen();
      } else if (b.dataset.rm) {
        if (!(await confirmBox(`Remove ${b.dataset.email} and all their sets? This cannot be undone.`, 'Yes, remove'))) return;
        await api('delete', { uid: b.dataset.rm }); toast('Removed.'); adminScreen();
      }
    } catch (err) { toast(err.message); }
  };
}

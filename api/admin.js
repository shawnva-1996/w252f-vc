// Admin actions on people. Only the admin account can use this.
// The Firebase project is shared with other apps, so we only ever list and
// change people who have a profile in this app (w252f_users).
import { adminAuth, adminDb, caller, ADMIN_EMAIL } from './_lib/firebase.js';

const day = t => (t ? new Date(t).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

async function isOurs(uid) {
  return (await adminDb.collection('w252f_users').doc(uid).get()).exists;
}

async function removeData(uid) {
  for (const col of ['w252f_sets', 'w252f_media']) {
    const snap = await adminDb.collection(col).where('ownerUid', '==', uid).get();
    await Promise.all(snap.docs.map(d => d.ref.delete()));
  }
  await adminDb.collection('w252f_live').doc(uid).delete().catch(() => {});
  await adminDb.collection('w252f_users').doc(uid).delete();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Not allowed' });
  const me = await caller(req);
  if (!me || (me.email || '').toLowerCase() !== ADMIN_EMAIL) return res.status(403).json({ error: 'Only the admin can do this.' });
  const { action, uid, email, password, name, disabled } = req.body || {};
  try {
    if (action === 'list') {
      const profiles = await adminDb.collection('w252f_users').get();
      const ids = profiles.docs.map(d => ({ uid: d.id }));
      const found = [];
      for (let i = 0; i < ids.length; i += 100) found.push(...(await adminAuth.getUsers(ids.slice(i, i + 100))).users);
      const prof = Object.fromEntries(profiles.docs.map(d => [d.id, d.data()]));
      const users = found.map(u => ({
        uid: u.uid, email: u.email, name: prof[u.uid]?.name || u.displayName || '',
        disabled: !!prof[u.uid]?.disabled, created: day(u.metadata.creationTime), lastLogin: day(u.metadata.lastSignInTime)
      })).sort((a, b) => (a.email || '').localeCompare(b.email || ''));
      return res.json({ users });
    }
    if (action === 'create') {
      if (!email || !password || password.length < 6) return res.status(400).json({ error: 'Please give an email and a password of 6 or more.' });
      let u;
      try { u = await adminAuth.createUser({ email, password, displayName: name || undefined }); }
      catch (e) {
        if (e.code === 'auth/email-already-exists') u = await adminAuth.getUserByEmail(email);
        else throw e;
      }
      await adminDb.collection('w252f_users').doc(u.uid).set({ email, name: name || '', createdAt: new Date() }, { merge: true });
      return res.json({ ok: true, uid: u.uid });
    }
    if (!uid || !(await isOurs(uid))) return res.status(404).json({ error: 'Person not found.' });
    if (uid === me.uid && action !== 'password') return res.status(400).json({ error: 'You cannot do that to the admin account.' });
    if (action === 'password') {
      if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be 6 or more.' });
      await adminAuth.updateUser(uid, { password });
      return res.json({ ok: true });
    }
    if (action === 'disable') {
      // Switched-off people can't open or save anything in this app (see firestore.rules).
      await adminDb.collection('w252f_users').doc(uid).set({ disabled: !!disabled }, { merge: true });
      return res.json({ ok: true });
    }
    if (action === 'delete') {
      await removeData(uid);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

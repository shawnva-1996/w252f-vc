// Sends what is on screen from the laptop to every TV:
// - another window on the same computer (cable / HDMI)
// - a Chromecast-style screen (Chrome "Cast")
// - another device logged in to the same account (over the internet)
import { db, C, doc, setDoc, onSnapshot, serverTimestamp } from './firebase.js';

const CHANNEL = 'w252f-live';
let bc;
try { bc = new BroadcastChannel(CHANNEL); } catch { bc = null; }

const castConnections = new Set();
let lastBgKey = null;
let lastState = null;

export function publish(uid, state) {
  lastState = state;
  const msg = { type: 'state', state };
  try { bc && bc.postMessage(msg); } catch {}
  for (const c of castConnections) { try { c.state === 'connected' && c.send(JSON.stringify(msg)); } catch {} }
  if (!uid) return;
  const data = {
    setId: state.setId || null, index: state.index ?? 0, total: state.total ?? 0,
    frame: state.frame || { kind: 'blank' }, black: !!state.black, hidden: !!state.hidden,
    place: state.place || 'suntec', lang: state.lang || 'both', bgKey: state.bgKey || 'forest',
    t: Date.now(), at: serverTimestamp()
  };
  if (state.bgKey !== lastBgKey) { data.bg = state.bg || null; lastBgKey = state.bgKey; }
  setDoc(doc(db, C.live, uid), data, { merge: true }).catch(e => console.warn('live update failed', e));
}

// Re-send the last state, e.g. when a new TV window opens.
export function republish(uid) { if (lastState) { lastBgKey = null; publish(uid, lastState); } }

if (bc) bc.addEventListener('message', e => { if (e.data?.type === 'hello' && lastState) bc.postMessage({ type: 'state', state: lastState }); });

// TV side --------------------------------------------------------------
// local: a TV window on the same computer (cable). Otherwise the TV follows the
// account over the internet only, so an old tab on this computer can't get in the way.
export function listen({ uid, local }, onState) {
  const stops = [];
  if (bc && local) {
    const h = e => { if (e.data?.type === 'state') onState(e.data.state, 'local'); };
    bc.addEventListener('message', h);
    bc.postMessage({ type: 'hello' });
    stops.push(() => bc.removeEventListener('message', h));
  }
  if (uid && !local) {
    let bg = null;
    stops.push(onSnapshot(doc(db, C.live, uid), snap => {
      const d = snap.data();
      if (!d) return;
      if ('bg' in d) bg = d.bg;
      onState({ ...d, bg }, 'cloud');
    }, err => console.warn('live listen failed', err)));
  }
  return () => stops.forEach(f => f());
}

// Chrome "Cast" (Presentation API). Works with Chromecast / Google TV.
export const canCast = () => typeof window.PresentationRequest === 'function';

export async function startCast(uid) {
  const req = new PresentationRequest([location.origin + '/?tv=cast']);
  const conn = await req.start();
  const add = () => { castConnections.add(conn); if (lastState) conn.send(JSON.stringify({ type: 'state', state: lastState })); };
  if (conn.state === 'connected') add(); else conn.addEventListener('connect', add);
  conn.addEventListener('terminate', () => castConnections.delete(conn));
  conn.addEventListener('close', () => castConnections.delete(conn));
  return conn;
}

export function listenCast(onState) {
  const rec = navigator.presentation && navigator.presentation.receiver;
  if (!rec) return;
  rec.connectionList.then(list => {
    const hook = c => c.addEventListener('message', e => { try { const m = JSON.parse(e.data); if (m.type === 'state') onState(m.state, 'cast'); } catch {} });
    list.connections.forEach(hook);
    list.addEventListener('connectionavailable', e => hook(e.connection));
  });
}

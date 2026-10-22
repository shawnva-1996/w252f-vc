// The TV screen: only shows the words, and follows the laptop.
import { show, $ } from './ui.js';
import { store } from './store.js';
import { drawSlide } from './render.js';
import { listen, listenCast } from './live.js';

let stop = null;
let wake = null;

export function tvScreen({ mode }) {
  // mode: 'local' (window on the same laptop), 'cast' (Chromecast), 'cloud' (another device, logged in)
  if (stop) stop();
  show(`<div class="tv" id="tv">
    <div class="stage full" id="screen"></div>
    <div class="tv-wait" id="wait">
      <p class="eyebrow">Worship slides</p>
      <h1>Ready for worship</h1>
      <p>${mode === 'cloud' ? 'Waiting for the laptop. Open a song set there and the words will show here.' : 'Waiting for the laptop…'}</p>
      ${mode !== 'cast' ? '<p class="tap">Tap anywhere to fill the whole screen.</p>' : ''}
      ${mode === 'cloud' ? '<a class="btn ghost small" href="#/" id="leave">Leave TV mode</a>' : ''}
    </div>
  </div>`, 'page-tv');
  document.body.classList.add('is-tv');
  const screen = $('#screen'), wait = $('#wait');
  let last = null;
  const onState = st => {
    last = st;
    wait.hidden = true;
    drawSlide(screen, st.frame, { place: st.place, lang: st.lang, showZh: st.showZh, bg: st.bg, black: st.black, hidden: st.hidden });
  };
  if (mode === 'cast') listenCast(onState);
  else stop = listen({ uid: store.uid, local: mode === 'local' }, onState);
  window.addEventListener('resize', () => last && onState(last, 'redraw'));
  $('#tv').addEventListener('click', e => {
    if (e.target.closest('#leave')) { document.body.classList.remove('is-tv'); if (stop) stop(); return; }
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  });
  keepAwake();
  window.addEventListener('hashchange', () => { document.body.classList.remove('is-tv'); if (stop) { stop(); stop = null; } }, { once: true });
}

async function keepAwake() {
  try {
    if ('wakeLock' in navigator) {
      wake = await navigator.wakeLock.request('screen');
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') wake = await navigator.wakeLock.request('screen').catch(() => null);
      });
    }
  } catch {}
}

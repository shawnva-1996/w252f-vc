// The TV screen: only shows the words, and follows the laptop.
import { show, $ } from './ui.js';
import { store } from './store.js';
import { drawSlide, playVideo } from './render.js';
import { listen, listenCast } from './live.js';

let stop = null;
let wake = null;

export function tvScreen({ mode }) {
  // mode: 'local' (window on the same laptop), 'cast' (Chromecast), 'cloud' (another device, logged in)
  if (stop) stop();
  show(`<div class="tv" id="tv">
    <div class="stage full" id="screen"></div>
    <button class="tv-hint" id="vhint" hidden>Tap to start the video</button>
    <div class="tv-wait" id="wait">
      <img class="tv-logo" src="/img/chc-logo.svg" alt="City Harvest Church">
      <p class="eyebrow">Worship slides</p>
      <h1>Ready for worship</h1>
      <p>${mode === 'cloud' ? 'Waiting for the laptop. Open a song set there and the words will show here.' : 'Waiting for the laptop…'}</p>
      ${mode !== 'cast' ? '<p class="tap">Tap anywhere to fill the whole screen.</p>' : ''}
      ${mode === 'cloud' ? '<a class="btn ghost small" href="#/" id="leave">Leave TV mode</a>' : ''}
    </div>
  </div>`, 'page-tv');
  document.body.classList.add('is-tv');
  const screen = $('#screen'), wait = $('#wait'), hint = $('#vhint');
  let last = null, hintTimer = null;
  const onState = st => {
    last = st;
    wait.hidden = true;
    drawSlide(screen, st.frame, { place: st.place, lang: st.lang, showZh: st.showZh, bg: st.bg, black: st.black, hidden: st.hidden });
    watchVideo();
  };
  // If the browser holds the background video back, say so (a tap starts it).
  const watchVideo = () => {
    clearTimeout(hintTimer);
    const v = screen.querySelector('video.bgv');
    if (!v) { hint.hidden = true; return; }
    const cant = () => { hint.textContent = "This video can't play in this browser. Please use an MP4 video."; hint.hidden = false; };
    v.onplaying = () => { hint.hidden = true; };
    v.onerror = cant;
    if (v.error) return cant();
    if (!v.paused) { hint.hidden = true; return; }
    hintTimer = setTimeout(() => { if (v.isConnected && v.paused && !v.error) { hint.textContent = 'Tap to start the video'; hint.hidden = false; } }, 2500);
  };
  if (mode === 'cast') listenCast(onState);
  else stop = listen({ uid: store.uid, local: mode === 'local' }, onState);
  window.addEventListener('resize', () => last && onState(last, 'redraw'));
  $('#tv').addEventListener('click', e => {
    if (e.target.closest('#leave')) { document.body.classList.remove('is-tv'); if (stop) stop(); return; }
    // A tap also starts the background video if the browser held it back.
    document.querySelectorAll('video.bgv').forEach(playVideo);
    if (!screen.querySelector('video.bgv')?.error) hint.hidden = true;
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

// Browsers pause videos in hidden windows; start them again when the TV is shown.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') document.querySelectorAll('.tv video.bgv').forEach(playVideo);
});

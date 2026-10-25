// Small shared helpers for screens.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const app = () => document.getElementById('app');

// Simple line icons (instead of emoji, which look different on every device).
const ICONS = {
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M8 21h8M12 17v4"/>',
  plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v5"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
  cast: '<path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-6M3 12a9 9 0 0 1 9 9M3 16a5 5 0 0 1 5 5M3 20h.01"/>',
  black: '<rect x="4" y="5" width="16" height="14" fill="currentColor"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8M6.4 7.4A17 17 0 0 0 2.5 12S6 18 12 18a9.6 9.6 0 0 0 4.4-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  look: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 1.5-1.5h2.5A4.5 4.5 0 0 0 21 11c0-4.4-4-8-9-8z"/><path d="M7.5 11h.01M10 7h.01M15 7.5h.01"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
  file: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  blank: '<rect x="3" y="6" width="18" height="12"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'
};
export const icon = name => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

export function show(html, cls = '') {
  const el = app();
  el.className = cls;
  el.innerHTML = html;
  window.scrollTo(0, 0);
  const first = el.querySelector('[autofocus]');
  if (first && matchMedia('(pointer:fine)').matches) first.focus();
  return el;
}

let toastTimer;
export function toast(msg, ms = 2600) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), ms);
}

// A simple pop-up. Returns a promise with the button value (or null when closed).
export function modal(inner, { wide = false } = {}) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${inner}</div>`;
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');
    const close = v => { wrap.remove(); document.body.classList.remove('no-scroll'); resolve(v); };
    wrap.addEventListener('click', e => {
      if (e.target === wrap) return close(null);
      const b = e.target.closest('[data-v]');
      if (b) {
        const v = b.dataset.v;
        if (v === 'ok' && wrap._collect) return close(wrap._collect(wrap));
        close(v === 'cancel' ? null : v);
      }
    });
    wrap.addEventListener('keydown', e => { if (e.key === 'Escape') close(null); });
    wrap._resolve = close;
    const f = wrap.querySelector('[autofocus], textarea, input');
    if (f) setTimeout(() => f.focus(), 50);
    modal.current = wrap;
  });
}

export async function confirmBox(question, yes = 'Yes', no = 'No, go back') {
  const v = await modal(`<p class="big">${esc(question)}</p>
    <div class="row gap"><button class="btn ghost" data-v="cancel">${esc(no)}</button><button class="btn primary" data-v="yes">${esc(yes)}</button></div>`);
  return v === 'yes';
}

export async function askText(question, value = '', { multiline = false, ok = 'Save' } = {}) {
  const p = modal(`<p class="big">${esc(question)}</p>
    ${multiline ? `<textarea class="input" rows="6" autofocus>${esc(value)}</textarea>` : `<input class="input" value="${esc(value)}" autofocus>`}
    <div class="row gap"><button class="btn ghost" data-v="cancel">Cancel</button><button class="btn primary" data-v="ok">${esc(ok)}</button></div>`);
  modal.current._collect = w => w.querySelector('.input').value;
  return p;
}

export function header(title, { back = null, right = '' } = {}) {
  return `<header class="top">
    ${back ? `<a class="btn ghost small back" href="${back}" aria-label="Back">${icon('back')}Back</a>` : '<span></span>'}
    <h1>${esc(title)}</h1>
    <div class="top-right">${right}</div>
  </header>`;
}

export const today = () => new Date().toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });

// Small shared helpers for screens.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const app = () => document.getElementById('app');

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
    ${back ? `<a class="btn ghost small back" href="${back}" aria-label="Back">‹ Back</a>` : '<span></span>'}
    <h1>${esc(title)}</h1>
    <div class="top-right">${right}</div>
  </header>`;
}

export const today = () => new Date().toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });

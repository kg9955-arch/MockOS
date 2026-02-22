/**
 * MockOS — UI Helpers
 * ===================
 * Notifications, context menus, CSS variable utilities.
 * @file ui-helpers.js
 */
'use strict';

let notifTO;
function notify(title, msg, col) {
    clearTimeout(notifTO);
    const el = document.getElementById('notification');
    el.style.borderLeftColor = col || 'var(--accent)';
    document.getElementById('notif-title').textContent = title;
    document.getElementById('notif-body').textContent = msg;
    el.classList.add('show');
    notifTO = setTimeout(() => el.classList.remove('show'), 3800);
}

function showCtx(e, items) {
    e.preventDefault(); e.stopPropagation();
    const m = document.getElementById('ctx-menu');
    m.innerHTML = items.map(i => i === '---'
        ? '<div class="ctx-sep"></div>'
        : `<div class="ctx-item ${i.cls || ''}" onclick="(${i.fn.toString()})();closeCtx()">${i.icon || ''} ${i.label}</div>`
    ).join('');
    m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px';
    m.classList.add('open');
    requestAnimationFrame(() => {
        const r = m.getBoundingClientRect();
        if (r.right > window.innerWidth) m.style.left = (e.clientX - r.width) + 'px';
        if (r.bottom > window.innerHeight) m.style.top = (e.clientY - r.height) + 'px';
    });
}

function closeCtx() { document.getElementById('ctx-menu').classList.remove('open'); }

function deskCtx(e) {
    showCtx(e, [
        { icon: '🚀', label: 'App Builder', fn: () => openApp('app-builder') },
        { icon: '⚙️', label: 'Settings', fn: () => openApp('settings') },
        '---',
        { icon: '🎨', label: 'Appearance', fn: () => openApp('settings', 'appearance') },
        { icon: '🖼', label: 'Wallpaper', fn: () => openApp('settings', 'wallpaper') },
        { icon: '📥', label: 'Import Style', fn: () => document.getElementById('fi-style').click() },
        '---',
        { icon: '🔄', label: 'Refresh', fn: () => notify('Desktop', 'Refreshed.') },
    ]);
}

document.addEventListener('click', e => {
    if (!document.getElementById('ctx-menu').contains(e.target)) closeCtx();
});

/** Set a CSS custom property on :root. */
function setVar(prop, val) {
    document.documentElement.style.setProperty(prop, val);
}

/** Convert hex color to "R,G,B" string. */
function h2r(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

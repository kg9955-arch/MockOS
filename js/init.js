/**
 * MockOS — Initialization
 * =======================
 * Boot sequence: build desktop icons, restore saved state,
 * show welcome notification, and register the shutdown function.
 * @file init.js
 */
'use strict';

/* ── Shutdown ── */

function shutdown() {
    closeStart();
    const o = document.createElement('div');
    o.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;opacity:0;transition:opacity 0.7s';
    o.innerHTML = `<div style="font-size:52px">◈</div><div style="color:white;font-family:var(--font-ui);font-size:16px;opacity:0.8">Shutting down ${osName}...</div>`;
    document.body.appendChild(o);
    requestAnimationFrame(() => o.style.opacity = '1');
}

/* ── Boot ── */

buildDesktopIcons();

(function () {
    const s = cookieLoad();
    if (s) {
        stateRestore(s);
        const ago = Math.round((Date.now() - s.savedAt) / 60000);
        setTimeout(() => notify('Welcome back to ' + osName, 'State restored from ' + (ago < 2 ? 'just now' : ago + ' min ago') + ' · Press ◈ to start'), 700);
    } else {
        setTimeout(() => notify('Welcome to ' + osName, 'Double-click icons · Right-click desktop · Press ◈ to start'), 700);
    }
})();

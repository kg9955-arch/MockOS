/**
 * MockOS — State Persistence
 * ==========================
 * Saves and restores the entire OS state (theme, wallpaper, username,
 * custom themes, etc.) using chunked cookies. Auto-saves every 8s
 * and on page hide.
 * @file state.js
 */
'use strict';

const COOKIE_KEY = 'mockos_state';
const COOKIE_DAYS = 365;

/* ── Cookie Helpers ── */

function cookieSave(data) {
    try {
        const raw = JSON.stringify(data);
        const chunks = [];
        for (let i = 0; i < raw.length; i += 3800) chunks.push(raw.slice(i, i + 3800));
        for (let i = 0; i < 20; i++) cookieDelete(COOKIE_KEY + '_' + i);
        const exp = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
        chunks.forEach((chunk, i) => {
            document.cookie = `${COOKIE_KEY}_${i}=${encodeURIComponent(chunk)};expires=${exp};path=/;SameSite=Lax`;
        });
        document.cookie = `${COOKIE_KEY}_count=${chunks.length};expires=${exp};path=/;SameSite=Lax`;
    } catch (e) { console.warn('MockOS: cookie save failed', e); }
}

function cookieLoad() {
    try {
        const jar = {};
        document.cookie.split(';').forEach(c => {
            const [k, ...v] = c.trim().split('=');
            jar[k] = decodeURIComponent(v.join('='));
        });
        const count = parseInt(jar[COOKIE_KEY + '_count'] || '0');
        if (!count) return null;
        let raw = '';
        for (let i = 0; i < count; i++) raw += (jar[COOKIE_KEY + '_' + i] || '');
        return raw ? JSON.parse(raw) : null;
    } catch (e) { console.warn('MockOS: cookie load failed', e); return null; }
}

function cookieDelete(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

function cookieClear() {
    for (let i = 0; i < 20; i++) cookieDelete(COOKIE_KEY + '_' + i);
    cookieDelete(COOKIE_KEY + '_count');
}

/* ── Capture / Restore ── */

function stateCapture() {
    const cs = getComputedStyle(document.documentElement);
    const cssVars = {};
    ['--bg', '--surface', '--surface2', '--surface3', '--border', '--accent', '--accent2', '--accent-rgb',
        '--text', '--text-muted', '--radius', '--win-radius', '--font-ui', '--font-mono'].forEach(v => {
            cssVars[v] = cs.getPropertyValue(v).trim();
        });

    const dbg = document.getElementById('desktop-bg');
    const wallpaper = dbg ? (dbg.style.background || dbg.style.backgroundImage || '') : '';
    const dgrid = document.getElementById('desktop-grid');
    const gridVisible = dgrid ? dgrid.style.display !== 'none' : true;
    const tb = document.getElementById('taskbar');
    const tbPos = tb ? (tb.style.top === '0px' ? 'top' : 'bottom') : 'bottom';
    const injectedStyle = document.getElementById('imported-style')?.textContent || '';
    const fontScale = parseFloat(document.documentElement.style.fontSize) || 1;
    const tbBg = tb ? tb.style.background : '';
    const glowOv = document.getElementById('glow-ov')?.textContent || '';

    return {
        v: 2,
        cssVars, wallpaper, gridVisible, tbPos, injectedStyle,
        fontScale, tbBg, glowOv, osName,
        username: document.getElementById('sm-username')?.textContent || 'User',
        avatar: document.getElementById('sm-avatar')?.textContent || '👤',
        customThemes,
        savedAt: Date.now()
    };
}

function stateRestore(s) {
    if (!s || s.v !== 2) return;

    if (s.cssVars) Object.entries(s.cssVars).forEach(([k, v]) => { if (v) document.documentElement.style.setProperty(k, v); });
    if (s.wallpaper) { const dbg = document.getElementById('desktop-bg'); if (dbg) dbg.style.background = s.wallpaper; }
    const dgrid = document.getElementById('desktop-grid');
    if (dgrid) dgrid.style.display = s.gridVisible === false ? 'none' : '';
    if (s.tbPos) setTbPos(s.tbPos);
    if (s.injectedStyle) {
        let el = document.getElementById('imported-style');
        if (!el) { el = document.createElement('style'); el.id = 'imported-style'; document.head.appendChild(el); importedStyle = el; }
        el.textContent = s.injectedStyle; importedStyle = el;
    }
    if (s.fontScale && s.fontScale !== 1) document.documentElement.style.fontSize = s.fontScale + 'rem';
    if (s.tbBg) { const tb = document.getElementById('taskbar'); if (tb) tb.style.background = s.tbBg; }
    if (s.glowOv) {
        let el = document.getElementById('glow-ov');
        if (!el) { el = document.createElement('style'); el.id = 'glow-ov'; document.head.appendChild(el); }
        el.textContent = s.glowOv;
    }
    if (s.osName && s.osName !== 'MockOS') setOsName(s.osName);
    if (s.username && s.username !== 'User') {
        const su = document.getElementById('sm-username'); if (su) su.textContent = s.username;
        const ad = document.getElementById('acc-name-disp'); if (ad) ad.textContent = s.username;
    }
    if (s.avatar && s.avatar !== '👤') {
        const sa = document.getElementById('sm-avatar'); if (sa) sa.textContent = s.avatar;
        const av = document.getElementById('acc-avi'); if (av) av.textContent = s.avatar;
    }
    if (Array.isArray(s.customThemes)) customThemes = s.customThemes;
}

/* ── Auto-save wiring ── */

let _saveTimer = null;
function stateSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => cookieSave(stateCapture()), 800);
}

// Patch state-mutating functions to auto-save
const _origSetVar = setVar;
setVar = function (p, v) { _origSetVar(p, v); stateSave(); };

const _origApplyBgCss = applyBgCss;
applyBgCss = function (bg) { _origApplyBgCss(bg); stateSave(); };

const _origToggleDesktopGrid = toggleDesktopGrid;
toggleDesktopGrid = function (el) { _origToggleDesktopGrid(el); stateSave(); };

const _origSetGlow = setGlow;
setGlow = function (on) { _origSetGlow(on); stateSave(); };

const _origSetTbPos = setTbPos;
setTbPos = function (pos) { _origSetTbPos(pos); stateSave(); };

const _origSetUsername = setUsername;
setUsername = function (n) { _origSetUsername(n); stateSave(); };

const _origSetAvatar = setAvatar;
setAvatar = function (em) { _origSetAvatar(em); stateSave(); };

const _origSetOsName = setOsName;
setOsName = function (n) { _origSetOsName(n); stateSave(); };

const _origApplyCSS = applyCSS;
applyCSS = function (css, src) { _origApplyCSS(css, src); stateSave(); };

const _origSaveTheme = saveTheme;
saveTheme = function () { _origSaveTheme(); stateSave(); };

// Save on page hide
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') cookieSave(stateCapture());
});
window.addEventListener('pagehide', () => cookieSave(stateCapture()));

function clearSavedState() {
    cookieClear();
    notify('State', 'Saved state cleared — restart to reset.');
}

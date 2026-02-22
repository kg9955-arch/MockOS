/**
 * MockOS — Window Manager
 * =======================
 * Handles creation, focus, minimize, maximize, close, drag, and resize
 * of floating desktop windows. Each window gets a corresponding taskbar item.
 *
 * @file window-manager.js
 */

'use strict';

/** Z-index counter – each focused window gets the next value. */
let wZ = 100;

/** Map of open windows keyed by window ID. */
const wins = {};

/** Map of taskbar item elements keyed by window ID. */
const tbItems = {};

/** Currently focused window ID. */
let activeWin = null;

/** Recent app open history (used by Start Menu). */
const recentApps = [];

/**
 * Create and display a new desktop window.
 *
 * @param {string}   id      - Unique window ID
 * @param {string}   title   - Window title bar text
 * @param {number}   width   - Initial width in px
 * @param {number}   height  - Initial height in px
 * @param {number}   [x]     - Left position (auto-cascades if omitted)
 * @param {number}   [y]     - Top position  (auto-cascades if omitted)
 * @param {Function|string} bodyFn - Callback receiving the body element, or HTML string
 * @returns {HTMLElement} The window element
 */
function createWindow(id, title, width, height, x, y, bodyFn) {
    if (wins[id]) { focusWin(id); return wins[id].el; }

    const scatter = Object.keys(wins).length;
    x = x ?? 80 + scatter * 26;
    y = y ?? 55 + scatter * 22;

    const el = document.createElement('div');
    el.className = 'window';
    el.id = 'win-' + id;
    el.style.cssText = `width:${width}px;height:${height}px;left:${x}px;top:${y}px`;
    el.innerHTML = `
    <div class="window-titlebar" onmousedown="startDrag(event,'${id}')">
      <div class="win-btns">
        <div class="win-btn close" onclick="closeWin('${id}')"></div>
        <div class="win-btn min"   onclick="minWin('${id}')"></div>
        <div class="win-btn max"   onclick="maxWin('${id}')"></div>
      </div>
      <div class="win-title">${title}</div>
      <div style="width:52px"></div>
    </div>
    <div class="window-body" id="wb-${id}"></div>
    <div class="resize-handle" onmousedown="startResize(event,'${id}')"></div>`;

    el.addEventListener('mousedown', () => focusWin(id));
    document.getElementById('desktop').appendChild(el);
    wins[id] = { el, title, min: false, maxed: false, prev: null };

    focusWin(id);
    addTbItem(id, title);

    const wb = document.getElementById('wb-' + id);
    if (typeof bodyFn === 'function') bodyFn(wb);
    else if (typeof bodyFn === 'string') wb.innerHTML = bodyFn;

    // Entrance animation
    el.style.opacity = '0';
    el.style.transform = 'scale(0.91) translateY(14px)';
    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.2s,transform 0.22s cubic-bezier(0.34,1.2,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
        setTimeout(() => el.style.transition = '', 260);
    });

    return el;
}

/** Bring a window to the front and mark it active. */
function focusWin(id) {
    if (!wins[id]) return;
    Object.values(wins).forEach(w => w.el.classList.remove('focused'));
    Object.values(tbItems).forEach(t => t?.classList.remove('active'));
    wins[id].el.style.zIndex = ++wZ;
    wins[id].el.classList.add('focused');
    tbItems[id]?.classList.add('active');
    activeWin = id;
}

/** Close and remove a window with an exit animation. */
function closeWin(id) {
    if (!wins[id]) return;
    const el = wins[id].el;
    el.style.transition = 'opacity 0.15s,transform 0.15s';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.92) translateY(10px)';
    setTimeout(() => el.remove(), 160);
    delete wins[id];
    tbItems[id]?.remove();
    delete tbItems[id];
}

/** Toggle minimize state — hides/shows window with animation. */
function minWin(id) {
    if (!wins[id]) return;
    const w = wins[id];
    w.min = !w.min;

    if (w.min) {
        w.el.style.transition = 'opacity 0.17s,transform 0.17s';
        w.el.style.opacity = '0';
        w.el.style.transform = 'scale(0.88) translateY(18px)';
        setTimeout(() => { if (w.min) w.el.style.display = 'none'; }, 180);
        tbItems[id]?.classList.remove('active');
    } else {
        w.el.style.display = 'flex';
        w.el.style.opacity = '0';
        w.el.style.transform = 'scale(0.88) translateY(18px)';
        requestAnimationFrame(() => {
            w.el.style.transition = 'opacity 0.18s,transform 0.2s cubic-bezier(0.34,1.2,0.64,1)';
            w.el.style.opacity = '1';
            w.el.style.transform = 'none';
            setTimeout(() => w.el.style.transition = '', 220);
        });
        focusWin(id);
    }
}

/** Toggle maximize — fills desktop or restores previous size/position. */
function maxWin(id) {
    const w = wins[id];
    if (!w) return;
    const el = w.el;

    el.style.transition = 'all 0.2s cubic-bezier(0.4,0,0.2,1)';
    if (!w.maxed) {
        w.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
        el.style.left = '0';
        el.style.top = '0';
        el.style.width = '100%';
        el.style.height = 'calc(100vh - var(--taskbar-h))';
        el.style.borderRadius = '0';
        w.maxed = true;
    } else {
        Object.assign(el.style, w.prev);
        el.style.borderRadius = 'var(--win-radius)';
        w.maxed = false;
    }
    setTimeout(() => el.style.transition = '', 220);
}

/** Add a taskbar entry for a window. */
function addTbItem(id, title) {
    const el = document.createElement('div');
    el.className = 'taskbar-item';
    el.title = title;
    el.textContent = title.replace(/[^\u0000-\u00FF]/g, '').trim() || title;
    el.onclick = () => {
        if (!wins[id]) return;
        if (wins[id].min) minWin(id);
        else if (activeWin === id) minWin(id);
        else focusWin(id);
    };
    document.getElementById('taskbar-items').appendChild(el);
    tbItems[id] = el;
}

/* ── Drag & Resize ── */

let dragging = null, dragOff = {};

/** Begin dragging a window by its title bar. */
function startDrag(e, id) {
    if (e.target.classList.contains('win-btn') || wins[id]?.maxed) return;
    dragging = id;
    focusWin(id);
    const r = wins[id].el.getBoundingClientRect();
    dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
    e.preventDefault();
}

let resizing = null;

/** Begin resizing a window from the corner handle. */
function startResize(e, id) {
    e.stopPropagation();
    resizing = id;
    focusWin(id);
    e.preventDefault();
}

document.addEventListener('mousemove', e => {
    if (dragging && wins[dragging]) {
        const el = wins[dragging].el;
        const maxY = window.innerHeight - 52 - 36;
        el.style.left = Math.max(-el.offsetWidth + 60, e.clientX - dragOff.x) + 'px';
        el.style.top = Math.min(Math.max(e.clientY - dragOff.y, 0), maxY) + 'px';
    }
    if (resizing && wins[resizing]) {
        const el = wins[resizing].el;
        const r = el.getBoundingClientRect();
        el.style.width = Math.max(300, e.clientX - r.left) + 'px';
        el.style.height = Math.max(180, e.clientY - r.top) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    dragging = null;
    resizing = null;
});

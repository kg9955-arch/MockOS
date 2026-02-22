/**
 * MockOS — Taskbar & Start Menu
 * =============================
 * Clock ticker, start menu open/close/nav/search, pinned/recent tiles.
 * @file taskbar.js
 */
'use strict';

/* ── Clock ── */
function tickClock() {
    const n = new Date();
    document.getElementById('taskbar-clock').innerHTML =
        n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        '<br><span style="font-size:10px">' + n.toLocaleDateString([], { month: 'short', day: 'numeric' }) + '</span>';
}
setInterval(tickClock, 1000);
tickClock();

/* ── Start Menu ── */
let startOpen = false;

function toggleStart(e) { e.stopPropagation(); startOpen ? closeStart() : openStart(); }

function openStart() {
    startOpen = true;
    const m = document.getElementById('start-menu');
    m.style.display = 'flex'; m.className = 'open';
    document.getElementById('start-btn').classList.add('active');
    buildStartMenu();
    document.getElementById('sm-search').value = '';
    smNav(document.querySelector('.sm-side-btn'), 'home');
}

function closeStart() {
    if (!startOpen) return;
    startOpen = false;
    const m = document.getElementById('start-menu');
    m.style.animation = 'menuOut 0.16s ease forwards';
    document.getElementById('start-btn').classList.remove('active');
    setTimeout(() => { m.style.display = 'none'; m.style.animation = ''; }, 180);
}

document.addEventListener('click', e => {
    if (startOpen && !document.getElementById('start-menu').contains(e.target) && !document.getElementById('start-btn').contains(e.target))
        closeStart();
});

function smNav(el, sec) {
    document.querySelectorAll('.sm-side-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sm-section').forEach(s => s.classList.remove('visible'));
    el?.classList.add('active');
    document.getElementById('sms-' + sec)?.classList.add('visible');
}

function smSearch(q) {
    if (!q.trim()) { smNav(document.querySelector('.sm-side-btn'), 'home'); return; }
    document.querySelectorAll('.sm-section').forEach(s => s.classList.remove('visible'));
    document.getElementById('sms-search').classList.add('visible');
    const apps = Object.values(getAllApps());
    const res = apps.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
    const grid = document.getElementById('sm-search-grid');
    const empty = document.getElementById('sm-search-empty');
    grid.innerHTML = '';
    if (!res.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    res.forEach(a => grid.appendChild(makeSmTile(a)));
}

function buildStartMenu() {
    const apps = Object.values(getAllApps());

    // Pinned
    const pg = document.getElementById('sm-pinned-grid'); pg.innerHTML = '';
    apps.filter(a => a.pinned).forEach(a => {
        const t = document.createElement('div'); t.className = 'sm-pinned-tile';
        t.innerHTML = `<div class="pt-icon" style="background:${a.color}">${a.icon}</div><div class="pt-label">${a.name}</div>`;
        t.onclick = () => { openApp(a.id); closeStart(); };
        t.oncontextmenu = e => appCtx(e, a);
        pg.appendChild(t);
    });

    // All apps
    const ag = document.getElementById('sm-all-grid'); ag.innerHTML = '';
    apps.forEach(a => ag.appendChild(makeSmTile(a)));

    // Recent (short + full)
    const rs = document.getElementById('sm-recent-short'); rs.innerHTML = '';
    const rf = document.getElementById('sm-recent-full'); rf.innerHTML = '';
    const shown = recentApps.slice(-6).reverse();
    if (!shown.length) {
        rs.innerHTML = '<div style="color:var(--text-muted);font-size:12px">No recent activity.</div>';
        rf.innerHTML = '<div style="color:var(--text-muted);font-size:12px">No recent activity.</div>';
    } else {
        shown.forEach(r => {
            const a = getAllApps()[r.id]; if (!a) return;
            const makeItem = () => {
                const el = document.createElement('div'); el.className = 'sm-recent-item';
                el.innerHTML = `<div class="ri-icon">${a.icon}</div><div><div class="ri-name">${a.name}</div><div class="ri-time">${r.time}</div></div>`;
                el.onclick = () => { openApp(a.id); closeStart(); };
                return el;
            };
            rs.appendChild(makeItem()); rf.appendChild(makeItem());
        });
    }
}

function makeSmTile(app) {
    const t = document.createElement('div'); t.className = 'sm-app-tile';
    t.innerHTML = `<div class="at-icon" style="background:${app.color}">${app.icon}</div><div class="at-label">${app.name}</div>`;
    t.onclick = () => { openApp(app.id); closeStart(); };
    t.oncontextmenu = e => appCtx(e, app);
    return t;
}

function appCtx(e, app) {
    e.preventDefault(); e.stopPropagation();
    showCtx(e, [
        { icon: app.icon, label: 'Open ' + app.name, fn: () => openApp(app.id) },
        { icon: '📌', label: app.pinned ? 'Unpin from Start' : 'Pin to Start', fn: () => { app.pinned = !app.pinned; buildDesktopIcons(); buildStartMenu(); } },
        ...(!app.sys ? ['---', { icon: '🗑️', label: 'Uninstall', cls: 'danger', fn: () => { delete userApps[app.id]; buildDesktopIcons(); notify('App Removed', app.name + ' uninstalled.'); } }] : [])
    ]);
}

/**
 * MockOS — Settings App
 * =====================
 * The Settings window: appearance, wallpaper, themes, fonts, effects,
 * style import, file open, taskbar config, account, and about.
 * @file settings.js
 */
'use strict';

function openSettings(tab) {
    const id = 'settings';
    if (wins[id]) { focusWin(id); if (tab) setTimeout(() => sappNav(document.querySelector(`.sapp-nav[data-s="${tab}"]`), tab), 50); return; }

    createWindow(id, '⚙️  Settings', 720, 560, 80, 45, wb => {
        wb.style.cssText = 'padding:0;overflow:hidden';
        wb.innerHTML = `
<div class="sapp">
<div class="sapp-sidebar">
  <div class="sapp-group">Personalization</div>
  <div class="sapp-nav active" data-s="appearance" onclick="sappNav(this,'appearance')">🎨 Appearance</div>
  <div class="sapp-nav" data-s="wallpaper" onclick="sappNav(this,'wallpaper')">🖼 Wallpaper</div>
  <div class="sapp-nav" data-s="themes" onclick="sappNav(this,'themes')">🌗 Themes</div>
  <div class="sapp-nav" data-s="fonts" onclick="sappNav(this,'fonts')">🔤 Fonts & Scale</div>
  <div class="sapp-nav" data-s="effects" onclick="sappNav(this,'effects')">✨ Effects</div>
  <div class="sapp-group">Import & Files</div>
  <div class="sapp-nav" data-s="styleimport" onclick="sappNav(this,'styleimport')">📥 Style Import</div>
  <div class="sapp-nav" data-s="fileopen" onclick="sappNav(this,'fileopen')">📂 Open File</div>
  <div class="sapp-group">System</div>
  <div class="sapp-nav" data-s="taskbarsec" onclick="sappNav(this,'taskbarsec')">📋 Taskbar</div>
  <div class="sapp-nav" data-s="account" onclick="sappNav(this,'account')">👤 Account</div>
  <div class="sapp-nav" data-s="about" onclick="sappNav(this,'about')">ℹ️ About</div>
</div>
<div class="sapp-content">

<!-- APPEARANCE -->
<div class="sapp-sec visible" id="sapp-appearance">
  <h2>Appearance</h2>
  <h3>Accent Color</h3>
  <div class="color-grid" id="accent-grid"></div>
  <div class="srow"><div><div class="slabel">Custom accent</div></div><input type="color" value="#7c6af7" oninput="setVar('--accent',this.value);setVar('--accent-rgb',h2r(this.value))"></div>
  <div class="srow"><div><div class="slabel">Secondary accent</div></div><input type="color" value="#f76a8a" oninput="setVar('--accent2',this.value)"></div>
  <h3>Window Colors</h3>
  <div class="srow"><div><div class="slabel">Desktop background</div></div><input type="color" value="#0e0e12" oninput="setVar('--bg',this.value);document.getElementById('desktop').style.background=this.value"></div>
  <div class="srow"><div><div class="slabel">Window surface</div></div><input type="color" value="#16161e" oninput="setVar('--surface',this.value)"></div>
  <div class="srow"><div><div class="slabel">Surface 2</div></div><input type="color" value="#1e1e2a" oninput="setVar('--surface2',this.value)"></div>
  <div class="srow"><div><div class="slabel">Border</div></div><input type="color" value="#2a2a3a" oninput="setVar('--border',this.value)"></div>
  <div class="srow"><div><div class="slabel">Text</div></div><input type="color" value="#e2e2f0" oninput="setVar('--text',this.value)"></div>
  <div class="srow"><div><div class="slabel">Muted text</div></div><input type="color" value="#7a7a9a" oninput="setVar('--text-muted',this.value)"></div>
</div>

<!-- WALLPAPER -->
<div class="sapp-sec" id="sapp-wallpaper">
  <h2>Wallpaper</h2>
  <div class="wp-grid" id="wp-grid"></div>
  <div class="file-drop" onclick="document.getElementById('fi-wp').click()">📷 Upload image &nbsp;·&nbsp; <small>PNG · JPG · GIF · SVG · WebP</small></div>
  <h3>Custom CSS Background</h3>
  <textarea class="code-input" id="bg-css-inp" style="min-height:60px;flex:none" placeholder="linear-gradient(135deg,#0d1117,#161b22)"></textarea>
  <div style="display:flex;gap:8px;margin-top:8px">
    <button class="btn btn-primary" onclick="applyBgCss(document.getElementById('bg-css-inp').value)">Apply</button>
    <button class="btn btn-secondary" onclick="document.getElementById('desktop-bg').style.background='var(--desktop-overlay, none)'">Reset</button>
  </div>
</div>

<!-- THEMES -->
<div class="sapp-sec" id="sapp-themes">
  <h2>Themes</h2>
  <div id="theme-list"></div>
  <h3>Save Current as Theme</h3>
  <div style="display:flex;gap:8px">
    <input type="text" class="os-input" id="theme-name-inp" placeholder="Theme name...">
    <button class="btn btn-primary" onclick="saveTheme()">Save</button>
  </div>
</div>

<!-- FONTS -->
<div class="sapp-sec" id="sapp-fonts">
  <h2>Fonts & Scale</h2>
  <h3>UI Font</h3>
  <div id="font-list"></div>
  <h3>Sizing</h3>
  <div class="srow">
    <div><div class="slabel">Font size</div></div>
    <div style="display:flex;align-items:center;gap:8px">
      <input type="range" min="80" max="130" value="100" style="width:130px" oninput="document.documentElement.style.fontSize=(this.value/100)+'rem';this.nextElementSibling.textContent=this.value+'%'">
      <span style="font-size:10px;color:var(--text-muted);width:34px">100%</span>
    </div>
  </div>
  <div class="srow">
    <div><div class="slabel">Border radius</div></div>
    <div style="display:flex;align-items:center;gap:8px">
      <input type="range" min="0" max="28" value="10" style="width:130px" oninput="setVar('--radius',this.value+'px');setVar('--win-radius',(+this.value+2)+'px');this.nextElementSibling.textContent=this.value+'px'">
      <span style="font-size:10px;color:var(--text-muted);width:34px">10px</span>
    </div>
  </div>
  <div class="srow">
    <div><div class="slabel">Taskbar height</div></div>
    <div style="display:flex;align-items:center;gap:8px">
      <input type="range" min="40" max="72" value="52" style="width:130px" oninput="setVar('--taskbar-h',this.value+'px');this.nextElementSibling.textContent=this.value+'px'">
      <span style="font-size:10px;color:var(--text-muted);width:34px">52px</span>
    </div>
  </div>
</div>

<!-- EFFECTS -->
<div class="sapp-sec" id="sapp-effects">
  <h2>Effects</h2>
  <div class="srow"><div><div class="slabel">Desktop grid overlay</div></div><div class="toggle on" onclick="toggleDesktopGrid(this)"></div></div>
  <div class="srow"><div><div class="slabel">Taskbar blur</div></div><div class="toggle on" onclick="this.classList.toggle('on');document.getElementById('taskbar').style.backdropFilter=this.classList.contains('on')?'blur(24px)':'none'"></div></div>
  <div class="srow"><div><div class="slabel">Window glow</div></div><div class="toggle on" onclick="this.classList.toggle('on');setGlow(this.classList.contains('on'))"></div></div>
  <div class="srow"><div><div class="slabel">Desktop gradient overlay</div></div><div class="toggle on" onclick="this.classList.toggle('on');document.getElementById('desktop-bg').style.opacity=this.classList.contains('on')?'1':'0'"></div></div>
  <div class="srow"><div><div class="slabel">Taskbar position</div></div><select class="os-input" style="width:120px" onchange="setTbPos(this.value)"><option value="bottom">Bottom</option><option value="top">Top</option></select></div>
  <div class="srow">
    <div><div class="slabel">Taskbar opacity</div></div>
    <div style="display:flex;align-items:center;gap:8px">
      <input type="range" min="20" max="100" value="88" style="width:130px" oninput="document.getElementById('taskbar').style.background='rgba(22,22,30,'+(this.value/100)+')';this.nextElementSibling.textContent=this.value+'%'">
      <span style="font-size:10px;color:var(--text-muted);width:34px">88%</span>
    </div>
  </div>
  <div class="srow">
    <div><div class="slabel">Desktop blur</div></div>
    <div style="display:flex;align-items:center;gap:8px">
      <input type="range" min="0" max="24" value="0" style="width:130px" oninput="document.getElementById('desktop-bg').style.backdropFilter='blur('+this.value+'px)';this.nextElementSibling.textContent=this.value+'px'">
      <span style="font-size:10px;color:var(--text-muted);width:34px">0px</span>
    </div>
  </div>
</div>

<!-- STYLE IMPORT -->
<div class="sapp-sec" id="sapp-styleimport">
  <h2>Style Import</h2>
  <p style="font-size:12px;color:var(--text-muted);line-height:1.65;margin-bottom:14px">Import a <strong>.css</strong> file or an <strong>.html</strong> file with <code style="font-family:var(--font-mono);font-size:11px;background:var(--bg);padding:1px 6px;border-radius:4px">&lt;style&gt;</code> tags to restyle MockOS instantly.</p>
  <div class="file-drop" onclick="document.getElementById('fi-style').click()">📥 Import .css or .html file<br><small>CSS variables, selectors, animations — all applied to the OS</small></div>
  <h3>Or Paste CSS Directly</h3>
  <textarea class="code-input" id="paste-css" style="min-height:110px;flex:none" placeholder=":root { --accent: #ff6b6b; --bg: #1a0a0a; }&#10;&#10;.window { border-radius: 0 !important; }&#10;.window-titlebar { border-bottom: 2px solid var(--accent) !important; }"></textarea>
  <div style="display:flex;gap:8px;margin-top:8px">
    <button class="btn btn-primary" onclick="applyCSSPaste()">✅ Apply CSS</button>
    <button class="btn btn-secondary" onclick="removeImported()">🗑 Remove Imported</button>
  </div>
  <div class="import-log" id="style-log" style="display:none"></div>
</div>

<!-- FILE OPEN -->
<div class="sapp-sec" id="sapp-fileopen">
  <h2>Open File</h2>
  <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin-bottom:14px">Open any local file as a window — HTML apps, images, text, code.</p>
  <div class="file-drop" onclick="document.getElementById('fi-open').click()" style="padding:30px">📂 Click to browse files<br><small>HTML · Images · Text · JSON · Code</small></div>
  <div id="fileopen-preview" style="display:none;margin-top:14px">
    <div id="fo-name" style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:6px"></div>
    <div id="fo-content" style="background:var(--bg);border-radius:8px;padding:10px;font-family:var(--font-mono);font-size:11px;color:var(--text);max-height:130px;overflow:auto;border:1px solid var(--border);white-space:pre-wrap;word-break:break-all"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="launchOpenedFile()">🚀 Open as Window</button>
  </div>
</div>

<!-- TASKBAR -->
<div class="sapp-sec" id="sapp-taskbarsec">
  <h2>Taskbar</h2>
  <div class="srow"><div><div class="slabel">Clock visibility</div></div><div class="toggle on" onclick="this.classList.toggle('on');document.getElementById('taskbar-clock').style.display=this.classList.contains('on')?'':'none'"></div></div>
  <div class="srow"><div><div class="slabel">System tray icons</div></div><div class="toggle on" onclick="this.classList.toggle('on');document.querySelectorAll('.sys-icon').forEach(e=>e.style.display=this.classList.contains('on')?'':'none')"></div></div>
  <h3>Pinned Apps</h3>
  <div id="pinned-manage"></div>
</div>

<!-- ACCOUNT -->
<div class="sapp-sec" id="sapp-account">
  <h2>Account</h2>
  <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--surface2);border-radius:10px;border:1px solid var(--border);margin-bottom:16px">
    <div id="acc-avi" style="width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:30px">👤</div>
    <div><div style="font-size:16px;font-weight:800" id="acc-name-disp">User</div><div style="font-size:11px;color:var(--text-muted)" class="acc-os-sub">MockOS Local Account</div></div>
  </div>
  <div class="srow">
    <div><div class="slabel">Display name</div></div>
    <div style="display:flex;gap:6px"><input type="text" class="os-input" id="acc-name-inp" value="User" style="width:150px"><button class="btn btn-primary" onclick="setUsername(document.getElementById('acc-name-inp').value)">Save</button></div>
  </div>
  <div class="srow">
    <div><div class="slabel">OS Name</div><div class="sdesc">Shown in taskbar, title & notifications</div></div>
    <div style="display:flex;gap:6px"><input type="text" class="os-input" id="os-name-inp" value="MockOS" style="width:150px" maxlength="24" placeholder="MockOS"><button class="btn btn-primary" onclick="setOsName(document.getElementById('os-name-inp').value)">Rename</button></div>
  </div>
  <div class="srow">
    <div><div class="slabel">Avatar emoji</div></div>
    <div style="display:flex;gap:6px"><input type="text" class="os-input" id="acc-emoji-inp" placeholder="👤" style="width:80px;text-align:center;font-size:20px" maxlength="2"><button class="btn btn-primary" onclick="setAvatar(document.getElementById('acc-emoji-inp').value)">Set</button></div>
  </div>
</div>

<!-- ABOUT -->
<div class="sapp-sec" id="sapp-about">
  <h2 id="about-h2">About MockOS</h2>
  <div style="padding:20px;background:var(--surface2);border-radius:12px;border:1px solid var(--border);margin-bottom:16px;text-align:center">
    <div style="font-size:52px;margin-bottom:10px">◈</div>
    <div style="font-size:24px;font-weight:800" id="about-os-name">MockOS</div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:6px">Version 2.0 · Modular edition</div>
  </div>
  <div class="srow"><div class="slabel">Build</div><span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted)">mock-2025.02</span></div>
  <div class="srow"><div class="slabel">Renderer</div><span style="font-size:12px;color:var(--text-muted)">Web Browser</span></div>
  <div class="srow"><div class="slabel">Open windows</div><span id="about-wins" style="font-size:12px;color:var(--text-muted)">0</span></div>
  <div class="srow"><div class="slabel">Installed apps</div><span id="about-apps" style="font-size:12px;color:var(--text-muted)">0</span></div>
  <h3>About</h3>
  <p style="font-size:12px;color:var(--text-muted);line-height:1.7">No frameworks. No bundler. No dependencies. Just a browser and a dream.</p>
  <h3 style="margin-top:16px">Saved State</h3>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
    <div><div class="slabel">Cookie persistence</div><div class="sdesc">Your theme, name & settings auto-save to cookies</div></div>
    <span style="font-size:11px;color:#44d7a8;font-family:var(--font-mono)">● active</span>
  </div>
  <div style="margin-top:12px">
    <button class="btn btn-secondary" style="width:100%;border-color:#ff5f57;color:#ff5f57" onclick="clearSavedState()">🗑 Clear Saved State</button>
  </div>
</div>

</div>
</div>`;
        initSettings();
        if (tab) setTimeout(() => { const n = document.querySelector(`.sapp-nav[data-s="${tab}"]`); if (n) sappNav(n, tab); }, 60);
    });
}

function sappNav(el, sec) {
    if (!el) return;
    document.querySelectorAll('.sapp-nav').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.sapp-sec').forEach(s => s.classList.remove('visible'));
    el.classList.add('active');
    document.getElementById('sapp-' + sec)?.classList.add('visible');
    if (sec === 'about') { document.getElementById('about-wins').textContent = Object.keys(wins).length; document.getElementById('about-apps').textContent = Object.keys(getAllApps()).length; }
    if (sec === 'taskbarsec') buildPinnedManage();
}

/* ── Themes ── */

let customThemes = [];
const builtinThemes = [
    { name: 'MockOS Dark', desc: 'Default', vars: { '--bg': '#0e0e12', '--surface': '#16161e', '--surface2': '#1e1e2a', '--border': '#2a2a3a', '--accent': '#7c6af7', '--accent2': '#f76a8a', '--text': '#e2e2f0', '--text-muted': '#7a7a9a' }, p: ['#0e0e12', '#7c6af7', '#f76a8a'] },
    { name: 'Ocean', desc: 'Cool blues', vars: { '--bg': '#0a1628', '--surface': '#0d1f3c', '--surface2': '#1a3a5c', '--border': '#1e4a7a', '--accent': '#54a0ff', '--accent2': '#6af7e0', '--text': '#e0f0ff', '--text-muted': '#5a8aaa' }, p: ['#0a1628', '#54a0ff', '#6af7e0'] },
    { name: 'Ember', desc: 'Warm reds', vars: { '--bg': '#1a0a0a', '--surface': '#2a1010', '--surface2': '#3a1a10', '--border': '#4a2520', '--accent': '#ff6b4a', '--accent2': '#ffd56b', '--text': '#fff0e0', '--text-muted': '#9a6a4a' }, p: ['#1a0a0a', '#ff6b4a', '#ffd56b'] },
    { name: 'Forest', desc: 'Deep greens', vars: { '--bg': '#0a1a0a', '--surface': '#102010', '--surface2': '#183018', '--border': '#204020', '--accent': '#44d7a8', '--accent2': '#a8ff6b', '--text': '#e0ffe0', '--text-muted': '#5a8a5a' }, p: ['#0a1a0a', '#44d7a8', '#a8ff6b'] },
    { name: 'Light', desc: 'Clean white', vars: { '--bg': '#f4f4f8', '--surface': '#ffffff', '--surface2': '#eaeaf0', '--border': '#d0d0e0', '--accent': '#5a4af0', '--accent2': '#f04a8a', '--text': '#1a1a2a', '--text-muted': '#6a6a8a' }, p: ['#f4f4f8', '#5a4af0', '#f04a8a'] },
    { name: 'Cyberpunk', desc: 'Neon yellow', vars: { '--bg': '#0d0d0d', '--surface': '#111118', '--surface2': '#1a1a22', '--border': '#2a2a10', '--accent': '#f0e010', '--accent2': '#f010a0', '--text': '#e8e8a0', '--text-muted': '#6a6a40' }, p: ['#0d0d0d', '#f0e010', '#f010a0'] },
];

function renderThemes() {
    const c = document.getElementById('theme-list'); if (!c) return;
    c.innerHTML = '';
    [...builtinThemes, ...customThemes].forEach(t => {
        const card = document.createElement('div'); card.className = 'theme-card';
        card.innerHTML = `<div class="theme-preview">${(t.p || ['#111', '#7c6af7', '#f76a8a']).map(c => `<div style="flex:1;background:${c}"></div>`).join('')}</div><div style="font-size:12px;font-weight:700">${t.name}</div><div style="font-size:10px;color:var(--text-muted)">${t.desc}</div>`;
        card.onclick = () => {
            document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected');
            Object.entries(t.vars).forEach(([k, v]) => setVar(k, v));
            if (t.vars['--accent']) setVar('--accent-rgb', h2r(t.vars['--accent']));
            notify('Themes', t.name + ' applied!');
        };
        c.appendChild(card);
    });
}

function saveTheme() {
    const name = document.getElementById('theme-name-inp')?.value.trim();
    if (!name) { notify('Themes', 'Enter a name!', '#ff5f57'); return; }
    const props = ['--bg', '--surface', '--surface2', '--border', '--accent', '--accent2', '--text', '--text-muted'];
    const vars = {}; props.forEach(p => { vars[p] = getComputedStyle(document.documentElement).getPropertyValue(p).trim(); });
    customThemes.push({ name, desc: 'Custom', vars, p: [vars['--bg'], vars['--accent'], vars['--accent2']] });
    renderThemes(); notify('Themes', '"' + name + '" saved!');
}

function initSettings() {
    // Accent swatches
    const ag = document.getElementById('accent-grid'); if (!ag) return;
    ['#7c6af7', '#f76a8a', '#6af7c4', '#f7c46a', '#6aa8f7', '#f76af7', '#ff5f57', '#44d7a8', '#ff9f43', '#54a0ff', '#2ed573', '#eccc68'].forEach(c => {
        const d = document.createElement('div'); d.className = 'cswatch' + (c === '#7c6af7' ? ' selected' : ''); d.style.background = c;
        d.onclick = () => { document.querySelectorAll('.cswatch').forEach(s => s.classList.remove('selected')); d.classList.add('selected'); setVar('--accent', c); setVar('--accent-rgb', h2r(c)); notify('Accent', c + ' applied!'); };
        ag.appendChild(d);
    });

    // Wallpaper presets
    const wg = document.getElementById('wp-grid');
    if (wg) {
        [['#0e0e12', 'Void'], ['linear-gradient(135deg,#0e0e12,#1a0838)', 'Deep Purple'], ['linear-gradient(135deg,#0d1117,#161b22)', 'GitHub Dark'], ['linear-gradient(135deg,#0f2027,#203a43,#2c5364)', 'Ocean'], ['linear-gradient(135deg,#1a0a0a,#2a1a0a)', 'Ember'], ['linear-gradient(135deg,#0a1a0a,#0a2a1a)', 'Forest'], ['linear-gradient(135deg,#f0f4f8,#dfe6ed)', 'Light'], ['radial-gradient(ellipse at top,#1a1a4e,#0a0a1a)', 'Nebula'], ['repeating-linear-gradient(45deg,#111 0,#111 10px,#0a0a0a 10px,#0a0a0a 20px)', 'Stripes']].forEach(([bg, l], i) => {
            const d = document.createElement('div'); d.className = 'wp-opt' + (i === 0 ? ' selected' : ''); d.style.background = bg; d.title = l;
            d.onclick = () => { document.querySelectorAll('.wp-opt').forEach(e => e.classList.remove('selected')); d.classList.add('selected'); applyBgCss(bg); };
            wg.appendChild(d);
        });
    }

    renderThemes();

    // Fonts
    const fl = document.getElementById('font-list');
    if (fl) {
        [["Syne", "'Syne',sans-serif"], ["JetBrains Mono", "'JetBrains Mono',monospace"], ["Space Grotesk", "'Space Grotesk',sans-serif"], ["Playfair Display", "'Playfair Display',serif"], ["IBM Plex Sans", "'IBM Plex Sans',sans-serif"], ["Georgia", "Georgia,serif"], ["Courier New", "'Courier New',monospace"], ["Impact", "Impact,sans-serif"]].forEach(([n, v]) => {
            const d = document.createElement('div'); d.className = 'font-opt' + (n === 'Syne' ? ' selected' : '');
            d.innerHTML = `<span style="font-size:13px;font-weight:600">${n}</span><span style="font-family:${v};font-size:18px;color:var(--text-muted)">Aa</span>`;
            d.onclick = () => { document.querySelectorAll('.font-opt').forEach(e => e.classList.remove('selected')); d.classList.add('selected'); setVar('--font-ui', v); notify('Font', 'Changed to ' + n); };
            fl.appendChild(d);
        });
    }
}

function buildPinnedManage() {
    const el = document.getElementById('pinned-manage'); if (!el) return;
    el.innerHTML = '';
    Object.values(getAllApps()).filter(a => a.pinned).forEach(app => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);margin-bottom:6px';
        row.innerHTML = `<span style="font-size:18px">${app.icon}</span><span style="flex:1;font-size:12px;font-weight:600">${app.name}</span><button class="btn btn-danger" style="padding:4px 10px;font-size:11px">Unpin</button>`;
        row.querySelector('button').onclick = () => { app.pinned = false; buildDesktopIcons(); buildPinnedManage(); notify('Taskbar', app.name + ' unpinned.'); };
        el.appendChild(row);
    });
    if (!el.children.length) el.innerHTML = '<div style="color:var(--text-muted);font-size:12px">No pinned apps.</div>';
}

/* ── Settings helpers ── */

function applyBgCss(bg) { document.getElementById('desktop-bg').style.background = bg; notify('Wallpaper', 'Background updated!'); }
function toggleDesktopGrid(el) { el.classList.toggle('on'); document.getElementById('desktop-grid').style.display = el.classList.contains('on') ? '' : 'none'; }
function setGlow(on) { let s = document.getElementById('glow-ov'); if (!s) { s = document.createElement('style'); s.id = 'glow-ov'; document.head.appendChild(s); } s.textContent = on ? '' : '.window.focused{box-shadow:0 28px 100px rgba(0,0,0,0.7)!important}'; }
function setTbPos(pos) { const tb = document.getElementById('taskbar'), d = document.getElementById('desktop'); if (pos === 'top') { tb.style.top = '0'; tb.style.bottom = 'auto'; d.style.top = 'var(--taskbar-h)'; d.style.bottom = '0'; } else { tb.style.bottom = '0'; tb.style.top = 'auto'; d.style.top = '0'; d.style.bottom = ''; } }
function setUsername(n) { if (!n.trim()) return; document.getElementById('sm-username').textContent = n; const x = document.getElementById('acc-name-disp'); if (x) x.textContent = n; notify('Account', 'Name set to ' + n); }
function setAvatar(em) { if (!em.trim()) return; document.getElementById('sm-avatar').textContent = em; const x = document.getElementById('acc-avi'); if (x) x.textContent = em; notify('Account', 'Avatar updated!'); }

let osName = 'MockOS';
function setOsName(n) {
    n = (n || '').trim(); if (!n) return;
    osName = n;
    document.title = n;
    const ah = document.getElementById('about-h2'); if (ah) ah.textContent = 'About ' + n;
    const an = document.getElementById('about-os-name'); if (an) an.textContent = n;
    const sub = document.querySelector('#start-menu .sm-os-label'); if (sub) sub.textContent = n + ' Local Account';
    const ac = document.querySelector('#sapp-account .acc-os-sub'); if (ac) ac.textContent = n + ' Local Account';
    const sb = document.getElementById('start-btn'); if (sb) sb.title = n;
    notify(n, 'OS renamed to "' + n + '"!');
}

/* ── Style Import ── */

let importedStyle = null;

document.getElementById('fi-style').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => processStyle(ev.target.result, f.name);
    r.readAsText(f);
    e.target.value = '';
});

function processStyle(content, name) {
    let css = '';
    if (name.endsWith('.css')) css = content;
    else { const m = [...content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]; css = m.map(x => x[1]).join('\n'); }
    if (!css.trim()) { logStyle('err', 'No CSS found in ' + name); return; }
    applyCSS(css, name);
}

function applyCSS(css, src) {
    if (importedStyle) importedStyle.remove();
    importedStyle = document.createElement('style');
    importedStyle.id = 'imported-style';
    importedStyle.textContent = css;
    document.head.appendChild(importedStyle);
    logStyle('ok', 'Applied "' + src + '" (' + css.length + ' chars)');
    notify('Style Import', 'Styles from "' + src + '" applied!');
}

function applyCSSPaste() {
    const css = document.getElementById('paste-css')?.value || '';
    if (!css.trim()) { notify('Style Import', 'Paste some CSS first.', '#ff5f57'); return; }
    applyCSS(css, 'pasted CSS');
}

function removeImported() {
    if (importedStyle) { importedStyle.remove(); importedStyle = null; }
    logStyle('info', 'Removed imported styles');
    notify('Style Import', 'Custom styles removed.');
}

function logStyle(type, msg) {
    const log = document.getElementById('style-log'); if (!log) return;
    log.style.display = 'block';
    const line = document.createElement('div'); line.className = 'log-' + type;
    line.textContent = { ok: '✅', err: '❌', info: 'ℹ️' }[type] + ' ' + msg;
    log.appendChild(line); log.scrollTop = 9999;
}

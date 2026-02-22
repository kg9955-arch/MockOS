/**
 * MockOS — App Builder
 * ====================
 * Build, preview, launch, and install custom HTML/CSS/JS apps
 * directly within MockOS using the built-in code editor.
 * @file app-builder.js
 */
'use strict';

let appCounter = 0;

/** Starter template for new apps. */
const STARTER = `<!DOCTYPE html>
<html>
<head><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0d1117;color:#e6edf3;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px}
h1{font-size:2.4rem}p{color:#8b949e;font-size:14px}
button{background:#238636;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer}
button:hover{background:#2ea043}
</style></head>
<body>
  <h1>👋 Hello, MockOS!</h1>
  <p>Edit this code in App Builder to make your own app.</p>
  <button onclick="this.textContent='✅ Clicked!'">Click me</button>
</body></html>`;

function openAppBuilder() {
    const id = 'app-builder';
    if (wins[id]) { focusWin(id); return; }
    createWindow(id, '🚀 App Builder', 620, 570, 130, 45, wb => {
        wb.style.padding = '0';
        wb.innerHTML = `
<div class="ab-body">
  <div class="ab-tabs">
    <div class="ab-tab active" onclick="abTab(this,'code')">✏️ Code</div>
    <div class="ab-tab" onclick="abTab(this,'preview')">👁 Preview</div>
    <div class="ab-tab" onclick="abTab(this,'install')">📦 Install</div>
  </div>
  <div class="ab-panel active" id="abp-code">
    <textarea class="code-input" id="ab-code" spellcheck="false">${STARTER.replace(/</g, '&lt;')}</textarea>
    <div class="ab-toolbar">
      <input type="text" class="os-input" id="ab-name" placeholder="App name..." style="flex:1">
      <button class="btn btn-secondary" onclick="abPreview()">Preview</button>
      <button class="btn btn-primary" onclick="abLaunch()">Launch 🚀</button>
    </div>
  </div>
  <div class="ab-panel" id="abp-preview">
    <div class="ab-preview-frame"><iframe id="ab-iframe" style="width:100%;height:100%;border:none"></iframe></div>
    <div class="ab-toolbar">
      <button class="btn btn-secondary" onclick="abTab(document.querySelector('.ab-tab'),'code')">← Edit</button>
      <button class="btn btn-primary" style="flex:1" onclick="abLaunch()">Launch as Window 🚀</button>
    </div>
  </div>
  <div class="ab-panel" id="abp-install">
    <div style="font-size:12px;color:var(--text-muted);line-height:1.65">Install this app permanently — it shows in the Start Menu and on the desktop.</div>
    <div class="ab-toolbar">
      <input type="text" class="os-input" id="ab-inst-name" placeholder="App name..." style="flex:1">
      <input type="text" class="os-input" id="ab-inst-icon" placeholder="📦" style="width:70px;text-align:center;font-size:20px" maxlength="2" value="📦">
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <label style="font-size:12px;color:var(--text-muted)">Icon color</label>
      <input type="color" id="ab-inst-color" value="#7c6af7">
    </div>
    <div style="display:flex;gap:8px;margin-top:auto">
      <button class="btn btn-primary" style="flex:1" onclick="abInstall()">📥 Install to OS</button>
      <button class="btn btn-secondary" onclick="abLaunch()">🚀 Just Launch</button>
    </div>
  </div>
</div>`;
        const ta = wb.querySelector('#ab-code');
        if (ta) ta.value = STARTER;
    });
}

function abTab(el, tab) {
    document.querySelectorAll('.ab-tab').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.ab-panel').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('abp-' + tab).classList.add('active');
    if (tab === 'preview') abPreview();
}

function abPreview() {
    const code = document.getElementById('ab-code')?.value || '';
    const iframe = document.getElementById('ab-iframe');
    if (iframe) iframe.srcdoc = code;
}

function abLaunch() {
    const code = document.getElementById('ab-code')?.value || '';
    const name = document.getElementById('ab-name')?.value.trim() || document.getElementById('ab-inst-name')?.value.trim() || 'App ' + (++appCounter);
    if (!code.trim()) { notify('App Builder', 'Write some code first!', '#ff5f57'); return; }
    const id = 'launched-' + Date.now();
    createWindow(id, '📦 ' + name, 730, 530, 210 + (appCounter % 5) * 20, 85 + (appCounter % 5) * 22, wb => {
        wb.style.cssText = 'padding:0;display:flex;flex-direction:column';
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%;flex:1;border:none;display:block';
        iframe.srcdoc = code;
        wb.appendChild(iframe);
        const sb = document.createElement('div'); sb.className = 'status-bar';
        sb.innerHTML = `<div class="status-dot"></div><span>${name}</span><span style="margin-left:auto">${new Date().toLocaleTimeString()}</span>`;
        wb.appendChild(sb);
    });
    notify('App Builder', '"' + name + '" launched!');
}

function abInstall() {
    const code = document.getElementById('ab-code')?.value || '';
    const name = document.getElementById('ab-inst-name')?.value.trim() || 'My App ' + (++appCounter);
    const icon = document.getElementById('ab-inst-icon')?.value.trim() || '📦';
    const color = document.getElementById('ab-inst-color')?.value || '#7c6af7';
    if (!code.trim()) { notify('App Builder', 'Write some code first!', '#ff5f57'); return; }
    const appId = 'usr-' + Date.now();
    const c = code;
    userApps[appId] = {
        id: appId, name, icon, color: `linear-gradient(135deg,${color},${color}88)`, pinned: true, sys: false,
        open: () => {
            const wid = appId + '-' + Date.now();
            createWindow(wid, icon + ' ' + name, 730, 520, 200, 90, wb => {
                wb.style.cssText = 'padding:0;display:flex;flex-direction:column';
                const iframe = document.createElement('iframe');
                iframe.style.cssText = 'width:100%;flex:1;border:none;display:block';
                iframe.srcdoc = c;
                wb.appendChild(iframe);
                const sb = document.createElement('div'); sb.className = 'status-bar';
                sb.innerHTML = `<div class="status-dot"></div><span>${name}</span><span style="margin-left:auto">${new Date().toLocaleTimeString()}</span>`;
                wb.appendChild(sb);
            });
        }
    };
    buildDesktopIcons();
    notify('App Builder', '"' + name + '" installed! 🎉', '#44d7a8');
}

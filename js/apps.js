/**
 * MockOS — System Apps
 * ====================
 * Built-in applications: Files, Terminal, Notepad, Calculator, Clock.
 * Also handles desktop icons and the file-open flow.
 * @file apps.js
 */
'use strict';

/* ── Desktop Icons ── */

function buildDesktopIcons() {
    const area = document.getElementById('desktop-icon-area'); area.innerHTML = '';
    Object.values(getAllApps()).filter(a => a.pinned).forEach(app => {
        const d = document.createElement('div'); d.className = 'desktop-icon';
        d.innerHTML = `<div class="icon-img" style="background:${app.color}">${app.icon}</div><span class="icon-label">${app.name}</span>`;
        d.ondblclick = () => openApp(app.id);
        d.oncontextmenu = e => showCtx(e, [
            { icon: app.icon, label: 'Open', fn: () => openApp(app.id) },
            { icon: '📌', label: 'Unpin from Desktop', fn: () => { app.pinned = false; buildDesktopIcons(); } },
        ]);
        area.appendChild(d);
    });
}

/* ── File Manager ── */

function openFileMgr() {
    const id = 'file-mgr'; if (wins[id]) { focusWin(id); return; }
    createWindow(id, '📁 Files', 560, 380, 130, 75, wb => {
        wb.innerHTML = `
<div style="padding:16px;height:100%;display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;align-items:center">
    <span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;flex:1">File Manager</span>
    <button class="btn btn-primary" onclick="document.getElementById('fi-open').click()">📂 Open File</button>
    <button class="btn btn-secondary" onclick="document.getElementById('fi-style').click()">🎨 Import Style</button>
  </div>
  <div style="flex:1;background:var(--bg);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:var(--text-muted);cursor:pointer" onclick="document.getElementById('fi-open').click()">
    <div style="font-size:48px">📁</div>
    <div style="font-weight:600">Click to browse files</div>
    <div style="font-size:11px">HTML · Images · Text · CSS · Any file</div>
  </div>
  <div style="font-size:11px;color:var(--text-muted);text-align:center">HTML files run in a sandboxed iframe · Images open in a viewer</div>
</div>`;
    });
}

/* ── Terminal ── */

function openTerminal() {
    const id = 'terminal'; if (wins[id]) { focusWin(id); return; }
    createWindow(id, '💻 Terminal', 580, 400, 200, 100, wb => {
        wb.style.cssText = 'padding:0;background:#0d1117;display:flex;flex-direction:column';
        wb.innerHTML = `
<div id="tout" style="flex:1;padding:14px;font-family:var(--font-mono);font-size:12px;color:#00ff41;overflow-y:auto;line-height:1.75;white-space:pre-wrap"></div>
<div style="display:flex;align-items:center;padding:6px 14px;border-top:1px solid #1a2030;background:#0a0f16">
  <span style="color:#00ff41;font-family:var(--font-mono);font-size:12px;margin-right:8px;flex-shrink:0">user@mockos:~$</span>
  <input type="text" id="tinp" style="flex:1;background:transparent;border:none;color:#00ff41;font-family:var(--font-mono);font-size:12px;outline:none;caret-color:#00ff41" placeholder="type a command...">
</div>`;
        const out = wb.querySelector('#tout'), inp = wb.querySelector('#tinp');
        const print = (m, c = '#00ff41') => { out.innerHTML += `<span style="color:${c}">${m}\n</span>`; out.scrollTop = 9999; };
        print('' + osName + ' Terminal v2.0\n', '#7c6af7');
        print('Type "help" for commands.\n', '#555');
        const cmds = {
            help: () => print('Available: help · clear · version · date · ls · whoami · neofetch · echo · apps', '#6af7c4'),
            clear: () => out.innerHTML = '',
            version: () => print(osName + ' 2.0.0 (build 2025.02)'),
            date: () => print(new Date().toString()),
            whoami: () => print(document.getElementById('sm-username').textContent),
            ls: () => print('apps/  sys/  usr/  home/\n' + Object.values(getAllApps()).map(a => a.id).join('  ')),
            apps: () => print(Object.values(getAllApps()).map(a => `${a.icon} ${a.name}`).join('\n')),
            neofetch: () => print(`
      ◈◈◈◈    OS: ${osName} 2.0
     ◈    ◈   Shell: mockssh 1.0
    ◈  ◈◈  ◈  Apps: ${Object.keys(getAllApps()).length} installed
    ◈  ◈◈  ◈  Windows: ${Object.keys(wins).length} open
     ◈    ◈   Font: var(--font-ui)
      ◈◈◈◈    Renderer: Browser`, '#7c6af7'),
        };
        inp.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            const raw = inp.value.trim(); inp.value = ''; if (!raw) return;
            print('user@mockos:~$ ' + raw, '#ffffff');
            const parts = raw.split(' '), cmd = parts[0].toLowerCase();
            if (cmd === 'echo') print(parts.slice(1).join(' '));
            else if (cmds[cmd]) cmds[cmd]();
            else print(`-bash: ${cmd}: command not found`, '#ff5f57');
        });
        setTimeout(() => inp.focus(), 100);
    });
}

/* ── Notepad ── */

function openNotepad() {
    const id = 'notepad-' + Date.now();
    createWindow(id, '📝 Notepad', 540, 420, 210, 80, wb => {
        wb.style.cssText = 'padding:0;display:flex;flex-direction:column';
        wb.innerHTML = `
<div style="display:flex;gap:4px;padding:8px;border-bottom:1px solid var(--border);background:var(--surface2);flex-wrap:wrap">
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px" onclick="document.execCommand('bold')"><b>B</b></button>
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px" onclick="document.execCommand('italic')"><i>I</i></button>
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px" onclick="document.execCommand('underline')"><u>U</u></button>
  <select class="os-input" style="width:90px;padding:3px 6px;font-size:11px" onchange="document.execCommand('fontSize',false,this.value)">
    <option value="2">Small</option><option value="3" selected>Normal</option><option value="5">Large</option><option value="7">Huge</option>
  </select>
  <input type="color" style="width:28px;height:28px;padding:1px;border-radius:4px;border:1px solid var(--border);cursor:pointer" oninput="document.execCommand('foreColor',false,this.value)">
  <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px;margin-left:auto" onclick="saveNoteHtml(this)">💾 Save</button>
</div>
<div contenteditable="true" style="flex:1;padding:16px;outline:none;font-size:14px;line-height:1.75;overflow-y:auto;color:var(--text)" id="np-area"></div>
<div class="status-bar" id="np-sb"><span id="np-wc">0 words</span><span style="margin-left:auto">${new Date().toLocaleTimeString()}</span></div>`;
        const area = wb.querySelector('#np-area'), wc = wb.querySelector('#np-wc');
        area.oninput = () => { wc.textContent = area.innerText.trim().split(/\s+/).filter(Boolean).length + ' words'; };
    });
}

function saveNoteHtml(btn) {
    const area = btn.closest('.window-body')?.querySelector('[contenteditable]'); if (!area) return;
    const blob = new Blob([area.innerHTML], { type: 'text/html' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'note.html'; a.click();
    notify('Notepad', 'Saved!');
}

/* ── Calculator ── */

function openCalculator() {
    const id = 'calculator'; if (wins[id]) { focusWin(id); return; }
    createWindow(id, '🧮 Calculator', 290, 420, 300, 90, wb => {
        wb.style.cssText = 'padding:0;background:var(--bg)';
        wb.innerHTML = `<div style="padding:12px;display:flex;flex-direction:column;gap:8px;height:100%">
<div id="cdisp" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-family:var(--font-mono);font-size:28px;color:var(--text);text-align:right;word-break:break-all;display:flex;align-items:center;justify-content:flex-end;min-height:70px">0</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;flex:1">
${['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '⌫', '='].map(k => {
            const isOp = ['÷', '×', '−', '+', '='].includes(k);
            return `<button onclick="calc('${k}')" style="border-radius:8px;border:1px solid var(--border);background:${k === 'C' ? '#ff5f57' : isOp ? 'var(--accent)' : 'var(--surface2)'};color:white;font-size:${isOp || k === 'C' ? '18' : '16'}px;font-family:var(--font-ui);font-weight:700;cursor:pointer;transition:filter .1s;line-height:1" onmousedown="this.style.filter='brightness(0.75)'" onmouseup="this.style.filter=''">` + k + `</button>`;
        }).join('')}
</div></div>`;
        let d = wb.querySelector('#cdisp'), cur = '0', op = null, prev = null, fresh = false;
        window.calc = k => {
            if (k === 'C') { cur = '0'; op = null; prev = null; fresh = false; }
            else if (k === '±') { cur = String(-parseFloat(cur) || 0); }
            else if (k === '%') { cur = String(parseFloat(cur) / 100); }
            else if (k === '⌫') { cur = cur.length > 1 ? cur.slice(0, -1) : '0'; }
            else if (['÷', '×', '−', '+'].includes(k)) { prev = parseFloat(cur); op = k; fresh = true; }
            else if (k === '=') {
                if (op && prev != null) { const b = parseFloat(cur); cur = String({ '÷': prev / b, '×': prev * b, '−': prev - b, '+': prev + b }[op]); op = null; prev = null; fresh = false; }
            } else {
                if (fresh || cur === '0') { cur = k === '.' ? '0.' : k; fresh = false; } else if (k === '.' && cur.includes('.')) { } else cur += k;
            }
            d.textContent = cur.length > 12 ? parseFloat(cur).toExponential(5) : cur;
        };
    });
}

/* ── Clock ── */

function openClock() {
    const id = 'clock'; if (wins[id]) { focusWin(id); return; }
    createWindow(id, '🕐 Clock', 300, 200, 410, 210, wb => {
        wb.style.cssText = 'display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px';
        wb.innerHTML = `<div id="ct" style="font-family:var(--font-mono);font-size:46px;font-weight:300;color:var(--text)"></div><div id="cd" style="font-size:13px;color:var(--text-muted)"></div>`;
        const tick = () => {
            const n = new Date(), te = wb.querySelector('#ct'), de = wb.querySelector('#cd');
            if (!te) return;
            te.textContent = n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            de.textContent = n.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        tick();
        const iv = setInterval(tick, 1000);
        const mo = new MutationObserver(() => { if (!document.getElementById('win-' + id)) clearInterval(iv); });
        mo.observe(document.getElementById('desktop'), { childList: true });
    });
}

/* ── File Open Handler ── */

let openedFile = { content: null, name: null, type: null };

document.getElementById('fi-open').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    openedFile.name = f.name; openedFile.type = f.type;
    const r = new FileReader();
    if (f.type.startsWith('image/')) {
        r.onload = ev => {
            openedFile.content = ev.target.result;
            const p = document.getElementById('fileopen-preview'); if (!p) return;
            p.style.display = 'block';
            document.getElementById('fo-name').textContent = '🖼 ' + f.name;
            document.getElementById('fo-content').innerHTML = `<img src="${openedFile.content}" style="max-width:100%;max-height:100px;border-radius:6px">`;
        };
        r.readAsDataURL(f);
    } else {
        r.onload = ev => {
            openedFile.content = ev.target.result;
            const p = document.getElementById('fileopen-preview'); if (!p) return;
            p.style.display = 'block';
            document.getElementById('fo-name').textContent = '📄 ' + f.name;
            document.getElementById('fo-content').textContent = String(openedFile.content).slice(0, 500) + (openedFile.content.length > 500 ? '\n...' : '');
        };
        r.readAsText(f);
    }
    notify('Files', f.name + ' ready to launch.');
    e.target.value = '';
});

document.getElementById('fi-wp').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { document.getElementById('desktop-bg').style.background = `url('${ev.target.result}') center/cover`; notify('Wallpaper', 'Custom image set!'); };
    r.readAsDataURL(f);
    e.target.value = '';
});

function launchOpenedFile() {
    if (!openedFile.content) return;
    const id = 'file-' + Date.now();
    const isImg = openedFile.type?.startsWith('image/');
    const isHtml = /\.html?$/i.test(openedFile.name) || openedFile.type?.includes('html');
    if (isImg) {
        createWindow(id, '🖼 ' + openedFile.name, 640, 480, 190, 100, wb => {
            wb.style.cssText = 'display:flex;align-items:center;justify-content:center;background:#000;padding:0';
            wb.innerHTML = `<img src="${openedFile.content}" style="max-width:100%;max-height:100%;object-fit:contain">`;
        });
    } else if (isHtml) {
        createWindow(id, '🌐 ' + openedFile.name, 740, 540, 170, 80, wb => {
            wb.style.padding = '0';
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:100%;height:100%;border:none';
            iframe.srcdoc = openedFile.content;
            wb.appendChild(iframe);
        });
    } else {
        createWindow(id, '📝 ' + openedFile.name, 660, 500, 180, 100, wb => {
            wb.style.padding = '0';
            wb.innerHTML = `<div style="padding:16px;font-family:var(--font-mono);font-size:12px;white-space:pre-wrap;word-break:break-all;color:var(--text);overflow:auto;height:100%">${String(openedFile.content).replace(/</g, '&lt;')}</div>`;
        });
    }
    notify('Files', openedFile.name + ' opened!');
}

# MockOS

A fully functional desktop operating system simulator that runs entirely in your web browser. Built with **zero dependencies** — just vanilla HTML, CSS, and JavaScript.

![MockOS v2.0](https://img.shields.io/badge/version-2.0-7c6af7) ![No Dependencies](https://img.shields.io/badge/dependencies-none-28c840) ![License: MIT](https://img.shields.io/badge/license-MIT-54a0ff)

## Features

### 🖥️ Desktop Environment
- **Window Manager** — Draggable, resizable, minimizable, maximizable floating windows with smooth animations
- **Taskbar** — Start button, running apps, system tray (network, sound), live clock
- **Start Menu** — Pinned apps, all apps grid, recent history, live search
- **Desktop Icons** — Double-click to launch, right-click for context menus
- **Context Menus** — Desktop and per-app right-click menus

### 📦 Built-in Apps
| App | Description |
|-----|-------------|
| ⚙️ **Settings** | Appearance, wallpaper, themes, fonts, effects, taskbar config, accounts |
| 🚀 **App Builder** | Write HTML/CSS/JS, live preview, launch as windows, install to OS |
| 📁 **Files** | Open local files — HTML runs in iframe, images in viewer, text in editor |
| 💻 **Terminal** | Mock terminal with commands: `help`, `neofetch`, `ls`, `whoami`, `echo`, etc. |
| 📝 **Notepad** | Rich text editor with bold, italic, underline, font sizes, color, and save |
| 🧮 **Calculator** | Full calculator with standard operations |
| 🕐 **Clock** | Live clock with date display |

### 🎨 Theming & Customization
- **6 built-in themes** — MockOS Dark, Ocean, Ember, Forest, Light, Cyberpunk
- **12 accent color presets** + custom color pickers for every UI element
- **9 wallpaper presets** + custom image upload + CSS background input
- **8 font options** including JetBrains Mono, Space Grotesk, Playfair Display
- **Effects** — Grid overlay, blur, glow, taskbar position/opacity
- **CSS Import** — Load `.css` files or paste raw CSS to completely restyle the OS

### 💾 State Persistence
All settings (theme, colors, wallpaper, username, avatar, custom themes) auto-save to cookies and restore on reload.

---

## Setup (WAMP)

1. Make sure [WAMP](https://www.wampserver.com/) is installed and running (green tray icon)
2. Place this project folder in `C:\wamp64\www\project\`
3. Open your browser and navigate to:
   ```
   http://localhost/project/
   ```
4. MockOS loads instantly — no build step needed

### Requirements
- Any modern browser (Chrome, Firefox, Edge, Safari)
- WAMP server (or any local web server / static file server)

---

## Project Structure

```
project/
├── index.html          ← HTML shell with semantic structure
├── css/
│   └── style.css       ← All visual styles (CSS custom properties)
├── js/
│   ├── ui-helpers.js   ← Notifications, context menus, CSS utilities
│   ├── window-manager.js ← Window create/focus/close/drag/resize
│   ├── app-registry.js ← System + user app definitions
│   ├── taskbar.js      ← Clock, start menu, search
│   ├── settings.js     ← Settings app + themes + style import
│   ├── apps.js         ← Files, Terminal, Notepad, Calculator, Clock
│   ├── app-builder.js  ← Build & install custom apps
│   ├── state.js        ← Cookie persistence (save/restore)
│   └── init.js         ← Boot sequence
├── .htaccess           ← WAMP Apache config (MIME types, caching)
├── README.md           ← This file
├── CHANGELOG.md        ← Version history
└── LICENSE             ← MIT License
```

---

## Customization Guide

### Themes
Open **Settings → Themes** to switch between built-in themes or save your current look as a custom theme.

### Custom Apps
1. Open **App Builder** (🚀 icon on desktop)
2. Write your HTML/CSS/JS in the code editor
3. Click **Preview** to test, **Launch** to run as a window
4. Use the **Install** tab to add it permanently to the OS

### CSS Import
You can completely restyle MockOS:
- **Settings → Style Import** — upload a `.css` file or paste CSS directly
- **Right-click desktop → Import Style** — quick access
- All CSS custom properties (colors, fonts, radii) can be overridden

### Key CSS Variables
```css
:root {
  --bg: #0e0e12;         /* Desktop background */
  --surface: #16161e;    /* Window background */
  --accent: #7c6af7;     /* Primary accent color */
  --accent2: #f76a8a;    /* Secondary accent */
  --text: #e2e2f0;       /* Text color */
  --font-ui: 'Syne';     /* UI font family */
}
```

---

## Technical Details

- **Zero dependencies** — no npm, no bundler, no framework
- **~1800 lines total** across 11 files (was 1631 in a single file)
- **Cookie storage** — state persists via chunked cookies (handles >4KB)
- **Modular architecture** — each JS file is self-contained and documented
- **No build step** — edit files and refresh the browser

---

## License

[MIT](LICENSE) — Free to use, modify, and distribute.

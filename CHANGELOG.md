# Changelog

All notable changes to MockOS are documented here.

## [2.0.0] - 2025-02-22

### 🏗️ Project Restructured
- Split monolithic `index.html` (1631 lines) into modular architecture
- Extracted CSS into `css/style.css` with organized sections
- Split JavaScript into 9 focused modules under `js/`
- Added proper SEO meta tags (description, Open Graph, theme-color)

### 📄 Documentation Added
- `README.md` — Full project docs with setup, features, and customization guide
- `CHANGELOG.md` — This file
- `LICENSE` — MIT license
- `.htaccess` — WAMP-optimized Apache configuration

### 🐛 Bug Fixes
- Fixed duplicate FileReader in style import handler (was reading file twice)

### 📦 File Structure
```
Before: 1 file  (index.html — 92KB)
After:  14 files (index.html + css/ + js/ + docs + config)
```

---

## [1.0.0] - 2025-02-01

### Initial Release
- Desktop environment with window manager
- 7 built-in apps (Settings, App Builder, Files, Terminal, Notepad, Calculator, Clock)
- 6 themes, 12 accent presets, 9 wallpapers
- CSS import/paste system
- Cookie-based state persistence
- App Builder with install-to-OS capability

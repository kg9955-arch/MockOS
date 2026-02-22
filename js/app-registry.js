/**
 * MockOS — App Registry
 * =====================
 * Central registry of all system and user-installed applications.
 * Each app entry defines its metadata (icon, color, pinned status)
 * and an `open()` callback that launches the app window.
 *
 * @file app-registry.js
 */

'use strict';

/**
 * Built-in system applications.
 * Keys are used as unique app IDs throughout the system.
 * @type {Object.<string, AppEntry>}
 */
const SYS_APPS = {
  settings:      { id: 'settings',      name: 'Settings',    icon: '⚙️',  color: 'linear-gradient(135deg,#4a4a7a,#8a8aaa)', pinned: true,  sys: true, open: (t) => openSettings(t) },
  'app-builder': { id: 'app-builder',   name: 'App Builder', icon: '🚀', color: 'linear-gradient(135deg,#f76a8a,#f7a06a)', pinned: true,  sys: true, open: ()  => openAppBuilder() },
  'file-mgr':    { id: 'file-mgr',      name: 'Files',       icon: '📁', color: 'linear-gradient(135deg,#6af7c4,#6aaaf7)', pinned: true,  sys: true, open: ()  => openFileMgr() },
  terminal:      { id: 'terminal',      name: 'Terminal',    icon: '💻', color: 'linear-gradient(135deg,#111,#222)',        pinned: true,  sys: true, open: ()  => openTerminal() },
  notepad:       { id: 'notepad',       name: 'Notepad',     icon: '📝', color: 'linear-gradient(135deg,#f7e06a,#f7a06a)', pinned: false, sys: true, open: ()  => openNotepad() },
  calculator:    { id: 'calculator',    name: 'Calculator',  icon: '🧮', color: 'linear-gradient(135deg,#6af7a0,#6af7f7)', pinned: false, sys: true, open: ()  => openCalculator() },
  clock:         { id: 'clock',         name: 'Clock',       icon: '🕐', color: 'linear-gradient(135deg,#6a8af7,#a06af7)', pinned: false, sys: true, open: ()  => openClock() },
};

/**
 * User-installed applications (created via App Builder).
 * @type {Object.<string, AppEntry>}
 */
const userApps = {};

/**
 * Returns a merged object of all system + user apps.
 * @returns {Object.<string, AppEntry>}
 */
const getAllApps = () => ({ ...SYS_APPS, ...userApps });

/**
 * Launch an app by its ID.
 * Records the app in the recent-apps list for the Start Menu.
 *
 * @param {string} id  - App ID from the registry
 * @param {string} [tab] - Optional sub-tab to open (used by Settings)
 */
function openApp(id, tab) {
  const app = getAllApps()[id];
  if (!app) { notify('Error', 'App not found: ' + id, '#ff5f57'); return; }

  recentApps.push({
    id,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  if (recentApps.length > 30) recentApps.shift();

  app.open(tab);
}

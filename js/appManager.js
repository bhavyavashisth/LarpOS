import TerminalApp from './apps/terminal.js';
import FilesApp from './apps/files.js';
import NotesApp from './apps/notes.js';
import MusicApp from './apps/music.js';
import SettingsApp from './apps/settings.js';
import CalculatorApp from './apps/calculator.js';
import MonitorApp from './apps/monitor.js';
import BrowserApp from './apps/browser.js';

export default class AppManager {
  constructor(windowManager, fs) {
    this.wm = windowManager;
    this.fs = fs;
    this.apps = {
      terminal: { title: 'Terminal', icon: 'fas fa-terminal', width: 520, height: 360, class: TerminalApp },
      finder: { title: 'Finder', icon: 'fas fa-folder', width: 560, height: 400, class: FilesApp },
      notes: { title: 'DeadDrop Notes', icon: 'fas fa-sticky-note', width: 500, height: 380, class: NotesApp },
      music: { title: 'LARP Music', icon: 'fas fa-music', width: 540, height: 420, class: MusicApp },
      settings: { title: 'Settings', icon: 'fas fa-sliders-h', width: 560, height: 440, class: SettingsApp },
      calculator: { title: 'Calculator', icon: 'fas fa-calculator', width: 320, height: 480, class: CalculatorApp },
      monitor: { title: 'proc://', icon: 'fas fa-chart-line', width: 580, height: 440, class: MonitorApp },
      browser: { title: 'LARP Browser', icon: 'fas fa-compass', width: 640, height: 480, class: BrowserApp }
    };
    this.runningApps = {};
  }

  getApp(id) {
    return this.apps[id] || null;
  }

  launch(id, winData) {
    if (this.runningApps[id]) {
      this.wm.focus(this.runningApps[id]);
      return;
    }

    const appDef = this.apps[id];
    if (!appDef) return;

    const appInstance = new appDef.class(this.fs, this);
    const body = this.wm.getBody(winData);
    appInstance.render(body);

    this.runningApps[id] = winData;
    winData.onClose = () => {
      if (appInstance.onClose) appInstance.onClose();
      delete this.runningApps[id];
    };
  }
}
import Boot from './boot.js';
import Desktop from './desktop.js';
import WindowManager from './windowManager.js';
import AppManager from './appManager.js';
import FileSystem from './filesystem.js';

class LARPOS {
  constructor() {
    this.fs = new FileSystem();
    this.wm = new WindowManager();
    this.appManager = new AppManager(this.wm, this.fs);
    this.boot = new Boot(this.onBootComplete.bind(this));
    this.desktop = null;
  }

  onBootComplete() {
    this.desktop = new Desktop(this.wm, this.appManager, this.fs);
    this.desktop.render();
  }

  init() {
    this.boot.render();
  }
}

const os = new LARPOS();
os.init();
window.__larp = os;
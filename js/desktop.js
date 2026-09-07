export default class Desktop {
  constructor(windowManager, appManager, fs) {
    this.wm = windowManager;
    this.appManager = appManager;
    this.fs = fs;
    this.element = null;
    this.dockApps = ['launcher', 'finder', 'terminal', 'browser', 'notes', 'music', 'settings'];
  }

  render() {
    const desktop = document.createElement('div');
    desktop.id = 'desktop';
    desktop.innerHTML = `
      <div class="topbar">
        <div class="topbar-left">
          <span class="logo"><i class="fas fa-apple-alt"></i> LARP</span>
          <div class="topbar-menu">
            <span>Finder</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Go</span>
            <span>Window</span>
            <span>Help</span>
          </div>
        </div>
        <div class="topbar-right">
          <i class="fas fa-wifi"></i>
          <i class="fas fa-volume-up"></i>
          <i class="fas fa-battery-three-quarters"></i>
          <span class="topbar-time">
            <i class="far fa-clock"></i> <span id="clockDisplay">--:--</span>
          </span>
        </div>
      </div>
      <div class="desktop-area" id="desktopArea"></div>
      <div class="dock" id="dock"></div>
      <div class="ctx-menu" id="ctxMenu">
        <div class="ctx-item"><i class="fas fa-folder-plus"></i> New Folder</div>
        <div class="ctx-item"><i class="fas fa-file-alt"></i> New Text</div>
        <div class="ctx-sep"></div>
        <div class="ctx-item"><i class="fas fa-image"></i> Change Wallpaper</div>
        <div class="ctx-item"><i class="fas fa-eye"></i> Show View Options</div>
        <div class="ctx-sep"></div>
        <div class="ctx-item danger"><i class="fas fa-power-off"></i> Force Quit…</div>
      </div>
    `;
    
    document.getElementById('app').appendChild(desktop);
    this.element = desktop;
    this.desktopArea = desktop.querySelector('#desktopArea');
    this.dockEl = desktop.querySelector('#dock');
    this.ctxMenu = desktop.querySelector('#ctxMenu');
    
    this.wm.setContainer(this.desktopArea);
    this.buildDock();
    this.setupContextMenu();
    this.updateClock();
    setInterval(this.updateClock.bind(this), 1000);
    this.createDefaultWindows();
  }

  buildDock() {
    const icons = {
      launcher: 'fa-th',
      finder: 'fa-folder',
      terminal: 'fa-terminal',
      browser: 'fa-compass',
      notes: 'fa-sticky-note',
      music: 'fa-music',
      settings: 'fa-sliders-h'
    };
    
    this.dockApps.forEach((app, index) => {
      const item = document.createElement('div');
      item.className = 'dock-item' + (app === 'finder' ? ' active' : '');
      item.dataset.app = app;
      item.innerHTML = `<i class="fas ${icons[app]}"></i>`;
      item.title = app.charAt(0).toUpperCase() + app.slice(1);
      item.addEventListener('click', () => this.launchApp(app));
      this.dockEl.appendChild(item);
      
      if (index === 2 || index === 5) {
        const divider = document.createElement('div');
        divider.className = 'dock-divider';
        this.dockEl.appendChild(divider);
      }
    });
  }

  launchApp(appId) {
    const app = this.appManager.getApp(appId);
    if (app) {
      const win = this.wm.createWindow(app.title, app.icon, 80 + Math.random() * 100, 60 + Math.random() * 80, app.width || 480, app.height || 320);
      this.appManager.launch(appId, win);
    }
  }

  createDefaultWindows() {
    // finder and terminal windows
    setTimeout(() => {
      this.launchApp('finder');
      setTimeout(() => this.launchApp('terminal'), 300);
    }, 300);
  }

  setupContextMenu() {
    this.desktopArea.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.ctxMenu.classList.add('visible');
      this.ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 220) + 'px';
      this.ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 180) + 'px';
    });
    document.addEventListener('click', () => {
      this.ctxMenu.classList.remove('visible');
    });
  }

  updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const display = document.getElementById('clockDisplay');
    if (display) display.textContent = h + ':' + m;
  }
}
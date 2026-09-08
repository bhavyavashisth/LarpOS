export default class Desktop {
  constructor(windowManager, appManager, fs) {
    this.wm = windowManager;
    this.appManager = appManager;
    this.fs = fs;
    this.element = null;
    this.dockApps = ['finder', 'terminal', 'browser', 'notes', 'music', 'calculator', 'monitor', 'settings'];
  }

  render() {
    const desktop = document.createElement('div');
    desktop.id = 'desktop';
    desktop.innerHTML = `
      <div class="topbar">
        <div class="topbar-left">
          <span class="logo" id="larp-logo"><i class="fas fa-apple-alt"></i> LARP</span>
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
      <!-- Shutdown overlay -->
      <div id="shutdown-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;flex-direction:column;align-items:center;justify-content:center;color:#d4e2ed;font-family:monospace;">
        <div style="font-size:2rem;margin-bottom:20px;">⏻ Shutting down LARP OS...</div>
        <div style="width:300px;height:4px;background:#2a343e;border-radius:2px;overflow:hidden;">
          <div id="shutdown-progress" style="height:100%;width:0%;background:#5bc97a;border-radius:2px;transition:width 0.3s;"></div>
        </div>
        <div style="margin-top:12px;font-size:0.8rem;color:#6a7a84;">All processes terminated. Goodbye.</div>
      </div>
    `;

    document.getElementById('app').appendChild(desktop);
    this.element = desktop;
    this.desktopArea = desktop.querySelector('#desktopArea');
    this.dockEl = desktop.querySelector('#dock');
    this.ctxMenu = desktop.querySelector('#ctxMenu');
    this.shutdownOverlay = desktop.querySelector('#shutdown-overlay');
    this.shutdownProgress = desktop.querySelector('#shutdown-progress');

    this.wm.setContainer(this.desktopArea);
    this.buildDock();
    this.setupContextMenu();
    this.setupLogo();
    this.updateClock();
    setInterval(this.updateClock.bind(this), 1000);
    this.createDefaultWindows();
  }

  buildDock() {
    const icons = {
      finder: 'fa-folder',
      terminal: 'fa-terminal',
      browser: 'fa-compass',
      notes: 'fa-sticky-note',
      music: 'fa-music',
      calculator: 'fa-calculator',
      monitor: 'fa-chart-line',
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

      // Add dividers after specific positions
      if (index === 2 || index === 5) {
        const divider = document.createElement('div');
        divider.className = 'dock-divider';
        this.dockEl.appendChild(divider);
      }
    });
  }

  setupLogo() {
    const logo = document.getElementById('larp-logo');
    logo.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showShutdownMenu();
    });
  }

  showShutdownMenu() {
    // Remove existing menu if any
    const existing = document.getElementById('shutdown-menu');
    if (existing) {
      existing.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.id = 'shutdown-menu';
    menu.style.cssText = `
      position:fixed; top:32px; left:10px;
      background:#1a222a; border:1px solid #2a343e;
      border-radius:8px; padding:6px 0;
      min-width:160px; z-index:9999;
      box-shadow:0 8px 30px rgba(0,0,0,0.8);
    `;

    const item = document.createElement('div');
    item.style.cssText = 'padding:8px 20px;color:#d4e2ed;cursor:pointer;display:flex;align-items:center;gap:10px;';
    item.innerHTML = '<i class="fas fa-power-off" style="color:#e4646a;"></i> Shut Down...';
    item.addEventListener('click', () => {
      menu.remove();
      this.shutdownOS();
    });

    // Close menu on outside click
    menu.appendChild(item);
    document.body.appendChild(menu);

    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 10);
  }

  shutdownOS() {
    this.shutdownOverlay.style.display = 'flex';
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      this.shutdownProgress.style.width = Math.min(progress, 100) + '%';
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          location.reload();
        }, 800);
      }
    }, 60);
  }

  launchApp(appId) {
    const app = this.appManager.getApp(appId);
    if (app) {
      const win = this.wm.createWindow(
        app.title,
        app.icon,
        80 + Math.random() * 100,
        60 + Math.random() * 80,
        app.width || 480,
        app.height || 320
      );
      this.appManager.launch(appId, win);
    }
  }

  createDefaultWindows() {
    setTimeout(() => {
      this.launchApp('finder');
      setTimeout(() => this.launchApp('terminal'), 400);
    }, 500);
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
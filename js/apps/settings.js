export default class SettingsApp {
  constructor(fs) {
    this.fs = fs;
    this.settings = {
      wallpaper: 'assets/wallpapers/dark.jpg',
      accentColor: '#5bc97a',
      dockPosition: 'bottom',
      autoHideDock: false,
      bootAnimation: true,
      terminalFont: 'Menlo',
      terminalSize: 'medium'
    };
    this.wallpapers = [
      'assets/wallpapers/dark.jpg',
      'assets/wallpapers/cyberpunk.jpg',
      'assets/wallpapers/matrix.jpg',
      'assets/wallpapers/ghost.jpg',
      'assets/wallpapers/corporate.jpg'
    ];
    this.loadSettings();
    
    window.__larp_settings_instance = this;
  }

  loadSettings() {
    try {
      const data = this.fs.readFile('/home/larp/.larp-settings.json');
      if (data) {
        this.settings = JSON.parse(data);
      }
    } catch (e) {
      
    }
  }

  saveSettings() {
    this.fs.writeFile('/home/larp/.larp-settings.json', JSON.stringify(this.settings));
    this.applyWallpaper(this.settings.wallpaper);
    this.applyAccentColor(this.settings.accentColor);
  }

  applyWallpaper(path) {
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.style.backgroundImage = `url('${path}')`;
      desktop.style.backgroundSize = 'cover';
      desktop.style.backgroundPosition = 'center';
    }
  }

  applyAccentColor(color) {
    document.querySelectorAll('.terminal-prompt, .music-progress-fill, .ok, .log-line .ok').forEach(el => {
      el.style.color = color;
    });
  
    document.querySelectorAll('.music-progress-fill, .progress-fill').forEach(el => {
      el.style.background = color;
    });
  }

  render(container) {
    container.innerHTML = `
      <div class="settings-app" style="height:100%;display:flex;background:#141a20;">
        <div class="settings-sidebar" style="width:180px;background:#1a222a;border-right:1px solid #2a343e;padding:12px;">
          <div class="setting-category active" data-category="appearance">Appearance</div>
          <div class="setting-category" data-category="desktop">Desktop</div>
          <div class="setting-category" data-category="terminal">Terminal</div>
          <div class="setting-category" data-category="system">System</div>
        </div>
        <div class="settings-content" id="settings-content" style="flex:1;padding:20px;overflow-y:auto;"></div>
      </div>
    `;

    this.content = container.querySelector('#settings-content');
    this.container = container;

    container.querySelectorAll('.setting-category').forEach(cat => {
      cat.addEventListener('click', () => {
        container.querySelectorAll('.setting-category').forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        this.renderCategory(cat.dataset.category);
      });
    });

    // Apply current settings on load
    this.applyWallpaper(this.settings.wallpaper);
    this.applyAccentColor(this.settings.accentColor);
    this.renderCategory('appearance');
  }

  renderCategory(category) {
    const settings = this.settings;
    let html = '';

    switch (category) {
      case 'appearance':
        html = `
          <h3 style="color:#d4e2ed;margin-bottom:20px;">Appearance</h3>
          <div class="setting-group">
            <label>Wallpaper</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;">
              ${this.wallpapers.map(w => `
                <div style="cursor:pointer;border:2px solid ${settings.wallpaper === w ? '#5bc97a' : 'transparent'};border-radius:8px;overflow:hidden;width:100px;height:60px;" 
                     onclick="window.__larp_set_wallpaper('${w}')">
                  <img src="${w}" style="width:100%;height:100%;object-fit:cover;" />
                </div>
              `).join('')}
            </div>
          </div>
          <div class="setting-group">
            <label>Accent Color</label>
            <input type="color" id="setting-accent" value="${settings.accentColor}" />
          </div>
        `;
        break;

      case 'desktop':
        html = `
          <h3 style="color:#d4e2ed;margin-bottom:20px;">Desktop</h3>
          <div class="setting-group">
            <label>Dock Position</label>
            <select id="setting-dock">
              <option value="bottom" ${settings.dockPosition === 'bottom' ? 'selected' : ''}>Bottom</option>
              <option value="left" ${settings.dockPosition === 'left' ? 'selected' : ''}>Left</option>
              <option value="right" ${settings.dockPosition === 'right' ? 'selected' : ''}>Right</option>
            </select>
          </div>
          <div class="setting-group">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="setting-autohide" ${settings.autoHideDock ? 'checked' : ''} />
              Auto-hide dock
            </label>
          </div>
        `;
        break;

      case 'terminal':
        html = `
          <h3 style="color:#d4e2ed;margin-bottom:20px;">Terminal</h3>
          <div class="setting-group">
            <label>Font</label>
            <select id="setting-font">
              <option value="Menlo" ${settings.terminalFont === 'Menlo' ? 'selected' : ''}>Menlo</option>
              <option value="Monaco" ${settings.terminalFont === 'Monaco' ? 'selected' : ''}>Monaco</option>
              <option value="Fira Code" ${settings.terminalFont === 'Fira Code' ? 'selected' : ''}>Fira Code</option>
            </select>
          </div>
          <div class="setting-group">
            <label>Font Size</label>
            <select id="setting-size">
              <option value="small" ${settings.terminalSize === 'small' ? 'selected' : ''}>Small</option>
              <option value="medium" ${settings.terminalSize === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="large" ${settings.terminalSize === 'large' ? 'selected' : ''}>Large</option>
            </select>
          </div>
        `;
        break;

      case 'system':
        html = `
          <h3 style="color:#d4e2ed;margin-bottom:20px;">System</h3>
          <div class="setting-group">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="setting-boot" ${settings.bootAnimation ? 'checked' : ''} />
              Show boot animation
            </label>
          </div>
          <div class="setting-group">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="setting-telemetry" checked />
              Enable simulated telemetry
            </label>
          </div>
          <div style="margin-top:20px;padding:16px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
            <h4 style="color:#6a7a84;font-size:0.7rem;margin-bottom:8px;">ABOUT</h4>
            <div style="color:#b0c6d4;font-size:0.75rem;">LARP OS v1.0</div>
            <div style="color:#6a7a84;font-size:0.7rem;">macOS × Linux × Hacker Culture</div>
          </div>
        `;
        break;
    }

    this.content.innerHTML = html;
    this.bindEvents(category);
  }

  bindEvents(category) {
    const settings = this.settings;

    if (category === 'appearance') {
      const accent = this.content.querySelector('#setting-accent');
      if (accent) {
        accent.addEventListener('input', (e) => {
          settings.accentColor = e.target.value;
          this.applyAccentColor(settings.accentColor);
          this.saveSettings();
        });
      }
    }

    if (category === 'desktop') {
      const dock = this.content.querySelector('#setting-dock');
      const autohide = this.content.querySelector('#setting-autohide');
      if (dock) {
        dock.addEventListener('change', (e) => {
          settings.dockPosition = e.target.value;
          this.saveSettings();
        });
      }
      if (autohide) {
        autohide.addEventListener('change', (e) => {
          settings.autoHideDock = e.target.checked;
          this.saveSettings();
        });
      }
    }

    if (category === 'terminal') {
      const font = this.content.querySelector('#setting-font');
      const size = this.content.querySelector('#setting-size');
      if (font) {
        font.addEventListener('change', (e) => {
          settings.terminalFont = e.target.value;
          this.saveSettings();
        });
      }
      if (size) {
        size.addEventListener('change', (e) => {
          settings.terminalSize = e.target.value;
          this.saveSettings();
        });
      }
    }

    if (category === 'system') {
      const boot = this.content.querySelector('#setting-boot');
      if (boot) {
        boot.addEventListener('change', (e) => {
          settings.bootAnimation = e.target.checked;
          this.saveSettings();
        });
      }
    }
  }
}

window.__larp_set_wallpaper = (path) => {
  const instance = window.__larp_settings_instance;
  if (instance) {
    instance.settings.wallpaper = path;
    instance.saveSettings();
   
    document.querySelectorAll('.setting-group div[style*="cursor:pointer"]').forEach(el => {
      el.style.borderColor = 'transparent';
    });
    document.querySelectorAll('.setting-group div[style*="cursor:pointer"]').forEach(el => {
      const img = el.querySelector('img');
      if (img && img.src.includes(path)) {
        el.style.borderColor = '#5bc97a';
      }
    });
  }
};
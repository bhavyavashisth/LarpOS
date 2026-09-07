// js/apps/files.js - File Manager
export default class FilesApp {
  constructor(fs) {
    this.fs = fs;
    this.currentPath = '/home/larp';
  }

  render(container) {
    container.innerHTML = `
      <div class="files-app" style="height:100%;display:flex;flex-direction:column;background:#141a20;">
        <div class="files-toolbar" style="display:flex;gap:12px;padding:8px 12px;border-bottom:1px solid #2a343e;background:#1a222a;">
          <button id="files-back"><i class="fas fa-arrow-left"></i></button>
          <button id="files-forward"><i class="fas fa-arrow-right"></i></button>
          <button id="files-up"><i class="fas fa-level-up-alt"></i></button>
          <input class="files-path" id="files-path" value="/home/larp" style="flex:1;background:#0d1117;border:1px solid #2a343e;border-radius:4px;padding:2px 10px;color:#c8dae6;font-size:0.75rem;font-family:monospace;outline:none;" />
          <button id="files-new-folder"><i class="fas fa-folder-plus"></i></button>
        </div>
        <div class="files-grid" id="files-grid" style="flex:1;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;overflow-y:auto;align-content:start;"></div>
      </div>
    `;

    this.grid = container.querySelector('#files-grid');
    this.pathInput = container.querySelector('#files-path');
    this.container = container;

    this.loadDirectory(this.currentPath);

    container.querySelector('#files-up').addEventListener('click', () => {
      const parts = this.currentPath.split('/').filter(p => p !== '');
      parts.pop();
      const newPath = '/' + parts.join('/') || '/';
      this.loadDirectory(newPath);
    });

    container.querySelector('#files-back').addEventListener('click', () => {
      // Simple back - go to parent
      const parts = this.currentPath.split('/').filter(p => p !== '');
      parts.pop();
      const newPath = '/' + parts.join('/') || '/';
      this.loadDirectory(newPath);
    });

    container.querySelector('#files-new-folder').addEventListener('click', () => {
      const name = prompt('New folder name:');
      if (name) {
        const path = this.currentPath + '/' + name;
        this.fs.mkdir(path);
        this.loadDirectory(this.currentPath);
      }
    });

    this.pathInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.loadDirectory(this.pathInput.value);
      }
    });
  }

  loadDirectory(path) {
    const files = this.fs.listDir(path);
    if (files === null) {
      this.grid.innerHTML = '<div style="color:#4a5f6e;text-align:center;width:100%;padding:40px;">Directory not found</div>';
      return;
    }

    this.currentPath = path;
    this.pathInput.value = path;
    this.grid.innerHTML = '';

    // Add parent directory entry if not at root
    if (path !== '/') {
      const parent = document.createElement('div');
      parent.className = 'file-item';
      parent.innerHTML = '<i class="fas fa-arrow-up"></i><div class="file-name">..</div>';
      parent.addEventListener('dblclick', () => {
        const parts = path.split('/').filter(p => p !== '');
        parts.pop();
        this.loadDirectory('/' + parts.join('/') || '/');
      });
      this.grid.appendChild(parent);
    }

    // Sort: folders first, then files
    const items = Object.keys(files).sort((a, b) => {
      const nodeA = this.fs.resolvePath(path + '/' + a);
      const nodeB = this.fs.resolvePath(path + '/' + b);
      if (nodeA.type === 'folder' && nodeB.type !== 'folder') return -1;
      if (nodeA.type !== 'folder' && nodeB.type === 'folder') return 1;
      return a.localeCompare(b);
    });

    items.forEach(name => {
      const node = this.fs.resolvePath(path + '/' + name);
      if (!node) return;

      const item = document.createElement('div');
      item.className = 'file-item';
      const icon = node.type === 'folder' ? 'fa-folder' : 'fa-file';
      item.innerHTML = `<i class="fas ${icon}"></i><div class="file-name">${name}</div>`;
      
      if (node.type === 'folder') {
        item.addEventListener('dblclick', () => {
          this.loadDirectory(path + '/' + name);
        });
      } else {
        item.addEventListener('dblclick', () => {
          const content = this.fs.readFile(path + '/' + name);
          if (content !== null) {
            alert(`File: ${name}\n\n${content}`);
          }
        });
      }

      this.grid.appendChild(item);
    });
  }
}
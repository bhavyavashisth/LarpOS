// js/windowManager.js - Window management
export default class WindowManager {
  constructor() {
    this.windows = [];
    this.zIndex = 10;
    this.container = null;
    this.nextId = 1;
  }

  setContainer(container) {
    this.container = container;
  }

  createWindow(title, icon, x, y, width, height) {
    const win = document.createElement('div');
    win.className = 'window active';
    win.dataset.windowId = this.nextId++;
    win.style.left = x + 'px';
    win.style.top = y + 'px';
    win.style.width = width + 'px';
    win.style.height = height + 'px';
    win.style.zIndex = this.zIndex++;

    const header = document.createElement('div');
    header.className = 'window-header';
    const controls = document.createElement('div');
    controls.className = 'window-controls';
    controls.innerHTML = `<span class="win-close"></span><span class="win-min"></span><span class="win-max"></span>`;
    const titleSpan = document.createElement('span');
    titleSpan.className = 'window-title';
    titleSpan.innerHTML = `<i class="${icon}"></i> ${title}`;
    header.appendChild(controls);
    header.appendChild(titleSpan);

    const body = document.createElement('div');
    body.className = 'window-body';
    body.id = `win-body-${win.dataset.windowId}`;
    // Set initial placeholder
    body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4a5f6e;font-style:italic;flex-direction:column;gap:8px;">
      <i class="${icon}" style="font-size:2rem;color:#3a4f5e;"></i>
      <span>Loading ${title}...</span>
    </div>`;

    win.appendChild(header);
    win.appendChild(body);
    this.container.appendChild(win);

    const winData = { id: win.dataset.windowId, el: win, title, body, icon };
    this.windows.push(winData);

    this.makeDraggable(win, header);
    this.setupControls(win, winData);

    win.addEventListener('mousedown', () => this.focus(winData));

    return winData;
  }

  setupControls(win, winData) {
    const closeBtn = win.querySelector('.win-close');
    const minBtn = win.querySelector('.win-min');
    const maxBtn = win.querySelector('.win-max');

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close(winData);
    });

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    });

    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.prevWidth || '480px';
        win.style.height = win.dataset.prevHeight || '320px';
        win.style.left = win.dataset.prevLeft || '80px';
        win.style.top = win.dataset.prevTop || '60px';
        win.dataset.maximized = 'false';
      } else {
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevTop = win.style.top;
        win.style.left = '0px';
        win.style.top = '32px';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 32px)';
        win.dataset.maximized = 'true';
      }
    });
  }

  makeDraggable(win, handle) {
    let offsetX, offsetY, dragging = false;
    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-controls')) return;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      dragging = true;
      win.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });

    const onMove = (e) => {
      if (!dragging) return;
      const parentRect = this.container.getBoundingClientRect();
      let left = e.clientX - parentRect.left - offsetX;
      let top = e.clientY - parentRect.top - offsetY;
      left = Math.max(0, Math.min(left, parentRect.width - win.offsetWidth));
      top = Math.max(0, Math.min(top, parentRect.height - win.offsetHeight));
      win.style.left = left + 'px';
      win.style.top = top + 'px';
    };

    const onUp = () => {
      dragging = false;
      win.style.cursor = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }

  focus(winData) {
    this.windows.forEach(w => w.el.classList.remove('active'));
    winData.el.classList.add('active');
    winData.el.style.zIndex = this.zIndex++;
  }

  close(winData) {
    winData.el.remove();
    this.windows = this.windows.filter(w => w.id !== winData.id);
    if (winData.onClose) winData.onClose();
  }

  getBody(winData) {
    return winData.body;
  }

  setContent(winData, content) {
    winData.body.innerHTML = content;
  }
}
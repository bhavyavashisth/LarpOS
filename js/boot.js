export default class Boot {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.element = null;
    this.lines = [
      { prefix: '[BIOS]', msg: 'Initializing questionable hardware...', ok: true },
      { prefix: '[BIOS]', msg: 'Loading suspicious kernel modules...', ok: true },
      { prefix: '[KERNEL]', msg: 'Mounting common sense...', ok: false },
      { prefix: '[KERNEL]', msg: 'Starting packet engine...', ok: true },
      { prefix: '[NET]', msg: 'Connecting to ASAN...', ok: true },
      { prefix: '[ASAN]', msg: 'CONNECTION TERMINATED — Reason: They noticed.', ok: false, highlight: true },
      { prefix: '[KERNEL]', msg: 'LARP Kernel loading...', ok: true },
    ];
    this.currentLine = 0;
    this.progress = 0;
    this.complete = false;
  }

  render() {
    const boot = document.createElement('div');
    boot.id = 'boot';
    boot.innerHTML = `
      <div class="boot-box">
        <div class="boot-header">
          <span><i class="fas fa-microchip"></i> LARP BIOS v6.66</span>
          <span><i class="fas fa-lock"></i> secure boot: disabled</span>
        </div>
        <div class="boot-log" id="bootLog"></div>
        <div class="progress-track">
          <div class="progress-fill" id="bootProgress"></div>
        </div>
        <div class="boot-footer">
          <span><i class="fas fa-power-off"></i>  LARP OS  ·  probably legal</span>
          <button class="skip" id="skipBoot"><i class="fas fa-forward"></i> skip</button>
        </div>
      </div>
    `;
    document.getElementById('app').appendChild(boot);
    this.element = boot;
    this.logEl = boot.querySelector('#bootLog');
    this.progressEl = boot.querySelector('#bootProgress');
    this.skipBtn = boot.querySelector('#skipBoot');
    
    this.skipBtn.addEventListener('click', this.skip.bind(this));
    setTimeout(this.advance.bind(this), 400);
  }

  advance() {
    if (this.complete) return;
    if (this.currentLine < this.lines.length) {
      this.appendLine(this.lines[this.currentLine]);
      this.currentLine++;
      this.progress = Math.min(95, (this.currentLine / this.lines.length) * 100);
      this.progressEl.style.width = this.progress + '%';
      
      if (this.currentLine === this.lines.length) {
        setTimeout(() => {
          this.progressEl.style.width = '100%';
          this.complete = true;
          setTimeout(() => {
            this.finish();
          }, 500);
        }, 400);
      } else {
        setTimeout(this.advance.bind(this), 180 + Math.random() * 280);
      }
    }
  }

  appendLine(line) {
    const div = document.createElement('div');
    div.className = 'log-line';
    const prefixSpan = document.createElement('span');
    prefixSpan.className = 'prefix';
    prefixSpan.textContent = line.prefix;
    const msgSpan = document.createElement('span');
    msgSpan.className = 'msg';
    if (line.ok === true) {
      msgSpan.innerHTML = `<span class="ok"><i class="fas fa-check-circle"></i> [ OK ]</span>  ${line.msg}`;
    } else if (line.ok === false && line.highlight) {
      msgSpan.innerHTML = `<span class="fail"><i class="fas fa-times-circle"></i> [FAIL]</span>  <span class="highlight">${line.msg}</span>`;
    } else if (line.ok === false) {
      msgSpan.innerHTML = `<span class="fail"><i class="fas fa-times-circle"></i> [FAIL]</span>  ${line.msg}`;
    }
    div.appendChild(prefixSpan);
    div.appendChild(msgSpan);
    this.logEl.appendChild(div);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  skip() {
    while (this.currentLine < this.lines.length) {
      this.appendLine(this.lines[this.currentLine]);
      this.currentLine++;
    }
    this.progressEl.style.width = '100%';
    this.complete = true;
    setTimeout(this.finish.bind(this), 200);
  }

  finish() {
    this.element.classList.add('hidden');
    if (this.onComplete) this.onComplete();
  }
}
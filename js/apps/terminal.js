// js/apps/terminal.js - Terminal application
export default class TerminalApp {
  constructor(fs, appManager) {
    this.fs = fs;
    this.appManager = appManager;
    this.history = [];
    this.historyIndex = 0;
    this.commands = {
      help: this.help.bind(this),
      clear: this.clear.bind(this),
      history: this.showHistory.bind(this),
      pwd: this.pwd.bind(this),
      ls: this.ls.bind(this),
      cd: this.cd.bind(this),
      cat: this.cat.bind(this),
      mkdir: this.mkdir.bind(this),
      touch: this.touch.bind(this),
      echo: this.echo.bind(this),
      whoami: this.whoami.bind(this),
      date: this.date.bind(this),
      uname: this.uname.bind(this),
      neofetch: this.neofetch.bind(this),
      ps: this.ps.bind(this),
      sudo: this.sudo.bind(this),
      scan: this.scan.bind(this),
      ping: this.ping.bind(this),
      hack: this.hack.bind(this),
      matrix: this.matrix.bind(this),
      fortune: this.fortune.bind(this),
      coffee: this.coffee.bind(this),
      rickroll: this.rickroll.bind(this),
      'sudo make-me-root': this.makeMeRoot.bind(this),
      'sudo touch-grass': this.touchGrass.bind(this)
    };
    this.output = [];
    this.buffer = '';
    this.inputLine = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="terminal-app" id="terminal-output" style="height:100%;overflow-y:auto;padding:8px 12px;font-family:monospace;font-size:0.85rem;background:#0d1117;color:#c9d1d9;">
        <div style="color:#5bc97a;">LARP OS v1.0 — terminal ready</div>
        <div style="color:#6a7a84;margin-bottom:8px;">Type 'help' for commands</div>
        <div id="terminal-history"></div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">larp@larp-os:~$</span>
          <input type="text" class="terminal-input" id="terminal-input" autofocus style="background:transparent;border:none;color:#c9d1d9;font-family:monospace;font-size:0.85rem;flex:1;outline:none;" />
        </div>
      </div>
    `;

    this.outputEl = container.querySelector('#terminal-history');
    this.inputEl = container.querySelector('#terminal-input');
    this.container = container;

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.inputEl.value);
        this.inputEl.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
      }
    });

    setTimeout(() => this.inputEl.focus(), 100);
    this.container.addEventListener('click', () => this.inputEl.focus());
  }

  executeCommand(input) {
    const cmd = input.trim();
    if (!cmd) return;
    
    this.history.push(cmd);
    this.historyIndex = this.history.length;
    
    this.appendOutput(`<span style="color:#5bc97a;">larp@larp-os:~$</span> ${cmd}`);
    
    const parts = cmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    if (this.commands[command]) {
      this.commands[command](args);
    } else {
      this.appendOutput(`<span class="terminal-error">command not found: ${command}</span>`);
    }
  }

  appendOutput(html) {
    const div = document.createElement('div');
    div.className = 'terminal-output';
    div.innerHTML = html;
    this.outputEl.appendChild(div);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  // Commands
  help() {
    const cmds = Object.keys(this.commands).sort().join(', ');
    this.appendOutput(`Available commands: ${cmds}`);
  }

  clear() {
    this.outputEl.innerHTML = '';
  }

  showHistory() {
    this.history.forEach((cmd, i) => {
      this.appendOutput(`  ${i+1}  ${cmd}`);
    });
  }

  pwd() {
    this.appendOutput(this.fs.getCwd());
  }

  ls(args) {
    const path = args[0] || this.fs.getCwd();
    const files = this.fs.listDir(path);
    if (files) {
      this.appendOutput(files.join('  '));
    } else {
      this.appendOutput(`<span class="terminal-error">ls: cannot access '${path}': No such file or directory</span>`);
    }
  }

  cd(args) {
    if (!args.length) {
      this.fs.cd('/home/larp');
      return;
    }
    const success = this.fs.cd(args[0]);
    if (!success) {
      this.appendOutput(`<span class="terminal-error">cd: no such directory: ${args[0]}</span>`);
    }
  }

  cat(args) {
    if (!args.length) {
      this.appendOutput('<span class="terminal-error">cat: missing file operand</span>');
      return;
    }
    const content = this.fs.readFile(args[0]);
    if (content !== null) {
      this.appendOutput(content);
    } else {
      this.appendOutput(`<span class="terminal-error">cat: ${args[0]}: No such file or directory</span>`);
    }
  }

  mkdir(args) {
    if (!args.length) {
      this.appendOutput('<span class="terminal-error">mkdir: missing operand</span>');
      return;
    }
    const success = this.fs.mkdir(args[0]);
    if (!success) {
      this.appendOutput(`<span class="terminal-error">mkdir: cannot create directory '${args[0]}'</span>`);
    }
  }

  touch(args) {
    if (!args.length) {
      this.appendOutput('<span class="terminal-error">touch: missing file operand</span>');
      return;
    }
    const success = this.fs.touch(args[0]);
    if (!success) {
      this.appendOutput(`<span class="terminal-error">touch: cannot touch sorry T_T '${args[0]}'</span>`);
    }
  }

  echo(args) {
    this.appendOutput(args.join(' '));
  }

  whoami() {
    this.appendOutput('larp');
  }

  date() {
    this.appendOutput(new Date().toString());
  }

  uname() {
    this.appendOutput('LARP OS 1.0 x86_64');
  }

  neofetch() {
    this.appendOutput(`
      <span style="color:#5bc97a;">OS:</span> LARP OS 1.0 x86_64
      <span style="color:#5bc97a;">Kernel:</span> LARP 6.66
      <span style="color:#5bc97a;">Shell:</span> larp-sh
      <span style="color:#5bc97a;">Uptime:</span> ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m
      <span style="color:#5bc97a;">Memory:</span> ${Math.floor(Math.random() * 8 + 2)}GB / 16GB
    `);
  }

  ps() {
    this.appendOutput(`
      PID   PROCESS              CPU    MEM
      01    kernel               2.1%   312MB
      42    terminal             1.4%   120MB
      69    suspicious_process   0.0%   4MB
      1337  hacker.exe           97.2%  12MB
    `);
  }

  sudo(args) {
    if (args.length === 0) {
      this.appendOutput('<span class="terminal-error">sudo: missing command</span>');
      return;
    }
    const cmd = args.join(' ');
    if (cmd === 'make-me-root') {
      this.makeMeRoot();
    } else if (cmd === 'touch-grass') {
      this.touchGrass();
    } else if (cmd === 'rm -rf /') {
      this.appendOutput(`
        <span class="terminal-highlight">Nice try.</span>
        LARP OS has protected the virtual filesystem.
        Nothing was deleted.
      `);
    } else {
      this.appendOutput(`<span class="terminal-success">[sudo] permission granted for: ${cmd}</span>`);
    }
  }

  makeMeRoot() {
    this.appendOutput(`
      <span class="terminal-highlight">ERROR: Permission denied.</span>
      <span style="color:#6a7a84;">You are already root in your heart.</span>
    `);
  }

  touchGrass() {
    this.appendOutput(`
      <span class="terminal-highlight">Permission denied.</span>
      <span style="color:#6a7a84;">Grass is outside.</span>
    `);
  }

  scan() {
    this.appendOutput(`
      <span style="color:#5bc97a;">Scanning network...</span>
      <span style="color:#6a7a84;">192.168.1.1 (router) - alive</span>
      <span style="color:#6a7a84;">192.168.1.42 (larp-pc) - alive</span>
      <span style="color:#6a7a84;">192.168.1.69 (ASAN-node) - alive</span>
      <span style="color:#6a7a84;">192.168.1.1337 (hacker-node) - alive</span>
    `);
  }

  ping(args) {
    const target = args[0] || 'localhost';
    this.appendOutput(`
      <span style="color:#5bc97a;">PING ${target}</span>
      <span style="color:#6a7a84;">64 bytes from ${target}: icmp_seq=1 ttl=64 time=${Math.floor(Math.random() * 20 + 1)}ms</span>
      <span style="color:#6a7a84;">64 bytes from ${target}: icmp_seq=2 ttl=64 time=${Math.floor(Math.random() * 20 + 1)}ms</span>
      <span style="color:#6a7a84;">64 bytes from ${target}: icmp_seq=3 ttl=64 time=${Math.floor(Math.random() * 20 + 1)}ms</span>
    `);
  }

  hack(args) {
    const target = args[0] || 'ASAN';
    this.appendOutput(`
      <span class="terminal-highlight">INITIATING HACK SEQUENCE...</span>
      <span style="color:#6a7a84;">Connecting to ${target}...</span>
      <span style="color:#6a7a84;">Bypassing firewall...</span>
      <span style="color:#6a7a84;">Injecting payload...</span>
      <span class="terminal-success">ACCESS GRANTED</span>
      <span style="color:#6a7a84;">Welcome to ${target} internal network.</span>
    `);
  }

  matrix() {
    this.appendOutput(`
      <span style="color:#5bc97a;">${Array(40).fill('').map(() => Math.random() > 0.7 ? Math.random().toString(36).substr(2, 1) : ' ').join('')}</span>
      <span style="color:#5bc97a;">${Array(40).fill('').map(() => Math.random() > 0.7 ? Math.random().toString(36).substr(2, 1) : ' ').join('')}</span>
      <span style="color:#5bc97a;">${Array(40).fill('').map(() => Math.random() > 0.7 ? Math.random().toString(36).substr(2, 1) : ' ').join('')}</span>
      <span style="color:#6a7a84;">Follow the white rabbit...</span>
    `);
  }

  fortune() {
    const fortunes = [
      'You will find a bug in your code. Actually, you wrote it.',
      'Your hard drive is spinning. Mostly in circles.',
      'LARP OS: because reality is overrated.',
      'The cake is a lie. So is your uptime.',
      'sudo make me a sandwich — Permission denied.'
    ];
    this.appendOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }

  coffee() {
    this.appendOutput(`
      <span style="color:#f5c542;">☕ Brewing coffee...</span>
      <span style="color:#6a7a84;">Coffee ready. Your productivity is now +10% for 2 hours.</span>
    `);
  }

  rickroll() {
    this.appManager.launch('music');
    this.appendOutput(`
      <span class="terminal-highlight">🎵 You have been successfully rickrolled.</span>
      <span style="color:#6a7a84;">There is no patch.</span>
    `);
  }
}
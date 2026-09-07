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
    this.container = null;
    this.outputEl = null;
    this.inputEl = null;
  }

  render(container) {
    this.container = container;
    
    // Clear the container and set up terminal
    container.innerHTML = '';
    
    // Create terminal structure
    const terminalDiv = document.createElement('div');
    terminalDiv.className = 'terminal-app';
    terminalDiv.style.cssText = `
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #0d1117;
      color: #c9d1d9;
      font-family: 'Menlo', 'Monaco', 'Fira Code', monospace;
      font-size: 0.85rem;
      padding: 8px 12px;
      overflow: hidden;
    `;

    // Output area
    const outputDiv = document.createElement('div');
    outputDiv.id = 'terminal-output';
    outputDiv.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    `;
    
    // Welcome message
    const welcome = document.createElement('div');
    welcome.style.cssText = 'color: #5bc97a; margin-bottom: 4px;';
    welcome.textContent = 'LARP OS v1.0 — terminal ready';
    outputDiv.appendChild(welcome);
    
    const info = document.createElement('div');
    info.style.cssText = 'color: #6a7a84; margin-bottom: 8px;';
    info.textContent = "Type 'help' for commands";
    outputDiv.appendChild(info);

    // Input line
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-input-line';
    inputLine.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      flex-shrink: 0;
    `;

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.style.cssText = 'color: #5bc97a; font-weight: 500;';
    prompt.textContent = 'larp@larp-os:~$';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-input';
    input.style.cssText = `
      background: transparent;
      border: none;
      color: #c9d1d9;
      font-family: inherit;
      font-size: 0.85rem;
      flex: 1;
      outline: none;
      padding: 2px 0;
    `;
    input.autofocus = true;

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    terminalDiv.appendChild(outputDiv);
    terminalDiv.appendChild(inputLine);
    container.appendChild(terminalDiv);

    // Store references
    this.outputEl = outputDiv;
    this.inputEl = input;

    // Event listeners
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) {
          this.executeCommand(cmd);
          input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          input.value = '';
        }
      }
    });

    // Focus on click
    container.addEventListener('click', () => input.focus());
    
    // Focus the input
    setTimeout(() => input.focus(), 100);
  }

  executeCommand(cmd) {
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
      this.appendOutput(`<span style="color: #e4646a;">command not found: ${command}</span>`);
    }
    
    // Scroll to bottom
    if (this.outputEl) {
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
  }

  appendOutput(html) {
    if (!this.outputEl) return;
    const div = document.createElement('div');
    div.style.cssText = 'margin: 2px 0; line-height: 1.6;';
    div.innerHTML = html;
    this.outputEl.appendChild(div);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  // Commands
  help() {
    const cmds = Object.keys(this.commands).sort().join(', ');
    this.appendOutput(`<span style="color: #8aaec9;">Available commands:</span> ${cmds}`);
  }

  clear() {
    if (this.outputEl) {
      // Keep only the prompt lines
      const children = this.outputEl.children;
      const toRemove = [];
      for (let i = 0; i < children.length; i++) {
        toRemove.push(children[i]);
      }
      toRemove.forEach(child => child.remove());
    }
  }

  showHistory() {
    if (this.history.length === 0) {
      this.appendOutput('<span style="color: #6a7a84;">No commands in history</span>');
      return;
    }
    this.history.forEach((cmd, i) => {
      this.appendOutput(`  ${String(i+1).padStart(3)}  ${cmd}`);
    });
  }

  pwd() {
    this.appendOutput(this.fs.getCwd());
  }

  ls(args) {
    const path = args[0] || this.fs.getCwd();
    const files = this.fs.listDir(path);
    if (files) {
      if (files.length === 0) {
        this.appendOutput('<span style="color: #6a7a84;">(empty directory)</span>');
      } else {
        // Format in columns
        const cols = 4;
        const rows = Math.ceil(files.length / cols);
        let output = '';
        for (let i = 0; i < rows; i++) {
          let row = '';
          for (let j = 0; j < cols; j++) {
            const idx = i + j * rows;
            if (idx < files.length) {
              row += files[idx].padEnd(20);
            }
          }
          output += row + '\n';
        }
        this.appendOutput(output);
      }
    } else {
      this.appendOutput(`<span style="color: #e4646a;">ls: cannot access '${path}': No such file or directory</span>`);
    }
  }

  cd(args) {
    if (!args.length) {
      this.fs.cd('/home/larp');
      return;
    }
    const success = this.fs.cd(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">cd: no such directory: ${args[0]}</span>`);
    }
  }

  cat(args) {
    if (!args.length) {
      this.appendOutput('<span style="color: #e4646a;">cat: missing file operand</span>');
      return;
    }
    const content = this.fs.readFile(args[0]);
    if (content !== null) {
      this.appendOutput(content || '<span style="color: #6a7a84;">(empty file)</span>');
    } else {
      this.appendOutput(`<span style="color: #e4646a;">cat: ${args[0]}: No such file or directory</span>`);
    }
  }

  mkdir(args) {
    if (!args.length) {
      this.appendOutput('<span style="color: #e4646a;">mkdir: missing operand</span>');
      return;
    }
    const success = this.fs.mkdir(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">mkdir: cannot create directory '${args[0]}'</span>`);
    }
  }

  touch(args) {
    if (!args.length) {
      this.appendOutput('<span style="color: #e4646a;">touch: missing file operand</span>');
      return;
    }
    const success = this.fs.touch(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">touch: cannot touch '${args[0]}'</span>`);
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
    `.replace(/\n/g, '<br>'));
  }

  ps() {
    this.appendOutput(`
      PID   PROCESS              CPU    MEM
      01    kernel               2.1%   312MB
      42    terminal             1.4%   120MB
      69    suspicious_process   0.0%   4MB
      1337  hacker.exe           97.2%  12MB
    `.replace(/\n/g, '<br>'));
  }

  sudo(args) {
    if (args.length === 0) {
      this.appendOutput('<span style="color: #e4646a;">sudo: missing command</span>');
      return;
    }
    const cmd = args.join(' ');
    if (cmd === 'make-me-root') {
      this.makeMeRoot();
    } else if (cmd === 'touch-grass') {
      this.touchGrass();
    } else if (cmd === 'rm -rf /') {
      this.appendOutput(`
        <span style="color: #f5c542;">Nice try.</span>
        <span style="color: #6a7a84;">LARP OS has protected the virtual filesystem.</span>
        <span style="color: #6a7a84;">Nothing was deleted.</span>
      `);
    } else {
      this.appendOutput(`<span style="color: #5bc97a;">[sudo] permission granted for: ${cmd}</span>`);
    }
  }

  makeMeRoot() {
    this.appendOutput(`
      <span style="color: #f5c542;">ERROR: Permission denied.</span>
      <span style="color: #6a7a84;">You are already root in your heart.</span>
    `);
  }

  touchGrass() {
    this.appendOutput(`
      <span style="color: #f5c542;">Permission denied.</span>
      <span style="color: #6a7a84;">Grass is outside.</span>
    `);
  }

  scan() {
    this.appendOutput(`
      <span style="color: #5bc97a;">Scanning network...</span>
      <span style="color: #6a7a84;">192.168.1.1 (router) - alive</span>
      <span style="color: #6a7a84;">192.168.1.42 (larp-pc) - alive</span>
      <span style="color: #6a7a84;">192.168.1.69 (ASAN-node) - alive</span>
      <span style="color: #6a7a84;">192.168.1.1337 (hacker-node) - alive</span>
    `);
  }

  ping(args) {
    const target = args[0] || 'localhost';
    const times = [Math.floor(Math.random() * 20 + 1), Math.floor(Math.random() * 20 + 1), Math.floor(Math.random() * 20 + 1)];
    this.appendOutput(`
      <span style="color: #5bc97a;">PING ${target}</span>
      <span style="color: #6a7a84;">64 bytes from ${target}: icmp_seq=1 ttl=64 time=${times[0]}ms</span>
      <span style="color: #6a7a84;">64 bytes from ${target}: icmp_seq=2 ttl=64 time=${times[1]}ms</span>
      <span style="color: #6a7a84;">64 bytes from ${target}: icmp_seq=3 ttl=64 time=${times[2]}ms</span>
    `);
  }

  hack(args) {
    const target = args[0] || 'ASAN';
    this.appendOutput(`
      <span style="color: #f5c542;">INITIATING HACK SEQUENCE...</span>
      <span style="color: #6a7a84;">Connecting to ${target}...</span>
      <span style="color: #6a7a84;">Bypassing firewall...</span>
      <span style="color: #6a7a84;">Injecting payload...</span>
      <span style="color: #5bc97a;">ACCESS GRANTED</span>
      <span style="color: #6a7a84;">Welcome to ${target} internal network.</span>
    `);
  }

  matrix() {
    for (let i = 0; i < 5; i++) {
      let line = '';
      for (let j = 0; j < 50; j++) {
        line += Math.random() > 0.7 ? String.fromCharCode(65 + Math.random() * 26) : ' ';
      }
      this.appendOutput(`<span style="color: #5bc97a;">${line}</span>`);
    }
    this.appendOutput('<span style="color: #6a7a84;">Follow the white rabbit...</span>');
  }

  fortune() {
    const fortunes = [
      'You will find a bug in your code. Actually, you wrote it.',
      'Your hard drive is spinning. Mostly in circles.',
      'LARP OS: because reality is overrated.',
      'The cake is a lie. So is your uptime.',
      'sudo make me a sandwich — Permission denied.',
      'In the beginning there was nothing. And then it crashed.',
      'Your password is too secure. Even you forgot it.'
    ];
    this.appendOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }

  coffee() {
    this.appendOutput(`
      <span style="color: #f5c542;">☕ Brewing coffee...</span>
      <span style="color: #6a7a84;">Coffee ready. Your productivity is now +10% for 2 hours.</span>
    `);
  }

  rickroll() {
    if (this.appManager) {
      this.appManager.launch('music');
      this.appendOutput(`
        <span style="color: #f5c542;">🎵 You have been successfully rickrolled.</span>
        <span style="color: #6a7a84;">There is no patch.</span>
      `);
    }
  }
}
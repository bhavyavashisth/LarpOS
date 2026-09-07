// js/apps/terminal.js - Terminal application
export default class TerminalApp {
  constructor(fs, appManager) {
    this.fs = fs;
    this.appManager = appManager;
    this.history = [];
    this.historyIndex = 0;
    this.outputEl = null;
    this.inputEl = null;
    this.container = null;
    
    // Define commands
    this.commands = {
      help: () => this.showHelp(),
      clear: () => this.clearTerminal(),
      history: () => this.showHistory(),
      pwd: () => this.showPwd(),
      ls: (args) => this.listDir(args),
      cd: (args) => this.changeDir(args),
      cat: (args) => this.catFile(args),
      mkdir: (args) => this.makeDir(args),
      touch: (args) => this.touchFile(args),
      echo: (args) => this.echoText(args),
      whoami: () => this.whoAmI(),
      date: () => this.showDate(),
      uname: () => this.showUname(),
      neofetch: () => this.showNeofetch(),
      ps: () => this.showPs(),
      sudo: (args) => this.sudoCmd(args),
      scan: () => this.scanNetwork(),
      ping: (args) => this.pingHost(args),
      hack: (args) => this.hackTarget(args),
      matrix: () => this.showMatrix(),
      fortune: () => this.showFortune(),
      coffee: () => this.makeCoffee(),
      rickroll: () => this.rickrollCmd()
    };
  }

  render(container) {
    this.container = container;
    container.style.cssText = `
      height: 100%;
      background: #0d1117;
      font-family: 'Menlo', 'Monaco', 'Fira Code', monospace;
      font-size: 0.85rem;
      padding: 0;
      overflow: hidden;
    `;

    // Create terminal container
    const terminalDiv = document.createElement('div');
    terminalDiv.style.cssText = `
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      color: #c9d1d9;
    `;

    // Output area
    const outputDiv = document.createElement('div');
    outputDiv.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    `;
    outputDiv.id = 'terminal-output';

    // Welcome message
    const welcome = document.createElement('div');
    welcome.style.cssText = 'color: #5bc97a; margin-bottom: 4px;';
    welcome.textContent = 'LARP OS v1.0 — terminal ready';
    outputDiv.appendChild(welcome);

    const info = document.createElement('div');
    info.style.cssText = 'color: #6a7a84; margin-bottom: 8px;';
    info.textContent = "Type 'help' for commands";
    outputDiv.appendChild(info);

    // Input area
    const inputDiv = document.createElement('div');
    inputDiv.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      padding-top: 4px;
      border-top: 1px solid #1a222a;
    `;

    const prompt = document.createElement('span');
    prompt.style.cssText = 'color: #5bc97a; font-weight: 500;';
    prompt.textContent = 'larp@larp-os:~$';

    const input = document.createElement('input');
    input.type = 'text';
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

    inputDiv.appendChild(prompt);
    inputDiv.appendChild(input);
    terminalDiv.appendChild(outputDiv);
    terminalDiv.appendChild(inputDiv);
    container.appendChild(terminalDiv);

    // Store references
    this.outputEl = outputDiv;
    this.inputEl = input;

    // Setup event listeners
    this.setupInputHandlers();
    
    // Focus input
    setTimeout(() => input.focus(), 100);
  }

  setupInputHandlers() {
    if (!this.inputEl) return;

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl.value.trim();
        if (cmd) {
          this.executeCommand(cmd);
          this.inputEl.value = '';
        }
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

    // Focus on click
    this.container.addEventListener('click', () => {
      if (this.inputEl) this.inputEl.focus();
    });
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

  // Command implementations
  showHelp() {
    const cmds = Object.keys(this.commands).sort().join(', ');
    this.appendOutput(`<span style="color: #8aaec9;">Available commands:</span> ${cmds}`);
  }

  clearTerminal() {
    if (this.outputEl) {
      this.outputEl.innerHTML = '';
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

  showPwd() {
    this.appendOutput(this.fs.getCwd());
  }

  listDir(args) {
    const path = args[0] || this.fs.getCwd();
    const files = this.fs.listDir(path);
    if (files) {
      if (files.length === 0) {
        this.appendOutput('<span style="color: #6a7a84;">(empty directory)</span>');
      } else {
        this.appendOutput(files.join('  '));
      }
    } else {
      this.appendOutput(`<span style="color: #e4646a;">ls: cannot access '${path}': No such file or directory</span>`);
    }
  }

  changeDir(args) {
    if (!args.length) {
      this.fs.cd('/home/larp');
      return;
    }
    const success = this.fs.cd(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">cd: no such directory: ${args[0]}</span>`);
    }
  }

  catFile(args) {
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

  makeDir(args) {
    if (!args.length) {
      this.appendOutput('<span style="color: #e4646a;">mkdir: missing operand</span>');
      return;
    }
    const success = this.fs.mkdir(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">mkdir: cannot create directory '${args[0]}'</span>`);
    }
  }

  touchFile(args) {
    if (!args.length) {
      this.appendOutput('<span style="color: #e4646a;">touch: missing file operand</span>');
      return;
    }
    const success = this.fs.touch(args[0]);
    if (!success) {
      this.appendOutput(`<span style="color: #e4646a;">touch: cannot touch '${args[0]}'</span>`);
    }
  }

  echoText(args) {
    this.appendOutput(args.join(' '));
  }

  whoAmI() {
    this.appendOutput('larp');
  }

  showDate() {
    this.appendOutput(new Date().toString());
  }

  showUname() {
    this.appendOutput('LARP OS 1.0 x86_64');
  }

  showNeofetch() {
    this.appendOutput(`
      OS: LARP OS 1.0 x86_64
      Kernel: LARP 6.66
      Shell: larp-sh
      Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m
      Memory: ${Math.floor(Math.random() * 8 + 2)}GB / 16GB
    `);
  }

  showPs() {
    this.appendOutput(`
      PID   PROCESS              CPU    MEM
      01    kernel               2.1%   312MB
      42    terminal             1.4%   120MB
      69    suspicious_process   0.0%   4MB
      1337  hacker.exe           97.2%  12MB
    `);
  }

  sudoCmd(args) {
    if (args.length === 0) {
      this.appendOutput('<span style="color: #e4646a;">sudo: missing command</span>');
      return;
    }
    const cmd = args.join(' ');
    if (cmd === 'make-me-root') {
      this.appendOutput(`
        <span style="color: #f5c542;">ERROR: Permission denied.</span>
        <span style="color: #6a7a84;">You are already root in your heart.</span>
      `);
    } else if (cmd === 'touch-grass') {
      this.appendOutput(`
        <span style="color: #f5c542;">Permission denied.</span>
        <span style="color: #6a7a84;">Grass is outside.</span>
      `);
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

  scanNetwork() {
    this.appendOutput(`
      Scanning network...
      192.168.1.1 (router) - alive
      192.168.1.42 (larp-pc) - alive
      192.168.1.69 (ASAN-node) - alive
      192.168.1.1337 (hacker-node) - alive
    `);
  }

  pingHost(args) {
    const target = args[0] || 'localhost';
    const times = [Math.floor(Math.random() * 20 + 1), Math.floor(Math.random() * 20 + 1), Math.floor(Math.random() * 20 + 1)];
    this.appendOutput(`
      PING ${target}
      64 bytes from ${target}: icmp_seq=1 ttl=64 time=${times[0]}ms
      64 bytes from ${target}: icmp_seq=2 ttl=64 time=${times[1]}ms
      64 bytes from ${target}: icmp_seq=3 ttl=64 time=${times[2]}ms
    `);
  }

  hackTarget(args) {
    const target = args[0] || 'ASAN';
    this.appendOutput(`
      <span style="color: #f5c542;">INITIATING HACK SEQUENCE...</span>
      Connecting to ${target}...
      Bypassing firewall...
      Injecting payload...
      <span style="color: #5bc97a;">ACCESS GRANTED</span>
      Welcome to ${target} internal network.
    `);
  }

  showMatrix() {
    for (let i = 0; i < 5; i++) {
      let line = '';
      for (let j = 0; j < 50; j++) {
        line += Math.random() > 0.7 ? String.fromCharCode(65 + Math.random() * 26) : ' ';
      }
      this.appendOutput(`<span style="color: #5bc97a;">${line}</span>`);
    }
    this.appendOutput('<span style="color: #6a7a84;">Follow the white rabbit...</span>');
  }

  showFortune() {
    const fortunes = [
      'You will find a bug in your code. Actually, you wrote it.',
      'Your hard drive is spinning. Mostly in circles.',
      'LARP OS: because reality is overrated.',
      'The cake is a lie. So is your uptime.',
      'sudo make me a sandwich — Permission denied.',
      'In the beginning there was nothing. And then it crashed.'
    ];
    this.appendOutput(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }

  makeCoffee() {
    this.appendOutput(`
      <span style="color: #f5c542;">☕ Brewing coffee...</span>
      Coffee ready. Your productivity is now +10% for 2 hours.
    `);
  }

  rickrollCmd() {
    if (this.appManager) {
      this.appManager.launch('music');
      this.appendOutput(`
        <span style="color: #f5c542;">🎵 You have been successfully rickrolled.</span>
        <span style="color: #6a7a84;">There is no patch.</span>
      `);
    }
  }
}
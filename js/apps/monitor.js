// js/apps/monitor.js - System Monitor
export default class MonitorApp {
  constructor() {
    this.processes = [
      { pid: 1, name: 'kernel', cpu: 2.1, mem: 312 },
      { pid: 42, name: 'terminal', cpu: 1.4, mem: 120 },
      { pid: 69, name: 'suspicious_process', cpu: 0.0, mem: 4 },
      { pid: 1337, name: 'hacker.exe', cpu: 97.2, mem: 12 }
    ];
    this.interval = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="monitor-app" style="height:100%;padding:16px;background:#141a20;overflow-y:auto;">
        <div class="monitor-stats" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:20px;">
          <div class="monitor-card" style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;padding:16px;">
            <h4 style="color:#8aaec9;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">CPU</h4>
            <div class="value" style="font-size:1.5rem;color:#d4e2ed;font-weight:500;" id="monitor-cpu">${(2 + Math.random() * 20).toFixed(1)}%</div>
          </div>
          <div class="monitor-card" style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;padding:16px;">
            <h4 style="color:#8aaec9;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Memory</h4>
            <div class="value" style="font-size:1.5rem;color:#d4e2ed;font-weight:500;" id="monitor-mem">${(4 + Math.random() * 8).toFixed(1)} GB</div>
          </div>
          <div class="monitor-card" style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;padding:16px;">
            <h4 style="color:#8aaec9;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Uptime</h4>
            <div class="value" style="font-size:1.5rem;color:#d4e2ed;font-weight:500;" id="monitor-uptime">${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m</div>
          </div>
          <div class="monitor-card" style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;padding:16px;">
            <h4 style="color:#8aaec9;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Threat Level</h4>
            <div class="value" style="font-size:1.5rem;color:#f5c542;font-weight:500;" id="monitor-threat">${['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)]}</div>
          </div>
        </div>
        <div class="monitor-processes" style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:0.75rem;">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 12px;background:#0d1117;color:#8aaec9;font-weight:500;">PID</th>
                <th style="text-align:left;padding:8px 12px;background:#0d1117;color:#8aaec9;font-weight:500;">PROCESS</th>
                <th style="text-align:left;padding:8px 12px;background:#0d1117;color:#8aaec9;font-weight:500;">CPU</th>
                <th style="text-align:left;padding:8px 12px;background:#0d1117;color:#8aaec9;font-weight:500;">MEM</th>
              </tr>
            </thead>
            <tbody id="monitor-table">
              ${this.processes.map(p => `
                <tr>
                  <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.pid}</td>
                  <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.name}</td>
                  <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.cpu}%</td>
                  <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.mem}MB</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.container = container;
    this.startMonitoring();
  }

  startMonitoring() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      const cpu = document.getElementById('monitor-cpu');
      const mem = document.getElementById('monitor-mem');
      const uptime = document.getElementById('monitor-uptime');
      const threat = document.getElementById('monitor-threat');
      
      if (cpu) cpu.textContent = (2 + Math.random() * 25).toFixed(1) + '%';
      if (mem) mem.textContent = (3 + Math.random() * 10).toFixed(1) + ' GB';
      if (uptime) {
        const h = Math.floor(Math.random() * 48);
        const m = Math.floor(Math.random() * 60);
        uptime.textContent = h + 'h ' + m + 'm';
      }
      if (threat) {
        const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        threat.textContent = levels[Math.floor(Math.random() * levels.length)];
        threat.style.color = threat.textContent === 'CRITICAL' ? '#e4646a' : 
                            threat.textContent === 'HIGH' ? '#f5c542' : '#5bc97a';
      }

      // Update process list
      const table = document.getElementById('monitor-table');
      if (table) {
        this.processes.forEach(p => {
          p.cpu = Math.max(0, p.cpu + (Math.random() - 0.5) * 2);
          p.mem = Math.max(2, p.mem + (Math.random() - 0.5) * 4);
        });
        table.innerHTML = this.processes.map(p => `
          <tr>
            <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.pid}</td>
            <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.name}</td>
            <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.cpu.toFixed(1)}%</td>
            <td style="padding:6px 12px;color:#b0c6d4;border-top:1px solid #2a343e;">${p.mem.toFixed(1)}MB</td>
          </tr>
        `).join('');
      }
    }, 1500);
  }

  onClose() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
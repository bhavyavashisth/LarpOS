export default class MusicApp {
  constructor(fs) {
    this.fs = fs;
    this.track = {
      id: 1,
      title: 'Chicken Scream',
      artist: 'The Barnyard',
      duration: '0:04',
      artwork: '👁',
      file: 'assets/audio/chicken_scream.mp3'
    };
    this.playing = false;
    this.audio = null;
    this.interval = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="music-app" style="height:100%;display:flex;flex-direction:column;background:#141a20;">
        <div class="music-header" style="padding:16px 20px;border-bottom:1px solid #2a343e;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="color:#d4e2ed;font-weight:500;"><i class="fas fa-music" style="color:#5bc97a;"></i> LARP Music</h3>
          <span style="color:#6a7a84;font-size:0.75rem;">LARP RADIO</span>
        </div>
        <div class="music-player" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">
          <div class="music-artwork" style="width:180px;height:180px;border-radius:12px;background:linear-gradient(135deg,#2a3a48,#1a222a);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <span style="font-size:5rem;">${this.track.artwork}</span>
          </div>
          <div id="music-title" style="color:#d4e2ed;font-size:1.4rem;font-weight:500;">${this.track.title}</div>
          <div id="music-artist" style="color:#6a7a84;font-size:0.9rem;margin-bottom:16px;">${this.track.artist}</div>
          <div style="width:100%;max-width:400px;">
            <div class="music-progress" style="width:100%;height:4px;background:#2a343e;border-radius:2px;cursor:pointer;margin-bottom:16px;">
              <div class="music-progress-fill" id="music-progress-fill" style="height:100%;background:#5bc97a;border-radius:2px;width:0%;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:#6a7a84;">
              <span id="music-time-current">0:00</span>
              <span id="music-time-total">${this.track.duration}</span>
            </div>
          </div>
          <div class="music-controls" style="display:flex;gap:20px;align-items:center;margin-top:16px;">
            <button id="music-play" class="play-btn" style="background:transparent;border:none;color:#5bc97a;font-size:2.5rem;cursor:pointer;padding:8px;border-radius:50%;">
              <i class="fas fa-play"></i>
            </button>
          </div>
          <div style="margin-top:12px;font-size:0.7rem;color:#6a7a84;">
            <span><i class="fas fa-redo"></i> Repeat</span>
          </div>
        </div>
      </div>
    `;

    this.container = container;
    this.playBtn = container.querySelector('#music-play');
    this.progressFill = container.querySelector('#music-progress-fill');
    this.timeCurrent = container.querySelector('#music-time-current');
    this.timeTotal = container.querySelector('#music-time-total');

    this.audio = new Audio(this.track.file);
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.onEnded.bind(this));

    container.querySelector('#music-play').addEventListener('click', () => {
      this.togglePlay();
    });

    this.showChickenNotification();
  }

  togglePlay() {
    this.playing = !this.playing;
    this.playBtn.innerHTML = this.playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    if (this.playing) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  updateProgress() {
    if (!this.audio) return;
    const current = this.audio.currentTime;
    const total = this.audio.duration || 1;
    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    this.timeCurrent.textContent = mins + ':' + String(secs).padStart(2, '0');
    const progress = total > 0 ? (current / total) * 100 : 0;
    this.progressFill.style.width = Math.min(progress, 100) + '%';
  }

  onEnded() {
    this.playing = false;
    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.audio.currentTime = 0;
    this.progressFill.style.width = '0%';
    this.timeCurrent.textContent = '0:00';
  }

  showChickenNotification() {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
      background:#1a222a;border:1px solid #f5c542;border-radius:12px;
      padding:16px 24px;color:#d4e2ed;z-index:9999;
      box-shadow:0 8px 30px rgba(0,0,0,0.8);
      animation:fadeIn 0.5s ease;
    `;
    notif.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:2rem;">🐔</span>
        <div>
          <div style="font-weight:500;">CHICKEN ALERT</div>
          <div style="font-size:0.8rem;color:#8aaec9;">You are now listening to the ultimate chicken scream.</div>
        </div>
      </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.5s';
      setTimeout(() => notif.remove(), 500);
    }, 3000);
  }

  onClose() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
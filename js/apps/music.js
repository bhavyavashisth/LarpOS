// js/apps/music.js - Music application
export default class MusicApp {
  constructor(fs) {
    this.fs = fs;
    this.tracks = [
      { id: 1, title: 'LARP Anthem', artist: 'LARP Collective', duration: '3:42', artwork: '🎵' },
      { id: 2, title: 'Binary Dreams', artist: 'Byte Bandit', duration: '4:15', artwork: '🎶' },
      { id: 3, title: 'Terminal Vibes', artist: 'Root User', duration: '3:28', artwork: '🎧' },
      { id: 4, title: 'Packet Storm', artist: 'ASAN Sound', duration: '5:02', artwork: '🌀' },
      { id: 5, title: 'Never Gonna Give You Up', artist: 'Rick Astley', duration: '3:33', artwork: '🎤', rickroll: true }
    ];
    this.currentTrack = null;
    this.playing = false;
    this.currentTime = 0;
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
          <div class="music-artwork" style="width:160px;height:160px;border-radius:12px;background:linear-gradient(135deg,#2a3a48,#1a222a);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <i class="fas fa-music" style="font-size:4rem;color:#6a8a9e;"></i>
          </div>
          <div id="music-title" style="color:#d4e2ed;font-size:1.2rem;font-weight:500;">Select a track</div>
          <div id="music-artist" style="color:#6a7a84;font-size:0.8rem;margin-bottom:16px;">LARP Radio</div>
          <div style="width:100%;max-width:400px;">
            <div class="music-progress" style="width:100%;height:4px;background:#2a343e;border-radius:2px;cursor:pointer;margin-bottom:16px;">
              <div class="music-progress-fill" id="music-progress-fill" style="height:100%;background:#5bc97a;border-radius:2px;width:0%;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:#6a7a84;">
              <span id="music-time-current">0:00</span>
              <span id="music-time-total">0:00</span>
            </div>
          </div>
          <div class="music-controls" style="display:flex;gap:20px;align-items:center;margin-top:16px;">
            <button id="music-prev" style="background:transparent;border:none;color:#b0c6d4;font-size:1.2rem;cursor:pointer;padding:8px;border-radius:50%;"><i class="fas fa-step-backward"></i></button>
            <button id="music-play" class="play-btn" style="background:transparent;border:none;color:#5bc97a;font-size:2rem;cursor:pointer;padding:8px;border-radius:50%;"><i class="fas fa-play"></i></button>
            <button id="music-next" style="background:transparent;border:none;color:#b0c6d4;font-size:1.2rem;cursor:pointer;padding:8px;border-radius:50%;"><i class="fas fa-step-forward"></i></button>
          </div>
          <div style="display:flex;gap:16px;margin-top:12px;font-size:0.7rem;color:#6a7a84;">
            <span><i class="fas fa-random"></i> Shuffle</span>
            <span><i class="fas fa-redo"></i> Repeat</span>
          </div>
        </div>
        <div style="padding:12px 20px;border-top:1px solid #2a343e;display:flex;gap:12px;flex-wrap:wrap;">
          ${this.tracks.map(t => `
            <div class="track-item" data-id="${t.id}" style="padding:4px 12px;border:1px solid #2a343e;border-radius:20px;font-size:0.7rem;color:#b0c6d4;cursor:pointer;transition:0.1s;">
              ${t.title}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container = container;
    this.playBtn = container.querySelector('#music-play');
    this.titleEl = container.querySelector('#music-title');
    this.artistEl = container.querySelector('#music-artist');
    this.progressFill = container.querySelector('#music-progress-fill');
    this.timeCurrent = container.querySelector('#music-time-current');
    this.timeTotal = container.querySelector('#music-time-total');

    container.querySelectorAll('.track-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        const track = this.tracks.find(t => t.id === id);
        if (track) {
          this.playTrack(track);
        }
      });
    });

    container.querySelector('#music-play').addEventListener('click', () => {
      if (this.currentTrack) {
        this.togglePlay();
      }
    });

    container.querySelector('#music-next').addEventListener('click', () => {
      this.nextTrack();
    });

    container.querySelector('#music-prev').addEventListener('click', () => {
      this.prevTrack();
    });

    // Check for rickroll easter egg
    const rickroll = this.tracks.find(t => t.rickroll);
    if (rickroll) {
      // Rickroll is ready
    }
  }

  playTrack(track) {
    this.currentTrack = track;
    this.playing = true;
    this.currentTime = 0;
    this.titleEl.textContent = track.title;
    this.artistEl.textContent = track.artist;
    this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    this.timeTotal.textContent = track.duration;

    if (track.rickroll) {
      // Show notification
      this.showRickrollNotification();
    }

    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.currentTime += 1;
      const mins = Math.floor(this.currentTime / 60);
      const secs = Math.floor(this.currentTime % 60);
      this.timeCurrent.textContent = mins + ':' + String(secs).padStart(2, '0');
      const totalSecs = this.parseDuration(track.duration);
      const progress = totalSecs > 0 ? (this.currentTime / totalSecs) * 100 : 0;
      this.progressFill.style.width = Math.min(progress, 100) + '%';
      
      if (this.currentTime >= totalSecs) {
        this.nextTrack();
      }
    }, 1000);
  }

  parseDuration(duration) {
    const parts = duration.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }

  togglePlay() {
    this.playing = !this.playing;
    this.playBtn.innerHTML = this.playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    if (this.playing) {
      // Resume - just continue
    } else {
      // Pause
    }
  }

  nextTrack() {
    if (!this.currentTrack) return;
    const idx = this.tracks.indexOf(this.currentTrack);
    const nextIdx = (idx + 1) % this.tracks.length;
    this.playTrack(this.tracks[nextIdx]);
  }

  prevTrack() {
    if (!this.currentTrack) return;
    const idx = this.tracks.indexOf(this.currentTrack);
    const prevIdx = (idx - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(this.tracks[prevIdx]);
  }

  showRickrollNotification() {
    // Simple notification
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
        <i class="fas fa-exclamation-triangle" style="color:#f5c542;font-size:1.2rem;"></i>
        <div>
          <div style="font-weight:500;">SYSTEM ALERT</div>
          <div style="font-size:0.8rem;color:#8aaec9;">You have been successfully rickrolled. There is no patch.</div>
        </div>
      </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.5s';
      setTimeout(() => notif.remove(), 500);
    }, 4000);
  }
}
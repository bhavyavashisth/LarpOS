export default class BrowserApp {
  constructor(fs, appManager) {
    this.fs = fs;
    this.appManager = appManager;
    this.history = [];
    this.bookmarks = [];
    this.currentUrl = 'about:larp';
    this.currentTitle = 'LARP Browser';

    //websites
    this.sites = {
      'asan.larp': {
        title: 'ASAN - Advanced Space Agency of Nothing',
        content: `
          <div style="padding:20px;">
            <h1 style="color:#5bc97a;font-weight:300;">ASAN</h1>
            <p style="color:#8aaec9;">Advanced Space Agency of Nothing</p>
            <div style="margin-top:20px;padding:16px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
              <p style="color:#b0c6d4;">🚀 Our mission: Explore the nothingness of space.</p>
              <p style="color:#6a7a84;font-size:0.8rem;margin-top:8px;">Current status: Still nothing.</p>
            </div>
          </div>
        `
      },
      'hackoverflow.larp': {
        title: 'HackOverflow - Stack Overflow parody',
        content: `
          <div style="padding:20px;">
            <h1 style="color:#f5c542;font-weight:300;">HackOverflow</h1>
            <p style="color:#8aaec9;">Where hackers ask questions and get answers</p>
            <div style="margin-top:20px;">
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;margin-bottom:8px;">
                <h4 style="color:#d4e2ed;">How to hack ASAN?</h4>
                <p style="color:#6a7a84;font-size:0.8rem;">Asked by larp_user • 3 answers</p>
              </div>
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
                <h4 style="color:#d4e2ed;">sudo make-me-root not working?</h4>
                <p style="color:#6a7a84;font-size:0.8rem;">Asked by noob_hacker • 42 answers</p>
              </div>
            </div>
          </div>
        `
      },
      '1337news.larp': {
        title: '1337 News - Hacker News',
        content: `
          <div style="padding:20px;">
            <h1 style="color:#5bc97a;font-weight:300;">1337 News</h1>
            <p style="color:#8aaec9;">The latest in cyber security</p>
            <div style="margin-top:20px;">
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;margin-bottom:8px;">
                <h4 style="color:#d4e2ed;">ASAN data breach: Nothing was stolen</h4>
                <p style="color:#6a7a84;font-size:0.8rem;">2 hours ago • 1337 views</p>
              </div>
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
                <h4 style="color:#d4e2ed;">LARP OS v1.0 released - probably legal</h4>
                <p style="color:#6a7a84;font-size:0.8rem;">1 day ago • 420 views</p>
              </div>
            </div>
          </div>
        `
      },
      'darkweb.larp': {
        title: 'DarkWeb - Fictional marketplace',
        content: `
          <div style="padding:20px;background:#0a0c0e;">
            <h1 style="color:#e4646a;font-weight:300;">🌑 DarkWeb</h1>
            <p style="color:#6a7a84;">Completely fictional marketplace</p>
            <div style="margin-top:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;">
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
                <div style="font-size:2rem;">🔑</div>
                <div style="color:#d4e2ed;font-size:0.8rem;">Access codes</div>
                <div style="color:#6a7a84;font-size:0.7rem;">₿ 0.42</div>
              </div>
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
                <div style="font-size:2rem;">💻</div>
                <div style="color:#d4e2ed;font-size:0.8rem;">Hacker scripts</div>
                <div style="color:#6a7a84;font-size:0.7rem;">₿ 0.69</div>
              </div>
            </div>
          </div>
        `
      },
      'catbin.larp': {
        title: 'CatBin - Pastebin parody',
        content: `
          <div style="padding:20px;">
            <h1 style="color:#f5c542;font-weight:300;">🐱 CatBin</h1>
            <p style="color:#8aaec9;">Anonymous paste site</p>
            <div style="margin-top:20px;padding:16px;background:#0d1117;border-radius:8px;border:1px solid #2a343e;font-family:monospace;font-size:0.8rem;color:#b0c6d4;">
              <div>// leaked ASAN data</div>
              <div>{"nothing": "found"}</div>
              <div style="color:#6a7a84;">// definitely not illegal</div>
            </div>
          </div>
        `
      },
      'larp.social': {
        title: 'LARP Social - Fake social network',
        content: `
          <div style="padding:20px;">
            <h1 style="color:#5bc97a;font-weight:300;">LARP Social</h1>
            <p style="color:#8aaec9;">Where everyone is a hacker</p>
            <div style="margin-top:20px;">
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:1.2rem;">👾</span>
                  <span style="color:#d4e2ed;font-weight:500;">larp_user</span>
                </div>
                <p style="color:#b0c6d4;font-size:0.8rem;margin-top:4px;">Just hacked the mainframe. Again.</p>
                <div style="color:#6a7a84;font-size:0.7rem;margin-top:4px;">❤️ 1337 • 💬 42</div>
              </div>
              <div style="padding:12px;background:#1a222a;border-radius:8px;border:1px solid #2a343e;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:1.2rem;">🤖</span>
                  <span style="color:#d4e2ed;font-weight:500;">ASAN_bot</span>
                </div>
                <p style="color:#b0c6d4;font-size:0.8rem;margin-top:4px;">We noticed nothing. As usual.</p>
                <div style="color:#6a7a84;font-size:0.7rem;margin-top:4px;">❤️ 69 • 💬 13</div>
              </div>
            </div>
          </div>
        `
      }
    };
  }

  render(container) {
    container.innerHTML = `
      <div class="browser-app" style="height:100%;display:flex;flex-direction:column;background:#141a20;">
        <div class="browser-toolbar" style="display:flex;gap:8px;padding:8px 12px;border-bottom:1px solid #2a343e;background:#1a222a;align-items:center;">
          <button id="browser-back"><i class="fas fa-arrow-left"></i></button>
          <button id="browser-forward"><i class="fas fa-arrow-right"></i></button>
          <button id="browser-refresh"><i class="fas fa-sync"></i></button>
          <input class="browser-url" id="browser-url" value="about:larp" style="flex:1;background:#0d1117;border:1px solid #2a343e;border-radius:20px;padding:4px 16px;color:#c8dae6;font-size:0.75rem;outline:none;" />
          <button id="browser-bookmark"><i class="fas fa-star"></i></button>
          <button id="browser-home"><i class="fas fa-home"></i></button>
        </div>
        <div class="browser-content" id="browser-content" style="flex:1;padding:16px;overflow-y:auto;">
          <div id="browser-page"></div>
        </div>
      </div>
    `;

    this.container = container;
    this.urlInput = container.querySelector('#browser-url');
    this.content = container.querySelector('#browser-content');
    this.pageContainer = container.querySelector('#browser-page');

    //toolbar
    container.querySelector('#browser-back').addEventListener('click', () => this.goBack());
    container.querySelector('#browser-forward').addEventListener('click', () => this.goForward());
    container.querySelector('#browser-refresh').addEventListener('click', () => this.refresh());
    container.querySelector('#browser-home').addEventListener('click', () => this.goHome());
    container.querySelector('#browser-bookmark').addEventListener('click', () => this.bookmarkPage());

    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = this.urlInput.value.trim();

        if (value.startsWith('http://') || value.startsWith('https://')) {
          this.navigate(value);
        } else if (value.includes('youtube') || value.includes('youtu.be') || value.includes('youtube.com')) {
          this.loadRickroll();  
        } else if (value.includes('.')) {
          this.navigate(value);
        } else {
          this.search(value);
        }
      }
    });

    //homepage
    this.currentUrl = 'about:larp';
    this.navigate('about:larp');
  }

  //navigation
  navigate(url) {
    this.currentUrl = url;
    this.urlInput.value = url;
    this.loadPage(url);
  }

  loadPage(url) {
    let content = '';
    let title = 'LARP Browser';

    if (url === 'about:larp') {
      content = `
        <div style="text-align:center;padding:60px 20px;">
          <i class="fas fa-compass" style="font-size:4rem;color:#6a8a9e;"></i>
          <h2 style="color:#d4e2ed;font-weight:300;margin-top:16px;">LARP Browser</h2>
          <p style="color:#6a7a84;">Enter a URL or click a bookmark</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
            ${Object.keys(this.sites).map(s => `
              <div style="background:#1a222a;border:1px solid #2a343e;border-radius:8px;padding:12px 20px;cursor:pointer;transition:0.1s;" onclick="window.__larp_browser_navigate('${s}')">
                <h4 style="color:#d4e2ed;">${s}</h4>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (this.sites[url]) {
      content = this.sites[url].content;
      title = this.sites[url].title;
    } else {
      content = `
        <div style="text-align:center;padding:60px 20px;">
          <i class="fas fa-exclamation-triangle" style="font-size:4rem;color:#f5c542;"></i>
          <h2 style="color:#d4e2ed;font-weight:300;margin-top:16px;">Site not found</h2>
          <p style="color:#6a7a84;">${url} is not a known LARP site</p>
          <p style="color:#6a7a84;font-size:0.7rem;margin-top:8px;">Try: asan.larp, hackoverflow.larp, 1337news.larp</p>
        </div>
      `;
    }

    this.pageContainer.innerHTML = content;
    this.currentTitle = title;
  }

  //search
  search(query) {
    if (query.toLowerCase().includes('youtube')) {
      this.loadRickroll();
    } else {
      this.pageContainer.innerHTML = `
        <div style="text-align:center;padding:60px 20px;">
          <i class="fas fa-search" style="font-size:4rem;color:#6a8a9e;"></i>
          <h2 style="color:#d4e2ed;font-weight:300;margin-top:16px;">Search: "${query}"</h2>
          <p style="color:#6a7a84;">No results found in LARPiverse.</p>
          <p style="color:#6a7a84;font-size:0.7rem;margin-top:8px;">Try searching for "youtube" to get Rickrolled.</p>
        </div>
      `;
    }
  }

  //rickroll
  loadRickroll() {
    this.pageContainer.innerHTML = `
      <div style="padding:20px;text-align:center;">
        <h2 style="color:#f5c542;margin-bottom:16px;">🎵 You've been Rickrolled!</h2>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;background:#000;border-radius:8px;">
          <video style="position:absolute;top:0;left:0;width:100%;height:100%;" controls autoplay>
            <source src="assets/video/rickroll.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <p style="color:#6a7a84;margin-top:12px;">XD</p>
      </div>
    `;
    this.currentUrl = 'youtube-rickroll';
    this.urlInput.value = 'youtube-rickroll';
    if (this.appManager) {
      this.appManager.launch('music');
    }
  }

  // nevigation
  goBack() {
    this.refresh(); 
  }

  goForward() {
    this.refresh();
  }

  refresh() {
    this.loadPage(this.currentUrl);
  }

  goHome() {
    this.navigate('about:larp');
  }

  bookmarkPage() {
    if (this.currentUrl && this.currentUrl !== 'about:larp') {
      if (!this.bookmarks.includes(this.currentUrl)) {
        this.bookmarks.push(this.currentUrl);
        alert(`Bookmarked: ${this.currentUrl}`);
      }
    }
  }
}

window.__larp_browser_navigate = (url) => {
  const app = document.querySelector('.browser-app');
  if (app) {
    const urlInput = app.querySelector('#browser-url');
    if (urlInput) {
      urlInput.value = url;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      urlInput.dispatchEvent(event);
    }
  }
};
# LarpOS
**MacOS elegance +linux functionality + hacker terminal culture + absurd internet memes.**

A fully functional broswer based OS. Build with JavaScript,CSS and HTML.
|Probably Legal. Probably

## Features
**Desktop Shell**
- Fully draggable, resizable windows with minimize/maximize/close.
- Translucent top bar with system indicators (WiFi,Volume,Battery,clock).
- MacOS style dock.

## Boot Sequence
- Animated terminal style boot with BIOS messages.
- Progress bar that fills step by step(its just an animation nothing much).
- Skip button for impatient users.

## Terminal
- 25+ commands which you can see using ' help ' in the terminal and try to use
```Sudo rm -rf /```
- Command history with arrow key navigation.
- ANSI like styling with colored prompts.

## File manager
- Things will be added later into it as of now its just a window.

## DeadDrop Note
- Create,edit and delete notes.
- Auto saves to virtual system.
- Markdown support in content.
- Notes persist through restarts.

## LARP Music
- Single track player with play/pause and progress bar.
- Comes pre loaded with my favourit alarm mp3 file. (i'm not kidding this is my alarm).

## LARP Browser
- Address bar,back/forward/refresh/home buttons
- 6 pre built website:
1. Advanced space aganecy of nothing(try to read it backward).
```asan.larp``` 
2. Stack overflow parody.
```hackoverflow.larp```
3. Fake hacker news.
```1337news.larp```
4. Fictional marketplace
```darkweb.larp```
5. Anonymous paste site.
```catbin.larp```
6. Fake social network.
```larp.social```
- Ester egg 
```youtube```

## Settings
- Change wallpaper and colours.
- Adjust dock position and auto hide (not working)
- Terminal font and size settings
- Toggle boot animation
- Settings persists in virtual filesystem

## System Montior (proc://)
- Real time CPU,RAM,Uptime,Threat level(threat level in random).
- Process list with dynamic data.
- Threat level changes colour based severity.

## Calculator
- Arthmetic,decimals,percentages.
- Full keyboard support.
- Calculation history(visual).

# Link 
```https://larp-os-r9so.vercel.app```

## 📁 Project Structure

```text
larp-os/
├── index.html
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── main.js             # Entry point
│   ├── boot.js             # Boot sequence
│   ├── desktop.js          # Desktop shell
│   ├── windowManager.js    # Window controls
│   ├── appManager.js      # App lifecycle
│   ├── filesystem.js      # Virtual filesystem
│   └── apps/
│       ├── terminal.js     # Terminal app
│       ├── files.js        # File Manager
│       ├── notes.js        # DeadDrop Notes
│       ├── music.js        # LARP Music
│       ├── settings.js     # LARP Control Center
│       ├── calculator.js   # Calculator
│       ├── monitor.js      # System Monitor
│       └── browser.js      # LARP Browser
└── assets/
    ├── audio/
    │   └── chicken_scream.mp3
    ├── video/
    │   └── rickroll.mp4
    └── wallpapers/
        └── (only one image is there)
```
## Ester Eggs
- Type ```coffee``` in terminal- brews virtual coffee.
- Search "youtube" in browser - loads the rickroll video+music.
- CLick LARP logo - opens the shutdown menu.
### Many more if i'll all what you will do.

## Credits
- Build with ❤️ and too much coffee by @bhavyavashisth
- Icons by Font Awesome
- Inspired by macOS,Linux,Hacker Culture and the beautiful chaos of internet memes

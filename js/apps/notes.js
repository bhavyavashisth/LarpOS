// js/apps/notes.js - Notes application
export default class NotesApp {
  constructor(fs) {
    this.fs = fs;
    this.notes = [];
    this.currentNote = null;
    this.loadNotes();
  }

  loadNotes() {
    // Load from virtual filesystem
    const notesDir = '/home/larp/Documents/notes';
    if (!this.fs.resolvePath(notesDir)) {
      this.fs.mkdir(notesDir);
    }
    
    const files = this.fs.listDir(notesDir) || [];
    this.notes = files
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        id: f,
        title: f.replace('.md', ''),
        content: this.fs.readFile(notesDir + '/' + f) || ''
      }));

    if (this.notes.length === 0) {
      this.notes.push({
        id: 'welcome.md',
        title: 'Welcome',
        content: '# Welcome to DeadDrop Notes\n\nStart writing your notes here.'
      });
      this.saveNote(this.notes[0]);
    }
  }

  saveNote(note) {
    const path = '/home/larp/Documents/notes/' + note.id;
    this.fs.writeFile(path, note.content);
    // Ensure the file exists in FS
    if (!this.fs.resolvePath(path)) {
      this.fs.touch(path);
      this.fs.writeFile(path, note.content);
    }
  }

  render(container) {
    container.innerHTML = `
      <div class="notes-app" style="height:100%;display:flex;background:#141a20;">
        <div class="notes-sidebar" style="width:200px;background:#1a222a;border-right:1px solid #2a343e;padding:12px;overflow-y:auto;">
          <button id="notes-new" style="width:100%;padding:8px;background:#2a3a48;border:none;border-radius:6px;color:#d4e2ed;cursor:pointer;margin-bottom:12px;">
            <i class="fas fa-plus"></i> New Note
          </button>
          <ul class="notes-list" id="notes-list"></ul>
        </div>
        <div class="notes-editor" style="flex:1;display:flex;flex-direction:column;padding:12px;">
          <input id="notes-title" style="background:transparent;border:none;color:#d4e2ed;font-size:1.2rem;font-weight:500;padding:8px;outline:none;" placeholder="Note title" />
          <textarea id="notes-content" style="flex:1;background:#0d1117;border:1px solid #2a343e;border-radius:8px;color:#c8dae6;padding:12px;font-family:inherit;font-size:0.85rem;resize:none;outline:none;margin-top:8px;" placeholder="Write your note here..."></textarea>
        </div>
      </div>
    `;

    this.notesList = container.querySelector('#notes-list');
    this.titleInput = container.querySelector('#notes-title');
    this.contentInput = container.querySelector('#notes-content');
    this.container = container;

    this.renderNotesList();

    if (this.notes.length > 0) {
      this.selectNote(this.notes[0]);
    }

    container.querySelector('#notes-new').addEventListener('click', () => {
      const title = prompt('Note title:');
      if (title) {
        const id = title.toLowerCase().replace(/\s+/g, '-') + '.md';
        const note = { id, title, content: '# ' + title + '\n\nStart writing...' };
        this.notes.push(note);
        this.saveNote(note);
        this.renderNotesList();
        this.selectNote(note);
      }
    });

    let saveTimeout;
    this.contentInput.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        if (this.currentNote) {
          this.currentNote.content = this.contentInput.value;
          this.saveNote(this.currentNote);
        }
      }, 500);
    });

    this.titleInput.addEventListener('change', () => {
      if (this.currentNote) {
        this.currentNote.title = this.titleInput.value;
        this.currentNote.id = this.titleInput.value.toLowerCase().replace(/\s+/g, '-') + '.md';
        this.saveNote(this.currentNote);
        this.renderNotesList();
      }
    });
  }

  renderNotesList() {
    this.notesList.innerHTML = '';
    this.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note.title;
      li.dataset.id = note.id;
      if (this.currentNote && this.currentNote.id === note.id) {
        li.className = 'active';
      }
      li.addEventListener('click', () => this.selectNote(note));
      this.notesList.appendChild(li);
    });
  }

  selectNote(note) {
    this.currentNote = note;
    this.titleInput.value = note.title;
    this.contentInput.value = note.content;
    this.renderNotesList();
  }
}
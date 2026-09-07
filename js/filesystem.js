
export default class FileSystem {
  constructor() {
    this.root = {
      type: 'folder',
      name: '/',
      children: {
        home: {
          type: 'folder',
          name: 'home',
          children: {
            larp: {
              type: 'folder',
              name: 'larp',
              children: {
                Desktop: { type: 'folder', name: 'Desktop', children: {} },
                Documents: { type: 'folder', name: 'Documents', children: {} },
                Downloads: { type: 'folder', name: 'Downloads', children: {} },
                Music: { type: 'folder', name: 'Music', children: {} },
                secrets: {
                  type: 'folder',
                  name: 'secrets',
                  children: {
                    'readme.txt': { type: 'file', name: 'readme.txt', content: 'You found the secrets folder!' }
                  }
                }
              }
            }
          }
        },
        etc: { type: 'folder', name: 'etc', children: {} },
        tmp: { type: 'folder', name: 'tmp', children: {} },
        usr: { type: 'folder', name: 'usr', children: {} },
        classified: {
          type: 'folder',
          name: 'classified',
          children: {
            ASAN: { type: 'folder', name: 'ASAN', children: {} },
            important_stuff: { type: 'folder', name: 'important_stuff', children: {} },
            'definitely_not_illegal': { type: 'folder', name: 'definitely_not_illegal', children: {} }
          }
        }
      }
    };
    this.cwd = '/home/larp';
  }

  resolvePath(path) {
    if (path === '') return this.root;
    if (path.startsWith('/')) {
      let parts = path.split('/').filter(p => p !== '');
      let current = this.root;
      for (const part of parts) {
        if (part === '..') {
        
          return this.root;
        }
        if (current.children && current.children[part]) {
          current = current.children[part];
        } else {
          return null;
        }
      }
      return current;
    }
    // cwd path
    let parts = path.split('/').filter(p => p !== '');
    let current = this.getNode(this.cwd);
    for (const part of parts) {
      if (part === '..') {
        //root
        return this.root;
      }
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  }

  getNode(path) {
    return this.resolvePath(path);
  }

  readFile(path) {
    const node = this.resolvePath(path);
    if (node && node.type === 'file') {
      return node.content || '';
    }
    return null;
  }

  writeFile(path, content) {
    const node = this.resolvePath(path);
    if (node && node.type === 'file') {
      node.content = content;
      return true;
    }
    return false;
  }

  listDir(path) {
    const node = this.resolvePath(path || this.cwd);
    if (node && node.type === 'folder') {
      return Object.keys(node.children);
    }
    return null;
  }

  mkdir(path) {
    const parts = path.split('/').filter(p => p !== '');
    const name = parts.pop();
    const parentPath = parts.join('/') || '/';
    const parent = this.resolvePath(parentPath);
    if (parent && parent.type === 'folder' && !parent.children[name]) {
      parent.children[name] = { type: 'folder', name, children: {} };
      return true;
    }
    return false;
  }

  touch(path) {
    const parts = path.split('/').filter(p => p !== '');
    const name = parts.pop();
    const parentPath = parts.join('/') || '/';
    const parent = this.resolvePath(parentPath);
    if (parent && parent.type === 'folder' && !parent.children[name]) {
      parent.children[name] = { type: 'file', name, content: '' };
      return true;
    }
    return false;
  }

  getCwd() {
    return this.cwd;
  }

  cd(path) {
    if (path === '..') {
      const parts = this.cwd.split('/').filter(p => p !== '');
      parts.pop();
      this.cwd = '/' + parts.join('/');
      if (this.cwd === '') this.cwd = '/';
      return true;
    }
    const node = this.resolvePath(path);
    if (node && node.type === 'folder') {
      if (path.startsWith('/')) {
        this.cwd = path;
      } else {
        this.cwd = this.cwd + '/' + path;
      }
      return true;
    }
    return false;
  }
}
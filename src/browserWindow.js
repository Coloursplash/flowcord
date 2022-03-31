const { join } = require('path');
const { BrowserWindow } = require('electron');

class PatchedBrowserWindow extends BrowserWindow {
  constructor (opts) {
    let originalPreload;
    opts.webPreferences.preload = join(__dirname, './preload.js');

    const win = new BrowserWindow(opts);

    win.webContents._originalPreload = originalPreload;
    return win;
  }
}

module.exports = PatchedBrowserWindow;

const { join } = require('path');
const { BrowserWindow } = require('electron');

let settings = {};
let transparency = false;
let ewp = false;
try {
  settings = require(join(__dirname, '../settings/pc-general.json'));
  transparency = settings.transparentWindow;
  ewp = settings.experimentalWebPlatform;
} catch (e) {}

class PatchedBrowserWindow extends BrowserWindow {
  // noinspection JSAnnotator - Make JetBrains happy
  constructor (opts) {
    let originalPreload;
    opts.webPreferences.preload = join(__dirname, './preload.js');

    const win = new BrowserWindow(opts);

    win.webContents._originalPreload = originalPreload;
    return win;
  }
}

module.exports = PatchedBrowserWindow;

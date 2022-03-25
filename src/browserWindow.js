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
    if (opts.webContents) {
      // General purpose popouts used by Discord
    } else if (opts.webPreferences && opts.webPreferences.nodeIntegration) {
      // Splash Screen
      // opts.webPreferences.preload = join(__dirname, './preloadSplash.js');
    } else if (opts.webPreferences && opts.webPreferences.offscreen) {
      // Overlay
      originalPreload = opts.webPreferences.preload;
      // opts.webPreferences.preload = join(__dirname, './preload.js');
    } else if (opts.webPreferences && opts.webPreferences.preload) {
      originalPreload = opts.webPreferences.preload;
      if (opts.webPreferences.nativeWindowOpen) {
        // Discord Client
        opts.webPreferences.preload = join(__dirname, './preload.js');
        // opts.webPreferences.contextIsolation = false; // shrug
      } else {
        // Splash Screen on macOS (Host 0.0.262+) & Windows (Host 0.0.293 / 1.0.17+)
        // opts.webPreferences.preload = join(__dirname, './preloadSplash.js');
      }
    }

    const win = new BrowserWindow(opts);

    win.webContents._powercordPreload = originalPreload;
    return win;
  }
}

module.exports = PatchedBrowserWindow;
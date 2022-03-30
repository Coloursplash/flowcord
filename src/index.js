const Module = require('module');
const { join, dirname } = require('path');
const electron = require("electron");

const PatchedBrowserWindow = require('./browserWindow');

const discordPath = join(dirname(require.main.filename), '..', 'app.asar');
require.main.filename = join(discordPath, 'app_bootstrap/index.js');
const discordPackage = require(join(discordPath, 'package.json'));

if (!process.argv.includes('--vanilla')) {
  console.log('Hello from Powercord!');
  
  // Reassign electron using proxy to avoid the onReady issue, thanks Powercord!
  const newElectron = new Proxy(electron, {
    get(target, prop) {
      switch (prop) {
        case 'BrowserWindow':
          return PatchedBrowserWindow;
          default:
            return target[prop];
          }
        }
      });
      const electronPath = require.resolve("electron");
      delete require.cache[electronPath].exports; // If it didn't work, try to delete existing
      require.cache[electronPath].exports = newElectron; // Try to assign again after deleting

      electron.app.setAppPath(discordPath);
      electron.app.name = discordPackage.name;
}

// Use Discord's info to run the app
if (process.platform == "win32" || process.platform == "darwin") {
  const basePath = join(electron.app.getAppPath(), "..", "app.asar");
  const pkg = __non_webpack_require__(path.join(basePath, "package.json"));
  electron.app.setAppPath(basePath);
  electron.app.name = pkg.name;
  Module._load(path.join(basePath, pkg.main), null, true);
}

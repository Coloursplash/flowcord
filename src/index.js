const Module = require('module');
const { join, dirname } = require('path');
const electron = require("electron");

const discordPath = join(dirname(require.main.filename), '..', 'app.asar');
require.main.filename = join(discordPath, 'app_bootstrap/index.js');
const discordPackage = require(join(discordPath, 'package.json'));

if (!process.argv.includes('--vanilla')) {
  console.log('Hello from Powercord!');
  
  const PatchedBrowserWindow = require('./browserWindow');
  
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

// Load Discord
console.log('Loading Discord');
Module._load(join(discordPath, discordPackage.main), null, true);

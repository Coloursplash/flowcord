console.log('[Flowcord] Loading Flowcord');

require('module').Module.globalPaths.push(join(__dirname, 'fake_node_modules'));

// Initialize Flowcord
const Flowcord = require('./modules/flowcord');
global.flowcord = new Flowcord();

// https://github.com/electron/electron/issues/9047
if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

setTimeout(() => DiscordNative.window.setDevtoolsCallbacks(null, null), 5e3);

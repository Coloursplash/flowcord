const { resolve } = require('path');

class PluginManager {
  constructor() {
    this.pluginDir = resolve(__dirname, '..', 'plugins');
    this.plugins = new Map();

    this.manifestKeys = ['name', 'version', 'description', 'author', 'license']
  }

  // Getters
  get(pluginID) {
    return this.plugins.get(pluginID);
  }

  getPlugins() {
    return self.plugins;
  }

  isInstalled(pluginID) {
    return this.plugins.has(pluginID);
  }

  isEnabled(pluginID) {
    return !flowcord.settings.get('disabledPlugins').includs(pluginID);
  }

  mount(pluginID) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: [],
      }, require(resolve(this.pluginDir, pluginID, 'manifest.json')));
    } catch (e) {
      return console.error('%c[Flowcord:PluginManager]', `color: ${consoleColor}`, `Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);
    }

    if (!this.manifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return console.error('%c[Flowcord:PluginManager]', `color: ${consoleColor}`, `Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);
    }

    try {
      const PluginClass = require(resolve(this.pluginDir, pluginID));
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginID,
          set: () => {
            throw new Error('Plugins cannot update their ID at runtime!');
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error('Plugins cannot update manifest at runtime!');
          }
        }
      });
  
      this.plugins.set(pluginID, new PluginClass());
    } catch (e) {
      return console.error('%c[Flowcord:PluginManager]', `color: ${consoleColor}`, `An error occurred while initializing "${pluginID}"`);
    }
  }

  async remount (pluginID) {
    try {
      await this.unmount(pluginID);
    } catch (e) {
      // if this fails then you have fucked up big time
    }

    this.mount(pluginID);
    this.plugins.get(pluginID)._load();
  }

  async unmount(pluginID) {
    const plugin = this.plugins.get(pluginID)
    if (!plugin) {
      return console.error('%c[Flowcord:PluginManager]', `color: ${consoleColor}`, `Tried to unmount non-installed plugin "${pluginID}"`);
    }

    if (plugin.ready) {
      plugin._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(pluginID)) {
        delete require.cache[key];
      }
    });
    this.plugins.delete(pluginID);
  }
}

module.exports = PluginManager;
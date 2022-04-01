const { rmdirRf, readdirSync } = require('fs');
const { join } = require('path');

class PluginManager {
  constructor() {
    this.pluginDir = join(__dirname, '..', 'plugins');
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

  async mount(pluginID) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: [],
      }, require(resolve(this.pluginDir, pluginID, 'manifest.json')));
    } catch (e) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);
    }

    if (!this.manifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);
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
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `An error occurred while initializing "${pluginID}"`);
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
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to unmount non-installed plugin "${pluginID}"`);
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

  async load (pluginID) {
    const plugin = this.plugins.get(pluginID);
    if (!plugin) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to load non-installed plugin "${pluginID}"`);
    }
    if (plugin.ready) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to load already loaded plugin "${pluginID}"`);
    }

    plugin._load();
  }

  async unload (pluginID) {
    const plugin = this.plugins.get(pluginID);
    if (!plugin) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to unload non-installed plugin "${pluginID}"`);
    }
    if (plugin.ready) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to unload a non-loaded plugin "${pluginID}"`);
    }

    plugin._unload();
  }

  async enable (pluginID) {
    if (!this.get(pluginID)) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to enable a non installed plugin (${pluginID})`)
    }

    // TODO: add check for if it is disabled

    this.load(pluginID);
  }

  async disable (pluginID) {
    if (!this.get(pluginID)) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to disable a non installed plugin (${pluginID})`)
    }

    // TODO: add check for if it is disabled

    this.unload(pluginID);
  }

  async install (pluginID) {
    // TODO: create a plugin store then create the install function using this
    throw new Error('later');
  }

  async uninstall (pluginID) {
    if (pluginID.startsWith('fc-')) {
      return console.error('%c[Flowcord:PluginManager]', 'color: #4682b4', `Tried to uninstall an internal plugin "${pluginID}"`)
    }

    await this.unmount(pluginID);
    await rmdirRf(resolve(this.pluginDir, pluginID));
  }

  startPlugins () {
    readdirSync(this.pluginDir).forEach(filename => {if (!this.isInstalled(filename)) {this.mount(filename)}});
    for (const plugin of [ ...this.plugins.values() ]) {
      // TODO: add check for if it is disabled

      if (!this.get(plugin.entityID).ready) {
        this.load(plugin.entityID);
      }
    }
  }

  shutdownPlugins () {
    this._bulkUnload([ ...this.plugins.keys() ]);
  }

  async _bulkUnload (plugins) {
    let nextPlugins = [];
    for (const plugin of plugins) {
      const deps = this.get(plugin).allDependencies;
      if (deps.filter(dep => this.get(dep) && this.get(dep).ready).length !== 0) {
        nextPlugins.push(plugin);
      } else {
        await this.unmount(plugin);
      }

      if (nextPlugins.length !== 0) {
        await this._bulkUnload(nextPlugins);
      }
    }
  }
}

module.exports = PluginManager;
const { resolve } = require('path');
const Flowcord = require('..');

class PluginManager {
  constructor () {
    this.pluginDir = resolve(__dirname, '..', 'plugins');
    this.plugins = new Map();

    this.manifestKeys = ['name', 'version', 'description', 'author', 'license']
  }

  // Getters
  get (pluginID) {
    return this.plugins.get(pluginID);
  }

  getPlugins () {
    return self.plugins;
  }

  isInstalled (pluginID) {
    return this.plugins.has(pluginID);
  }

  isEnabled (pluginID) {
    return !flowcord.settings.get('disabledPlugins').includs(pluginID);
  }
}

module.exports = PluginManager;

const {
  join
} = require('path');
const PluginManager = require('./managers/plugins');

/**
 * @property { SettingsAPI } settings
 * 
 * @type {Flowcord}
 * @property {PluginManager} pluginManager
 */
class Flowcord extends Updatable {
  constructor() {
    super(join(__dirname, '..', '..'), '', 'flowcord');

    this.pluginManager = new PluginManager();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }

    this.initialized = false;
  }

  async init() {
    await this.startup();
  }

  async startup() {
    this.pluginManager.startPlugins();

    this.initialized = true;
  }

  async shutdown() {
    this.initialized = false;
  }
}

module.exports = Flowcord;
const { join } = require('path');
const PluginManager = require('./managers/plugins');
const APIManager = require('./managers/apis');

/**
 * @property { SettingsAPI } settings
 * 
 * @type {Flowcord}
 * @property {PluginManager} pluginManager
 * @property {APIManager} apiManager
 */
class Flowcord extends Updatable {
  constructor() {
    super(join(__dirname, '..', '..'), '', 'flowcord');

    this.api = {}
    this.pluginManager = new PluginManager();
    this.apiManager = new APIManager();

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
    // APIs
    this.apiManager.startAPIs();

    // Plugins
    this.pluginManager.startPlugins();

    this.initialized = true;
  }

  async shutdown() {
    this.initialized = false;
  }
}

module.exports = Flowcord;
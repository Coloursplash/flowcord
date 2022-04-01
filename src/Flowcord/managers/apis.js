const { readdirSync, statSync } = require('fs');
const { join } = require('path');

class APIManager {
  constructor () {
    this.apiDir = join(__dirname, '..', 'apis');
    this.apis = [];
  }

  mount (api) {
    try {
      const APIClass = require(join(this.apiDir, api));
      api = api.replace(/\.js$/, '');
      flowcord.apis[api] = new APIClass();
      this.apis.push(api);
    } catch (e) {
      console.error('%c[Flowcord:API]', 'color: #4682b4', 'An error occurred while initializing api "${api}"', e);
    }
  }

  async load () {
    for (const api of this.apis) {
      await flowcord.apis[api]._load();
    }
  }

  async unload () {
    for (const api of this.apis) {
      await flowcord.apis[api]._unload();
    }
  }

  async startAPIs () {
    this.apis = [];
    readdirSync(this.apiDir)
      .filter(f => statSync(join(this.apiDir, f)).isFile())
      .forEach(filename => this.mount(filename));
    await this.load();
  }
}

module.exports = APIManager;

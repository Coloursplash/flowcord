const { Plugin } = require('flowcord/entities');

class Test extends Plugin {
  async startPlugin () {
    this.log('HEY IT WORKED');
  }
}
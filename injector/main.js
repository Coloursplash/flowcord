const { existsSync } = require('fs');
const { InjectorMessages } = require('./i18n');

const inject = (discordType, { getAppDir }) => {
  const appDir = getAppDir(discordType);
  const appDir = getAppDir(discordType);
  if (existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_INSTALLED);
    return false;
  }
}

const uninject = (discordType, { getAppDir }) => {
  const appDir = getAppDir(discordType);
  if (!existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_UNINSTALLED);
    return false;
  }
}

module.exports = { inject, uninject };

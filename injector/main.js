const { existsSync, mkdir, writeFile } = require('fs');
const { join } = require('path');
const { InjectorMessages } = require('./i18n');

const inject = (discordType, { getAppDir }) => {
  const appDir = getAppDir(discordType);
  const appDir = getAppDir(discordType);
  if (existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_INSTALLED);
    return false;
  }

  await mkdir(appDir);
  writeFile(
    join(appDir, 'index.js'),
    `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../src/index.js\`)`
  )
  console.log(InjectorMessages.WRITE_INDEX_SUCCESS);
  
  writeFile(
    join(appDir, 'package.json'),
    JSON.stringify({
      name: 'flowcord', // TODO: try with name as flowcord and discord to see which work
      main: 'index.js'
    })
  )
  console.log(InjectorMessages.WRITE_PACKAGE_SUCCESS);

  console.log('');

  return true;
}

const uninject = (discordType, { getAppDir }) => {
  const appDir = getAppDir(discordType);
  if (!existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_UNINSTALLED);
    return false;
  }

  rmdirRf(appDir);

  return true;
}

const { existsSync } = require('fs');
const { readdir, lstat, unlink, rmdir } = require('fs').promises;

const rmdirRf = (path) => {
  if (existsSync(path)) {
    const files = await readdir(path);
    for (const file of files) {
      const curPath = `${path}/${file}`;
      const stat = await lstat(curPath);

      if (stat.isDirectory()) {
        await rmdirRf(curPath);
      } else {
        await unlink(curPath);
      }
    }
    await rmdir(path);
  }
};

module.exports = { inject, uninject };

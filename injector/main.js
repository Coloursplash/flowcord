/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

const {
  existsSync
} = require('fs');
const {
  mkdir,
  writeFile,
  readdir,
  lstat,
  unlink,
  rmdir
} = require('fs').promises;
const {
  join,
  sep
} = require('path');
const {
  InjectorMessages
} = require('./i18n');

exports.inject = async (discordType, {
  getAppDir
}) => {
  const appDir = await getAppDir(discordType);
  if (existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_INSTALLED);
    return false;
  }

  await mkdir(appDir);
  await Promise.all([writeFile(
      join(appDir, 'index.js'),
      `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../src/index.js\`)`),
    console.log(InjectorMessages.WRITE_INDEX_SUCCESS),
    writeFile(
      join(appDir, 'package.json'),
      JSON.stringify({
        main: 'index.js',
        name: 'discord'
      })),
    console.log(InjectorMessages.WRITE_PACKAGE_SUCCESS)
  ]);

  console.log('');

  return true;
}

exports.uninject = async (discordType, {
  getAppDir
}) => {
  const appDir = await getAppDir(discordType);

  if (!existsSync(appDir)) {
    console.log(InjectorMessages.INJECTOR_ALREADY_UNINSTALLED);
    return false;
  }

  await rmdirRf(appDir);
  return true;
}

const rmdirRf = async (path) => {
  if (existsSync(path)) {
    const files = await readdir(path);
    for (const file of files) {
      const curPath = `${path}/${file}`;
      const stat = await lstat(curPath);

      if (stat.isDirectory()) {
        rmdirRf(curPath);
      } else {
        unlink(curPath);
      }
    }
    rmdir(path);
  }
}
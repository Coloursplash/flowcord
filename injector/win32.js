const { readdir } = require('fs').promises;
const { join } = require('path');

exports.getAppDir = async (discordType) => {
  const discordPath = join(process.env.LOCALAPPDATA, discordType);
  const discordDirectory = await readdir(discordPath);

  const currentBuild = discordDirectory
    .filter(path => path.startsWith('app-'))
    .reverse()[0];

  return join(discordPath, currentBuild, 'resources', 'app');
};

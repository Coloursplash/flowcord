const {
  existsSync
} = require('fs');
const {
  execSync
} = require('child_process');
const readline = require('readline');
const {
  InjectorMessages
} = require('./i18n');
const {
  join
} = require('path');

// This is to ensure the homedir we get is the actual user's homedir instead of root's homedir
const homedir = execSync('grep $(logname) /etc/passwd | cut -d ":" -f6').toString().trim();

const knownLinuxPaths = Object.freeze([
  '/usr/share/discord',
  '/usr/lib64/discord',
  '/opt/discord',
  '/opt/Discord',
  `${homedir}/.local/bin/Discord`
]);

const knownLinuxCanaryPaths = Object.freeze([
  '/usr/share/discord-canary',
  '/usr/lib64/discord-canary',
  '/opt/discord-canary',
  '/opt/DiscordCanary',
  `${homedir}/.local/bin/DiscordCanary`
]);

const knownLinuxPTBPaths = Object.freeze([
  '/usr/share/discord-ptb',
  '/usr/lib64/discord'-ptb,
  '/opt/discord-ptb',
  '/opt/DiscordPTB',
  `${homedir}/.local/bin/DiscordPTB`
]);

exports.getAppDir = async (discordType) => {
  if (discordType === 'DiscordCanary') {
    const discordProcess = execSync('ps x')
      .toString()
      .split('\n')
      .map(s => s.split(' ').filter(Boolean))
      .find(p => p[4] && (/discord-?canary$/i).test(p[4]) && p.includes('--type=renderer'));

    if (!discordProcess) {
      let discordPath = knownLinuxCanaryPaths.find(path => existsSync(path));
      if (!discordPath) {
        const readlineInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const askPath = () => new Promise(resolve => readlineInterface.question('> ', resolve));
        console.log(InjectorMessages.LINUX_FAILED_FIND_INSTALL);
        discordPath = await askPath();
        readlineInterface.close();

        if (!existsSync(discordPath)) {
          console.log('');
          console.log(InjectorMessages.INJECT_FAILED);
          console.log(InjectorMessages.LINUX_INVALID_PATH);
          process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
        }
      }

      return join(discordPath, 'resources', 'app');
    }

    const discordPath = discordProcess[4].split('/');
    discordPath.splice(discordPath.length - 1, 1);
    return join('/', ...discordPath, 'resources', 'app');
  } else if (discordType === 'Discord') {
    const discordProcess = execSync('ps x')
      .toString()
      .split('\n')
      .map(s => s.split(' ').filter(Boolean))
      .find(p => p[4] && (/discord$/i).test(p[4]) && p.includes('--type=renderer')); // TODO: find name of discord process

    if (!discordProcess) {
      let discordPath = knownLinuxPaths.find(path => existsSync(path));
      if (!discordPath) {
        const readlineInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const askPath = () => new Promise(resolve => readlineInterface.question('> ', resolve));
        console.log(InjectorMessages.LINUX_FAILED_FIND_INSTALL);
        discordPath = await askPath();
        readlineInterface.close();

        if (!existsSync(discordPath)) {
          console.log('');
          console.log(InjectorMessages.INJECT_FAILED);
          console.log(InjectorMessages.LINUX_INVALID_PATH);
          process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
        }
      }

      return join(discordPath, 'resources', 'app');
    }

    const discordPath = discordProcess[4].split('/');
    discordPath.splice(discordPath.length - 1, 1);
    return join('/', ...discordPath, 'resources', 'app');
  } else if (discordType === 'DiscordPTB') {
    const discordProcess = execSync('ps x')
      .toString()
      .split('\n')
      .map(s => s.split(' ').filter(Boolean))
      .find(p => p[4] && (/discord-ptb$/i).test(p[4]) && p.includes('--type=renderer')); // TODO: find name of discord-ptb process

    if (!discordProcess) {
      let discordPath = knownLinuxPTBPaths.find(path => existsSync(path));
      if (!discordPath) {
        const readlineInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const askPath = () => new Promise(resolve => readlineInterface.question('> ', resolve));
        console.log(InjectorMessages.LINUX_FAILED_FIND_INSTALL);
        discordPath = await askPath();
        readlineInterface.close();

        if (!existsSync(discordPath)) {
          console.log('');
          console.log(InjectorMessages.INJECT_FAILED);
          console.log(InjectorMessages.LINUX_INVALID_PATH);
          process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
        }
      }

      return join(discordPath, 'resources', 'app');
    }

    const discordPath = discordProcess[4].split('/');
    discordPath.splice(discordPath.length - 1, 1);
    return join('/', ...discordPath, 'resources', 'app');
  }
}

require('./elevate');
require('./env_check')(); // Perform checks

const {
  InjectorMessages
} = require('./i18n');
const main = require('./main');
const readline = require('readline');

let platformModule;
try {
  platformModule = require(`./${process.platform}`);
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(process.argv[2] === 'inject' ? InjectorMessages.INJECT_FAILED : InjectorMessages.UNINJECT_FAILED, '\n');
    console.log(InjectorMessages.UNSUPPORTED_PLATFORM);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }
}

(async () => {
  // Discord type
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  console.log(process.argv[2] === 'inject' ? InjectorMessages.INJECT_VERSION : InjectorMessages.UNINJECT_VERSION);
  console.log('1. Discord');
  console.log('2. Discord Canary');
  console.log('3. DiscordPTB');
  const askDiscordType = () => new Promise(resolve => readlineInterface.question('> ', resolve));
  discordType = await askDiscordType();
  readlineInterface.close();

  switch (discordType) {
    case '1':
      discordType = 'Discord';
      break;
    case '2':
      discordType = 'DiscordCanary';
      break;
    case '3':
      discordType = 'DiscordPTB';
      break;
    default:
      console.log(InjectorMessages.INVALID_DISCORD_INSTALLATION);
      process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  };

  console.log('');

  if (process.argv[2] === 'inject') {
    if (await main.inject(discordType, platformModule)) {
      console.log(InjectorMessages.INJECT_SUCCESS);
    }
  } else if (process.argv[2] === 'uninject') {
    if (await main.uninject(discordType, platformModule)) {
      console.log(InjectorMessages.UNINJECT_SUCCESS);
    }
  } else {
    console.log(InjectorMessages.UNSUPPORTED_ARGUMENT);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }
})().catch(err => {
  if (err.code === 'EACCES') {
    console.log(process.argv[2] === 'inject' ? InjectorMessages.INJECT_FAILED : InjectorMessages.UNINJECT_FAILED, '\n');
    console.log(InjectorMessages.MISSING_PERMISSIONS);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  } else {
    console.log('Something interesting happened', err);
  }
});

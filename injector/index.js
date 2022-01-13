const {
  InjectorMessages
} = require('./i18n');
const readline = require('readline');

try {
  const platformModule = require(`./${process.platform}.js`);
  // win32 currently supported
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(process.argv[2] === 'inject' ? InjectorMessages.INJECT_FAILED : InjectorMessages.UNINJECT_FAILED, '\n');
    console.log(InjectorMessages.UNSUPPORTED_PLATFORM);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }
}

// Discord version
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
var discordType
console.log(process.argv[2] === 'inject' ? 'Which version of Discord should Flowcord inject into?' : 'Which version of Discord should Flowcord uninject into?');

const discordType = () => new Promise(resolve => readlineInterface.question('> ', resolve));
console.log('1. Discord');
console.log('2. Discord Canary');
console.log('3. DiscordPTB');
await discordType();
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
    console.log('Invalid Discord installation');
    console.log('Make sure the Discord installation you enter is in the list AND installed on your computer.')
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
};
        
console.log('');

try {
  if (process.argv[2] === 'inject') {
    if (main.inject(discordType, platformModule)) {
      console.log(InjectorMessages.INJECT_SUCCESS);
    } else if (process.argv[2] === 'uninject') {
      if (main.uninject(discordType, platformModule)) {
        console.log(InjectorMessages.UNINJECT_SUCCESS);
      }
    } else {
      console.log(InjectorMessages.UNSUPPORTED_ARGUMENT);
    }
  }
} catch(err) {
  if (err.code === 'EACCES') {
    console.log(process.argv[2] === 'inject' ? InjectorMessages.INJECT_FAILED : InjectorMessages.UNINJECT_FAILED, '\n');
    console.log(InjectorMessages.MISSING_PERMISSIONS);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  } else {
    console.log('Something interesting happened', err);
  }
}
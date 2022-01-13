const AnsiEscapes = Object.freeze({
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m'
});

const InjectorMessages = Object.freeze({
  INJECT_FAILED: `${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to inject Flowcord :(${AnsiEscapes.RESET}`,
  INJECT_SUCCESS: `${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Flowcord has been successfully injected :D\nNow fully restart the Discord client through the system tray or task manager.${AnsiEscapes.RESET}`,
  INJECTOR_ALREADY_INSTALLED: `You already have an injector installed! Try uninjecting (\'npm run uninject\') then reinjecting.\n${AnsiEscapes.YELLOW}NOTE:${AnsiEscapes.RESET} If you already have BetterDiscord, Powercord or another client mod injected, Flowcord cannot run along with it!`,
  INJECTOR_ALREADY_UNINSTALLED: 'There is nothing to uninject, you are already running Discord without mods.',
  LINUX_FAILED_FIND_INSTALL: `${AnsiEscapes.YELLOW}Failed to locate Discord installation folder.${AnsiEscapes.RESET}\nPlease provide the path of your Discord installation folder.`,
  LINUX_INVALID_PATH: 'The path you provided is invalid.',
  MISSING_PERMISSIONS: 'Flowcord wasn\'t able to inject due to missing permissions.\nTry again with elevated permissions.',
  UNINJECT_FAILED: `${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to uninject Flowcord :(${AnsiEscapes.RESET}`,
  UNINJECT_SUCCESS: `${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Flowcord has been successfully uninjected.\n$Now fully restart the Discord client through the system tray or task manager.{AnsiEscapes.RESET}`,
  UNSUPPORTED_PLATFORM: `It seems like your platform is not supported yet.\nFeel free to open an issue about it so we can add support for it!\nMake sure you mention the platform you are on is "${process.platform}" in your issue.\nhttps://github.com/Coloursplash/flowcord/issues/new`,
  UNSUPPORTED_ARGUMENT: `Unsupported argument "${process.argv[2]}", exiting.`,
  WRITE_INDEX_SUCCESS: '✅ Wrote index.js.',
  WRITE_PACKAGE_SUCCESS: '✅ Wrote package.json'
});

module.exports = { InjectorMessages };

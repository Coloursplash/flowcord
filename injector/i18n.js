const AnsiEscapes = Object.freeze({
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m'
});

const InjectorMessages = Object.freeze({
  INJECT_SUCCESS: `${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Flowcord has been successfully injected :D\nNow fully restart the Discord client through the system tray or task manager.${AnsiEscapes.RESET}`,
  INJECT_FAILED: `${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to inject Flowcord :(${AnsiEscapes.RESET}`,
  UNINJECT_SUCCESS: `${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Flowcord has been successfully uninjected.\n$Now fully restart the Discord client through the system tray or task manager.{AnsiEscapes.RESET}`,
  UNINJECT_FAILED: `${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to uninject Flowcord :(${AnsiEscapes.RESET}`,
  UNSUPPORTED_PLATFORM: `It seems like your platform is not supported yet.\nFeel free to open an issue about it so we can add support for it!\nMake sure you mention the platform you are on is "${process.platform}" in your issue.\nhttps://github.com/Coloursplash/flowcord/issues/new`,
  MISSING_PERMISSIONS: 'Flowcord wasn\'t able to inject due to missing permissions.\nTry again with elevated permissions.',
  UNSUPPORTED_ARGUMENT: `Unsupported argument "${process.argv[2]}", exiting.`,
  INJECTOR_ALREADY_INSTALLED: `You already have an injector installed! Try uninjecting (\'npm run uninject\') then reinjecting.\n${AnsiEscapes.YELLOW}NOTE:${AnsiEscapes.RESET} If you already have BetterDiscord, Powercord or another client mod injected, Flowcord cannot run along with it!`,
  INJECTOR_ALREADY_UNINSTALLED: 'There is nothing to uninject, you are already running Discord without mods.'
});

module.exports = {
  AnsiEscapes,
  InjectorMessages
};

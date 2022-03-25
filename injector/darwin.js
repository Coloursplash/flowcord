exports.getAppDir = async (discordType) => {
  if (discordType === 'Discord') {
    return '/Applications/Discord.app/Contents/Resources/app';
  } else if (discordType === 'DiscordCanary') {
    return '/Applications/Discord Canary.app/Contents/Resources/app';
  } else if (discordType === 'DiscordPTB') {
    return '/Applications/Discord PTB.app/Contents/Resources/app';
  }
}

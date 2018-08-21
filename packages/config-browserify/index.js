const path = require('path');

module.exports = config => {
  config.defineGetter('directories', () => ({
    src: `${config.toRel(config.srcDir)}/`,
    featureDirectory: `${config.toRel(config.featureDir)}/`,
    projectDirectory: `${config.toRel(config.projectDir)}/`,
    foundationDirectory: `${config.toRel(config.foundationDir)}/`,
    buildDirectory: path.resolve(config.outputDir),
    themeBuildDirectory: path.resolve(config.themeWebsiteDir)
  }));

  config.defineGetter(
    'autoPrefixerBrowsers',
    () => config.get('autoPrefixerBrowsers') || ['last 2 versions', 'ie >= 10', 'Safari >= 9', 'iOS >= 8']
  );

  config.defineGetter('bundle', () => config.get('bundle'));
};

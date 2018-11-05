module.exports = (rootDir, contextDir) => [
  {
    pattern: '<currentProjectDir>',
    replacement: nconf => nconf.get('currentProjectDir')
  },
  {
    pattern: '<currentWebsite>',
    replacement: nconf => nconf.get('currentWebsite')
  },
  {
    pattern: '<foundationScriptsDir>',
    replacement: nconf => nconf.get('foundationScriptsDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<foundationDir>',
    replacement: nconf => nconf.get('foundationDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<featureDir>',
    replacement: nconf => nconf.get('featureDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<projectDir>',
    replacement: nconf => nconf.get('projectDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<srcDir>',
    replacement: nconf => nconf.get('srcDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<themesDir>',
    replacement: nconf => nconf.get('themesDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<websiteDir>',
    replacement: nconf => nconf.get('websiteDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<instanceDir>',
    replacement: nconf => (nconf.get('instanceDir') || nconf.get('outputDir')).replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<outputDir>',
    replacement: nconf => nconf.get('outputDir').replace(/^\.(\/|\\)/, '<rootDir>/')
  },
  {
    pattern: '<solutionPath>',
    replacement: nconf => `<rootDir>/${nconf.get('solutionName')}.sln`
  },
  {
    pattern: '<rootDir>',
    replacement: () => rootDir
  },
  {
    pattern: '<contextDir>',
    replacement: () => contextDir
  },
  {
    name: 'parent:value',
    pattern: /<([a-zA-Z\\-]*):(\w*)>/g,
    replacement: nconf => (matched, storeName, value) => nconf.stores[storeName].get(value)
  }
];

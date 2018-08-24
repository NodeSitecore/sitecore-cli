const buildWebpackConfig = require('./src/webpack/build');

module.exports = config => {
  config.defineGetter(
    'vueCli',
    () =>
      config.get('vueCli') || {
        scssMixinsPath: '',
        baseUrl: '/',
        entries: {
          bundle: ['<projectDir>/<currentWebsite>/code/Scripts/polyfills.js', '<projectDir>/<currentWebsite>/code/Scripts/entry.js']
        },
        alias: {
          '@Foundation': '<foundationScriptDir>',
          '@Feature': '<featureDir>',
          '@Project': '<projectDir>'
        }
      }
  );
  /**
   * config.buildVueConfig
   */
  config.defineMethod('buildVueConfig', vueConfig => buildWebpackConfig(config, vueConfig));
  /**
   * config.getJestModulesMapper
   */
  config.defineMethod('getJestModulesMapper', () => {
    const { alias = {} } = config.vueCli;

    return Object.keys(alias).reduce(
      (acc, key) => {
        const path = config.resolve(alias[key]);

        acc[`^${key}(.*)$`] = `${path}$1`;

        return acc;
      },
      {
        '^@/(.*)$': `${config.srcDir.replace(config.rootDir, '<rootDir>')}/$1`
      }
    );
  });
};

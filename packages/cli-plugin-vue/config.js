const buildWebpackConfig = require('./src/webpack/build');

module.exports = config => {
  config.defineGetter('vueCli', () =>
    config.resolve({
      outputDir: '<themesDir>/<currentWebsite>',
      scssMixinsPath: '',
      baseUrl: {
        production: '/themes/<currentWebsite>',
        development: '/'
      },
      entries: [
        {
          mode: 'production',
          name: 'bundle',
          paths: [
            '<projectDir>/<currentWebsite>/code/Scripts/polyfills.js',
            '<projectDir>/<currentWebsite>/code/Scripts/entry.production.js'
          ]
        },
        {
          mode: 'development',
          name: 'bundle',
          paths: [
            '<projectDir>/<currentWebsite>/code/Scripts/polyfills.js',
            '<projectDir>/<currentWebsite>/code/Scripts/entry.development.js'
          ]
        }
      ],
      alias: {
        '@Foundation': '<foundationScriptDir>',
        '@Feature': '<featureDir>',
        '@Project': '<projectDir>'
      },
      ...(config.get('vueCli') || {})
    })
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
        const path = alias[key];

        acc[`^${key}(.*)$`] = `${path}$1`;

        return acc;
      },
      {
        '^@/(.*)$': `${config.srcDir.replace(config.rootDir, '<rootDir>')}/$1`
      }
    );
  });

  config.defineGetter('entries', () => {
    const { entries } = config.vueCli;

    return Object.keys(entries).reduce((acc, key) => {
      const { name, mode, paths } = entries[key];

      acc.push({
        name,
        mode,
        type: 'vendors',
        outFile: `/vendors.${name}.js`,
        paths: [...paths]
      });

      acc.push({
        name,
        mode,
        type: 'scripts',
        outFile: `/${name}.js`,
        paths: [...paths]
      });

      acc.push({
        name,
        mode,
        type: 'styles',
        outFile: `/css/${name}.css`,
        paths: [...paths]
      });

      return acc;
    }, []);
  });

  config.defineGetter('cleanEntriesPatterns', () => ['precache-manifest.**', 'service-worker.js', 'vendors.**']);
};

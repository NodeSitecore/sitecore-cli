module.exports = config => {
  config.defineGetter('fractal', () =>
    config.resolve({
      outputDir: '<outputDir>/Fractal',
      staticsDir: '<rootDir>/fractal/public',
      componentsDir: '<rootDir>/fractal/components',
      mocksDir: '<rootDir>/fractal/components/mocks',
      mockResponseDelay: 0,
      docsDir: '<rootDir>/fractal/docs',
      helpersDir: '<rootDir>/fractal/helpers',
      middlewaresDir: '<rootDir>/fractal/middlewares',
      proxyPatterns: ['/fonts/**', '/images/**', '/icons/**', '/medias/**', '/public/**'],
      ...(config.get('fractal') || {})
    })
  );

  config.defineMethod('buildFractalBundles', env => {
    const { entries, cleanEntriesPatterns } = config;
    const bundles = [];
    const vendors = [];
    const styles = [];
    const cleanGlob = [...config.fractal.proxyPatterns, ...cleanEntriesPatterns];

    Object.keys(entries).forEach(key => {
      const { name, mode, type, outFile } = entries[key];

      if (mode && mode !== env) {
        return;
      }

      switch (type) {
        default:
          break;
        case 'vendors':
          vendors.push(outFile);
          break;
        case 'scripts':
          bundles.push(outFile);
          break;
        case 'styles':
          styles.push(outFile);
          break;
      }

      if (name && cleanGlob.indexOf(`${name}.**`) === -1) {
        cleanGlob.push(`${name}.**`);
      }
    });

    return { vendors, bundles, styles, cleanGlob };
  });
};

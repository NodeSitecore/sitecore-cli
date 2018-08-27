module.exports = config => {
  config.defineGetter('fractal', () =>
    config.resolve({
      outputDir: '<outputDir>/Fractal',
      staticsDir: '<rootDir>/fractal/public',
      componentsDir: '<rootDir>/fractal/components',
      mocksDir: '<rootDir>/fractal/components/mocks',
      mockResponseDelay: 0,
      mockRoutes: ['/api'],
      docsDir: '<rootDir>/fractal/docs',
      helpersDir: '<rootDir>/fractal/helpers',
      middlewaresDir: '<rootDir>/fractal/middlewares',
      proxyPatterns: ['/Fonts/**', '/Images/**', '/Icons/**'],
      ...(config.get('fractal') || {})
    })
  );

  config.defineMethod('buildFractalBundles', env => {
    const { entries } = config.vueCli;
    const bundles = [];
    const vendors = [];
    const styles = [];
    const cleanGlob = [...config.fractal.proxyPatterns, 'precache-manifest.**', 'service-worker.js', 'vendors.**'];

    Object.keys(entries).forEach(key => {
      const { name, mode } = entries[key];

      if (mode && mode !== env) {
        return;
      }

      vendors.push(`/vendors.${name}.js`);
      bundles.push(`/${name}.js`);
      styles.push(`/${name}.css`);

      cleanGlob.push(`${name}.**`);
    });

    return { vendors, bundles, styles, cleanGlob };
  });
};

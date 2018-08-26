module.exports = config => {
  config.defineGetter('fractal', () =>
    config.resolve({
      outputDir: '<outputDir>/Fractal',
      staticsDir: '<themeDir>/<currentWebsite>',
      componentsDir: '<rootDir>/fractal/components',
      mocksDir: '<rootDir>/fractal/components/mocks',
      mockResponseDelay: 0,
      mockRoutes: ['/api'],
      docDir: '<rootDir>/fractal/docs',
      assetsDir: '<rootDir>/fractal/assets',
      helpersDir: '<rootDir>/fractal/helpers',
      middlewaresDir: '<rootDir>/fractal/middlewares',
      proxyPatterns: ['/Fonts/**', '/Images/**', '/Icons/**'],
      ...(config.get('fractal') || {})
    })
  );

  config.defineGetter('buildFractalBundles', () => {
    const { entries } = config.vueCli;
    const bundles = [];
    const vendors = [];
    const styles = [];
    const cleanGlob = [config.fractal.proxyPatterns, 'precache-manifest.**', 'service-worker.js', 'vendors.**'];

    Object.keys(entries).forEach(key => {
      const { name, mode } = entries[key];

      if (mode && mode !== process.env.NODE_ENV) {
        return;
      }

      vendors.push(`/vendors.${name}.js`);
      bundles.push(`/${name}.js`);
      styles.push(`/${name}.scss`);

      cleanGlob.push(`${name}.**`);
    });

    return { vendors, bundles, cleanGlob };
  });
};

/* eslint-disable global-require,import/no-dynamic-require */
const fs = require('fs');
const Fractal = require('@frctl/fractal');
/**
 *
 * @param config
 * @param options
 * @returns {*}
 */
module.exports = function createInstance(config, options) {
  const { componentsDir, currentWebsite, staticsDir, outputDir, middlewaresDir, helpersDir } = config;
  const { buildMode, port, host } = options;

  const fractalExternalBuildPrefix = `/${currentWebsite.toLowerCase()}/`;

  /*
  * Require the Fractal module
  */
  const fractal = Fractal.create();

  /*
   * Give your project a title.
   */
  fractal.set('project.title', currentWebsite);
  /**
   *
   */
  fractal.set('project.buildMode', buildMode);
  /**
   * Bundles
   */
  const { bundles, vendors, styles } = config.buildFractalBundles();

  if (!buildMode) {
    const address = host ? `http://${host}:${port}` : '';
    fractal.set('project.bundles', bundles.map(p => `${address}${p}.js`));
    fractal.set('project.vendors', vendors.map(p => `${address}${p}.js`));
    fractal.set('project.styles', []);
  } else {
    fractal.set('project.bundles', bundles);
    fractal.set('project.vendors', vendors);
    fractal.set('project.styles', styles);
  }

  /*
   * Tell Fractal where to look for components.
   */
  fractal.components.set('path', componentsDir);
  fractal.components.set('default.preview', '@preview');
  fractal.components.set('default.context', {
    imgDir: `${buildMode ? fractalExternalBuildPrefix : '/'}Images`,
    site: currentWebsite
  });
  /*
   * Tell Fractal where to look for documentation pages.
   */
  // fractal.docs.set('path', docsDir);

  /*
   * Tell the Fractal web preview plugin where to look for static assets.
   */
  fractal.web.set('static.path', staticsDir);
  /*
   * Publish path
   */
  fractal.web.set('builder.dest', outputDir);
  /**
   * Browser-sync options
   */
  let middlewares = require('../middlewares');

  if (middlewaresDir && fs.existsSync(middlewaresDir)) {
    const mdlwOpts = require(middlewaresDir)(config, options);
    middlewares = (mdlwOpts.before || []).concat(middlewares).concat(mdlwOpts.after || []);
  }

  if (helpersDir && fs.existsSync(helpersDir)) {
    fractal.components.engine(require(helpersDir)(config, options));
  }

  fractal.web.set('server.syncOptions', {
    middleware: middlewares
  });

  return fractal;
};

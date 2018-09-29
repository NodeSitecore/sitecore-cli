/* eslint-disable global-require,import/no-dynamic-require */
const fs = require('fs');
const Fractal = require('@frctl/fractal');
const Server = require('@frctl/fractal/src/web/server');
const mockMiddleware = require('../middlewares/mock');
/**
 *
 * @param config
 * @param options
 * @returns {*}
 */
module.exports = function createInstance(config, options) {
  const { currentWebsite } = config;
  const { componentsDir, staticsDir, outputDir, middlewaresDir, helpersDir, docsDir } = config.fractal;
  const { buildMode, port, host } = options;

  const fractalExternalBuildPrefix = `/${currentWebsite.toLowerCase()}/`;

  Server.prototype.superInit = Server.prototype._init;
  Server.prototype._init = function init() {
    this.use(mockMiddleware(config));
    return this.superInit();
  };
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
  const { bundles, vendors, styles } = config.buildFractalBundles(buildMode ? 'production' : 'development');

  if (!buildMode) {
    const address = host ? `http://${host}:${port}` : '';
    fractal.set('project.bundles', bundles.map(p => `${address}${p}`));
    fractal.set('project.vendors', vendors.map(p => `${address}${p}`));
    fractal.set('project.styles', styles.map(p => `${address}${p}`));
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
  fractal.docs.set('path', docsDir);

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
  let middlewares = require('../middlewares')(config, options);

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

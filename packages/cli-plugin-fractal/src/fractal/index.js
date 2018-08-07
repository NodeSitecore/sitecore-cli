const path = require('path');
const execa = require('execa');
const log = require('fancy-log');
const chalk = require('chalk');
const Fractal = require('@frctl/fractal');
const stripAnsi = require('strip-ansi');
const config = require('@node-sitecore/config');
const clean = require('../utils/clean');

const {
  outputDir = path.join(config.buildRoot, 'Fractal'),
  staticsDir = config.currentWebsiteRoot
  // docDir = path.join(config.rootDir, 'fractal/docs')
} = config.get('fractal');

// const middleware = require('./middlewares');
// const hbs = require('./handlebars');
/**
 *
 */
// const FRACTAL_DEST = outputDir;
/**
 *
 * @type {string}
 */
// const FRACTAL_STATICS = staticsDir;
/**
 *
 * @type {string}
 */
const THEME_PATH = config.currentWebsiteRoot;

/**
 *
 * @param options
 * @returns {*}
 */
function createInstance(options) {
  const { currentWebsite, buildMode, port, bundles, host } = options;

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
  const bundleName = bundles.styleguide ? bundles.styleguide : bundles.bundleName;

  if (!buildMode) {
    const address = host ? `http://${host}:${port}` : '';
    fractal.set('project.bundle', `${address}/${bundleName}.js`);
    fractal.set('project.vendors', `${address}/vendors.${bundleName}.js`);
    fractal.set('project.style', false);
  } else {
    fractal.set('project.bundle', `/${bundleName}.js`);
    fractal.set('project.vendors', `/vendors.${bundleName}.js`);
    fractal.set('project.style', `/${bundleName}.css`);
  }

  /*
   * Tell Fractal where to look for components.
   */
  fractal.components.set('path', path.join(__dirname, '../../fractal/components'));
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
  // if (config.)
  // fractal.web.set('server.syncOptions', {
  //  middleware: middleware(options)
  // });

  // if ()
  // fractal.components.engine(hbs);

  return fractal;
}

module.exports = {
  /**
   *
   * @returns {*}
   */
  build() {
    const { currentWebsite, bundles, devServer } = config;

    log(`Starting '${chalk.cyan('clean workspace')}'...`);

    return clean(
      [
        '/Fonts/**',
        '/Images/**',
        '/Icons/**',
        `${bundles.bundleName}.**`,
        'precache-manifest.**',
        'service-worker.js',
        `${bundles.styleguide}.**`,
        'vendors.**'
      ],
      { cwd: THEME_PATH }
    )
      .then(() => {
        log(`Finished '${chalk.cyan('clean workspace')}'...`);
        log(`Starting '${chalk.cyan('cli:build')}'...`);

        return execa('npm', ['run', 'cli:build'], {
          shell: true,
          env: { FORCE_COLOR: true },
          stdio: 'ignore'
        });
      })

      .then(() => {
        log(`Finished '${chalk.cyan('cli:build')}'`);

        const fractal = createInstance({
          currentWebsite,
          buildMode: true,
          bundles,
          port: devServer.port
        });
        const builder = fractal.web.builder();

        builder.on('error', err => log.error(err.message));

        return builder.build().then(() => {
          log(`Fractal static HTML build for project '${chalk.cyan(currentWebsite)}' complete!`);
          return fractal;
        });
      });
  },
  /**
   *
   * @returns {*}
   */
  dev() {
    const { currentWebsite, bundles } = config;
    let loaded = false;
    let server;
    let port;
    let logger;

    const printSuccess = () => {
      console.error('\n');
      logger.success(`Fractal server is now running at ${server.url} for project ${currentWebsite}`);
      logger.success(`Webpack server is now running at http://localhost:${port} for project ${currentWebsite}`);
      logger.success(`                  Assets list at http://localhost:${port}/webpack-dev-server`);
    };

    const runFractal = () => {
      const fractal = createInstance({
        currentWebsite,
        host: 'localhost',
        port,
        bundles
      });
      server = fractal.web.server({
        sync: true
      });
      logger = fractal.cli.console;
      server.on('error', err2 => logger.error(err2.message));

      return server.start().then(() => {
        loaded = true;
        printSuccess();
      });
    };

    const runWebpack = () => {
      const stream = execa('npm', ['run', 'cli:serve'], { shell: true, env: { FORCE_COLOR: true } });
      stream.stderr.pipe(process.stderr);
      // stream.stdout.pipe(process.stdout);
      let hasError = false;
      stream.stdout.on('data', data => {
        const content = data.toString();
        const match = stripAnsi(content).match(/localhost:([0-9].*)\//);

        if (match && !loaded) {
          [, port] = match;
          runFractal();
        }

        if (match && loaded) {
          return printSuccess();
        }

        if (content.match(/([0-9].2)%/) || content.match(/INFO/)) {
          return process.stdout.write(data);
        }

        if (content.match(/warning /)) {
          return process.stderr.write(data);
        }
        if (content.match(/ERROR /) || (hasError && !loaded)) {
          if (!hasError) {
            process.stderr.write('\n');
          }
          hasError = true;
          return process.stderr.write(data);
        }

        return null;
      });

      return stream;
    };

    return clean(
      [
        '/Fonts/**',
        '/Images/**',
        '/Icons/**',
        `${bundles.bundleName}.**`,
        'precache-manifest.**',
        'service-worker.js',
        `${bundles.styleguide}.**`,
        'vendors.**'
      ],
      { cwd: THEME_PATH }
    ).then(() => runWebpack());
  }
};

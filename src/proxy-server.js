const chalk = require('chalk');
const path = require('path');
const log = require('fancy-log');
const browserSync = require('browser-sync');
const config = require('@node-sitecore/config');
const formatPath = require('./utils/format-path');
const execa = require('execa');

module.exports = (options) => {
  options = Object.assign({
    logLevel: 'debug',
    port: 8001,
    url: config.siteUrl,
    https: true
  }, options);

  const {
    url, port, logLevel
  } = options;

  const staticPath = formatPath(path.join(config.buildRoot, config.get('websiteRoot')));

  if (options.concurrently) {
    execa.shell(options.concurrently, {
      stdio: ['inherit', 'inherit', 'inherit']
    });
  }

  return browserSync.create().init({
    open: false,
    files: [`${staticPath}/**/*.{js,css}`],
    proxy: {
      target: url
    },
    port,
    logLevel,
    serveStatic: [
      staticPath
    ],
    serveStaticOptions: {
      extensions: ['html'] // pretty urls
    },
    snippetOptions: {
      // Provide a custom Regex for inserting the snippet.
      rule: {
        match: /<\/body>/i,
        fn: (snippet, match) => {
          if (options.package) {
            snippet += snippetPackage(options);
          }

          return snippet + match;
        }
      }
    }
  });
};

function snippetPackage(options) {
  log.info(chalk.green('[info] Load snippet localization =>'), options.package);
  return `
    <link rel="stylesheet" type="text/css" href="/themes/${options.package}/bundle.css">
    <script type="text/javascript" src="/themes/${options.package}/bundle.js"></script>
    `;
}

const chalk = require('chalk');
const path = require('path');
const log = require('fancy-log');
const browserSync = require('browser-sync');
const config = require('./config');
const formatPath = require('./format-path');

module.exports = (options) => {
  options = Object.assign({
    logLevel: 'debug',
    port: 8001,
    url: config.siteUrl,
    https: true
  }, options);

  const {
    url, port, logLevel, local
  } = options;

  const staticPath = formatPath(path.join(config.get('instanceRoot'), config.get('websiteRoot')));

  return browserSync.create().init({
    open: false,
    files: [ `${staticPath}/**/*.{js,css}` ],
    proxy: {
      target: url
    },
    port,
    logLevel,
    serveStatic: [
      staticPath
    ],
    serveStaticOptions: {
      extensions: [ 'html' ] // pretty urls
    },
    snippetOptions: {
      // Provide a custom Regex for inserting the snippet.
      rule: {
        match: /<\/body>/i,
        fn: (snippet, match) => {
          if (local) {
            snippet += snippetLocalization(options);
          }

          return snippet + match;
        }
      }
    }
  });
};

function snippetLocalization(options) {
  log.info(chalk.green('[info] Load snippet localization =>'), options.local);
  return `
    <link rel="stylesheet" type="text/css" href="/themes/${options.local}/bundle.css">
    <script type="text/javascript" src="/themes/${options.local}/bundle.js"></script>
    `;
}

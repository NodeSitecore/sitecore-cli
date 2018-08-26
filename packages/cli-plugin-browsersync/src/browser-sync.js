// const chalk = require('chalk');
// const log = require('fancy-log');
const browserSync = require('browser-sync');
const path = require('path');

module.exports = (url, config) => {
  const { port = 8001, logLevel } = config.browserSync;
  const staticPath = path.normalize(path.join(config.websiteDir));

  return browserSync.create().init({
    open: false,
    files: [`${staticPath}/**/*.{js,css}`],
    proxy: {
      target: url
    },
    port,
    logLevel,
    serveStatic: [staticPath],
    serveStaticOptions: {
      extensions: ['html'] // pretty urls
    }
    // snippetOptions: {
    // Provide a custom Regex for inserting the snippet.
    //  rule: {
    //    match: /<\/body>/i,
    //    fn: (snippet, match) => {
    // if (options.package) {
    //  snippet += snippetPackage(options);
    // }

    //      return snippet + match;
    //    }
    //  }
    // }
  });
};

// function snippetPackage(options) {
//   log.info(chalk.green('[info] Load snippet localization =>'), options.package);
//   return `
//     <link rel="stylesheet" type="text/css" href="/themes/${options.package}/bundle.css">
//     <script type="text/javascript" src="/themes/${options.package}/bundle.js"></script>
//     `;
// }

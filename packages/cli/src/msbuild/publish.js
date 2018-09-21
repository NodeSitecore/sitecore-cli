const gulp = require('gulp');
const chalk = require('chalk');
const flatmap = require('gulp-flatmap');
const debug = require('gulp-debug');
const log = require('fancy-log');
const msbuild = require('./runner');

const publishStream = (stream, dest, options) =>
  stream
    .pipe(debug({ title: 'Building project:' }))
    .pipe(
      msbuild({
        ...options,
        logCommand: true,
        properties: {
          ...options.properties,
          publishUrl: dest
        }
      })
    )
    /* istanbul ignore next */
    .on('error', err => {
      /* istanbul ignore next */
      log.error(chalk.red(err));
      /* istanbul ignore next */
      process.exit(-1);
    });

module.exports = (src, dest, options) => {
  log(`Publish to ${dest} folder:`, [].concat(src).join(','));
  gulp.src([].concat(src)).pipe(flatmap(stream => publishStream(stream, dest, options)));
};

const gulp = require('gulp');
const chalk = require('chalk');
const flatmap = require('gulp-flatmap');
const debug = require('gulp-debug');
const log = require('fancy-log');
const msbuild = require('./runner');

const builStream = (stream, options) =>
  stream
    .pipe(debug({ title: 'Building project:' }))
    .pipe(msbuild({ ...options, logCommand: true }))
    /* istanbul ignore next */
    .on('error', err => {
      /* istanbul ignore next */
      log.error(chalk.red(err));
      /* istanbul ignore next */
      process.exit(-1);
    });
module.exports = (src, options) => {
  log.info('Build solution:', [].concat(src).join(','));

  return gulp.src([].concat(src)).pipe(flatmap(stream => builStream(stream, options)));
};

const gulp = require('gulp');
const msbuild = require('gulp-msbuild');
const chalk = require('chalk');
const foreach = require('gulp-foreach');
const debug = require('gulp-debug');
const log = require('fancy-log');

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

  return gulp.src([].concat(src)).pipe(foreach(stream => builStream(stream, options)));
};

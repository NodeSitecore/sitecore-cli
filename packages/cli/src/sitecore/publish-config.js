const config = require('@node-sitecore/config');
const gulp = require('gulp');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const tap = require('gulp-tap');
const log = require('fancy-log');
const chalk = require('chalk');

module.exports = () => {
  const root = config.srcDir;
  const roots = [`${root}/**/App_Config`, `!${root}/**/tests/App_Config`, `!${root}/**/obj/**/App_Config`];
  const files = '/**/*.config';
  const destination = config.websiteConfigDir;

  return gulp.src(roots, { base: root }).pipe(
    tap(file => {
      log(`Publishing from '${chalk.cyan(file.path)}'`);
      gulp
        .src(file.path + files, { base: file.path })
        .pipe(newer(destination))
        .pipe(debug({ title: 'Copying ' }))
        .pipe(gulp.dest(destination));
    })
  );
};

const config = require('@node-sitecore/config');
const gulp = require('gulp');
const tap = require('gulp-tap');
const log = require('fancy-log');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
  const root = config.srcDir;
  const roots = [`${root}/**/Views`, `!${root}/**/obj/**/Views`];
  const files = '/**/*.cshtml';
  const destination = config.websiteViewsDir;
  const logRoots = roots.map(f => f.replace(config.rootDir, '<rootDir>') + files);

  log(`Starting watch views...`);
  log(`Rules '${chalk.cyan(JSON.stringify(logRoots))}'`);

  return gulp.src(roots, { base: root }).pipe(
    tap(rootFolder => {
      const watchFiles = path.join(rootFolder.path, files).replace(/\\/gi, '/');

      gulp.watch(watchFiles).on('change', file => {
        log(`Publish this file '${chalk.cyan(file.replace(config.rootDir, '<rootDir>'))}'`);
        gulp
          .src(file, { base: rootFolder.path })
          .pipe(gulp.dest(destination))
          .on('end', () => {
            log(`Published '${chalk.green(path.relative(config.rootDir, file))}'`);
            console.log('\n\n\n');
            log(`Waiting change...`);
          });
      });
    })
  );
};

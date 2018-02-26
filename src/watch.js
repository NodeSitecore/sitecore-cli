const gulp = require('gulp');
const log = require('fancy-log');
const tap = require('gulp-tap');
const config = require('./config');
const path = require('path');
const formatPath = require('./format-path');
module.exports = {
  /**
   *
   * @param options
   */
  watch(options) {
    const { src, dest, files, exclude } = options;

    const base = config.projectRoot;
    const baseGlob = base.replace(/\\/g, '/');
    const srcGlob = src.replace(/\\/g, '/');
    const roots = [ baseGlob + '/' + srcGlob ];
    const destination = formatPath(path.join(config.websiteRoot, dest));

    if (exclude) {
      roots.push('!' + baseGlob + '/**/obj/' + srcGlob);
    }

    gulp
      .src(roots, { base })
      .pipe(
        tap((stream, rootFolder) => {
          gulp.watch(rootFolder.path + files, (event) => {
            /* istanbul ignore next */
            if (event.type === 'changed') {
              log.info('publish this file ' + event.path);
              gulp.src(event.path, { base: rootFolder.path }).pipe(gulp.dest(destination));
            }
            log.info('published ' + event.path);
          });
          return stream;
        })
      );
  },
  /**
   *
   * @returns {*|void}
   */
  watchCss() {
    return this.watch({
      src: '**/styles',
      dest: 'styles',
      files: '/**/*.css',
      exclude: true
    });
  },

  watchViews() {
    return this.watch({
      src: '**/Views',
      dest: 'Views',
      files: '/**/*.chtml',
      exclude: true
    });
  },
  /**
   *
   * @returns {*|void}
   */
  watchAssemblies() {
    return this.watch({
      src: '**/code/**/bin',
      dest: 'bin/',
      files: '/**/Sitecore.{Feature,Foundation,Habitat}.*.{dll,pdb}',
      exclude: false
    });
  }
};
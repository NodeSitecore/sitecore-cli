const gulp = require('gulp');
const gutil = require('gulp-util');
const config = require('./config');
const path = require('path');

module.exports = {
  /**
   *
   * @param options
   */
  watch(options) {
    const { src, dest, files, exclude } = options;

    const root = config.projectRoot;
    const roots = [ root + '/' + src ];
    const destination = path.join(config.websiteRoot, dest);

    if (exclude) {
      roots.push('!' + root + '/**/obj/' + src);
    }

    gulp.src(roots, { base: root }).pipe(
      foreach((stream, rootFolder) => {
        gulp.watch(rootFolder.path + files, (event) => {
          if (event.type === 'changed') {
            gutil.log('publish this file ' + event.path);
            gulp.src(event.path, { base: rootFolder.path }).pipe(gulp.dest(destination));
          }
          gutil.log('published ' + event.path);
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
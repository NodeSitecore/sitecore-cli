const gulp = require('gulp');
const gutil = require('gulp-util');
const foreach = require('gulp-foreach');
const config = require('./config');

module.exports = () => {
  gutil.log('Copying site assemblies to all local projects');
  const files = config.sitecoreLibraries + '/**/*';
  const base = config.projectRoot;
  const projects = base + '/**/code/bin';

  return gulp.src(projects, { base })
    .pipe(foreach((stream, file) => {
      gutil.log('copying to ' + file.path);
      gulp.src(files)
        .pipe(gulp.dest(file.path));
      return stream;
    }));
};
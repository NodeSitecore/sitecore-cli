const gulp = require('gulp');
const nugetRestore = require('gulp-nuget-restore');

module.exports = (path) => {
  return gulp.src(path).pipe(nugetRestore());
};
const gulp = require('gulp');
const config = require('./config');
const nugetRestore = require('gulp-nuget-restore');

module.exports = (path) => {
  return gulp.src(path || config.solutionPath).pipe(nugetRestore());
};
const gulp = require('gulp');
const log = require('fancy-log');
const msbuild = require('gulp-msbuild');

module.exports = (solutionPath, options) => {
  log.info('Build solution =>', solutionPath);

  return gulp
    .src(solutionPath)
    .pipe(msbuild(options));
};

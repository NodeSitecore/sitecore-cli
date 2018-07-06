const gulp = require('gulp');
const config = require('@node-sitecore/config');

module.exports = () => {
  gulp.src(config.licensePath).pipe(gulp.dest('./lib'));
};

const gulp = require('gulp');
module.exports = () => {
  gulp.src(config.licensePath).pipe(gulp.dest('./lib'));
};
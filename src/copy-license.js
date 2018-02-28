const gulp = require('gulp');
const config = require('./config');

module.exports = () => {
  gulp.src(config.licensePath).pipe(gulp.dest('./lib'));
};

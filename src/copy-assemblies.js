// const gulp = require('gulp');
// const log = require('fancy-log');
// const tap = require('gulp-tap');
// const config = require('./config');
//
// module.exports = () => {
//   log.info('Copying site assemblies to all local projects');
//   const files = config.sitecoreLibraries + '/**/*';
//   const base = config.projectRoot;
//   const projects = base + '/**/code/bin';
//
//   return gulp.src(projects, { base })
//     .pipe(tap((stream, file) => {
//       log.info('copying to ' + file.path);
//       gulp.src(files)
//         .pipe(gulp.dest(file.path));
//       return stream;
//     }));
// };
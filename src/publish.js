// const gulp = require('gulp');
// const msbuild = require('gulp-msbuild');
// const debug = require('gulp-debug');
// const log = require('fancy-log');
// const tap = require('gulp-tap');
// const newer = require('gulp-newer');
// const rename = require('gulp-rename');
// const config = require('./config');
//
// module.exports = {
//   /**
//    *
//    * @returns {*}
//    */
//   publishStream(stream, dest) {
//     const targets = [ 'Build' ];
//
//     return stream
//       .pipe(debug({ title: 'Building project:' }))
//       .pipe(msbuild({
//         targets: targets,
//         configuration: config.get('buildConfiguration'),
//         logCommand: false,
//         verbosity: config.get('buildVerbosity'),
//         stdout: true,
//         errorOnFail: true,
//         maxcpucount: config.get('buildMaxCpuCount'),
//         nodeReuse: false,
//         toolsVersion: config.get('buildToolsVersion'),
//         properties: {
//           Platform: config.get('publishPlatform'),
//           DeployOnBuild: 'true',
//           DeployDefaultTarget: 'WebPublish',
//           WebPublishMethod: 'FileSystem',
//           DeleteExistingFiles: 'false',
//           publishUrl: dest,
//           _FindDependencies: 'false'
//         }
//       }));
//   },
//   /**
//    *
//    * @param location
//    * @param dest
//    * @returns {*}
//    */
//   publishProject(location, dest) {
//     dest = dest || config.websiteRoot;
//
//     log.info('publish to ' + dest + ' folder');
//     return gulp.src([ './src/' + location + '/code/*.csproj' ])
//       .pipe(tap((stream, file) => publishStream(stream, dest)));
//   },
//   /**
//    *
//    * @param location
//    * @param dest
//    * @returns {*}
//    */
//   publishProjects(location, dest) {
//     dest = dest || config.websiteRoot;
//
//     log.info('publish to ' + dest + ' folder');
//     return gulp.src([ location + '/**/code/*.csproj' ])
//       .pipe(tap((stream, file) => publishStream(stream, dest)));
//   },
//   /**
//    *
//    * @returns {*}
//    */
//   publishAssemblies() {
//     const base = config.projectRoot;
//     const binFiles = `${base}/**/code/**/bin/Sitecore.{Feature,Foundation,${config.get('solutionName')}}.*.{dll,pdb}`;
//     const destination = config.sitecoreLibraries;
//
//     return gulp.src(binFiles, { base })
//       .pipe(rename({ dirname: '' }))
//       .pipe(newer(destination))
//       .pipe(debug({ title: 'Copying ' }))
//       .pipe(gulp.dest(destination));
//   },
//   /**
//    *
//    * @returns {*}
//    */
//   publishViews() {
//     const base = config.projectRoot;
//     const roots = [ base + '/**/Views', '!' + base + '/**/obj/**/Views' ];
//     const files = '/**/*.cshtml';
//     const destination = config.websiteViewsPath;
//
//     return gulp.src(roots, { base }).pipe(
//       tap(function (stream, file) {
//         log.info('Publishing from ' + file.path);
//         gulp.src(file.path + files, { base: file.path })
//           .pipe(newer(destination))
//           .pipe(debug({ title: 'Copying ' }))
//           .pipe(gulp.dest(destination));
//         return stream;
//       })
//     );
//   },
//   /**
//    *
//    * @returns {*}
//    */
//   publishConfigs() {
//     const base = config.projectRoot;
//     const roots = [ base + '/**/App_Config', '!' + base + '/**/obj/**/App_Config' ];
//     const files = '/**/*.config';
//     const destination = config.websiteRoot + '\\App_Config';
//     return gulp.src(roots, { base }).pipe(
//       tap((stream, file) => {
//         log.info('Publishing from ' + file.path);
//         gulp.src(file.path + files, { base: file.path })
//           .pipe(newer(destination))
//           .pipe(debug({ title: 'Copying ' }))
//           .pipe(gulp.dest(destination));
//         return stream;
//       })
//     );
//   }
// };

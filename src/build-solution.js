const gulp = require('gulp');
const config = require('./config');
const msbuild = require("gulp-msbuild");

module.exports = (solutionPath, options) => {
  const targets = config.runCleanBuilds ? [ 'Clean', 'Build' ] : [ 'Build' ];

  console.log('config.solutionPath =>', config.solutionPath)

  return gulp.src(solutionPath || config.solutionPath)
    .pipe(msbuild(options || {
      targets: targets,
      configuration: config.get('buildConfiguration'),
      logCommand: false,
      verbosity: config.get('buildVerbosity'),
      stdout: true,
      errorOnFail: true,
      maxcpucount: config.get('buildMaxCpuCount'),
      nodeReuse: false,
      toolsVersion: config.get('buildToolsVersion'),
      properties: {
        Platform: config.get('buildPlatform')
      }
    }));
};
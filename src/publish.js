const gulp = require('gulp');
const msbuild = require('gulp-msbuild');
const foreach = require('gulp-foreach');
const debug = require('gulp-debug');
const log = require('fancy-log');


const publishStream = (stream, dest, options) => stream
  .pipe(debug({ title: 'Building project:' }))
  .pipe(msbuild({
    ...options,
    properties: {
      ...options.properties,
      publishUrl: dest,
    }
  }));

module.exports = (src, dest, options) => {
  log(`Publish to ${dest} folder`);
  gulp
    .src([].concat(src))
    .pipe(foreach((stream) => publishStream(stream, dest, options)
    ));
};

const config = require('@node-sitecore/config');
const gulp = require('gulp');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const rename = require('gulp-rename');

module.exports = () => {
  const root = config.rootDir;
  const binFiles = `${root}/**/code/**/bin/Sitecore.{Feature,Foundation,${config.currentWebsite}}.*.{dll,pdb}`;
  const destination = config.websiteLibrariesDir;
  return gulp
    .src(binFiles, { base: root })
    .pipe(rename({ dirname: '' }))
    .pipe(newer(destination))
    .pipe(debug({ title: 'Copying ' }))
    .pipe(gulp.dest(destination));
};

const path = require('path');
const gulp = require('gulp');
const tap = require('gulp-tap');
const { info, chalk } = require('@vue/cli-shared-utils');
const execa = require('execa');

function run(config, currentWebsite, options) {
  if (options.exclude && options.exclude.length && options.exclude.indexOf(currentWebsite) > -1) {
    return;
  }

  try {
    execa.sync('nsc', ['vue', 'check', '--currentWebsite', currentWebsite], {
      shell: true,
      env: {
        FORCE_COLOR: true
      },
      stdio: 'inherit'
    });
  } catch (er) {
    return;
  }

  info(`Start build Project ${chalk.cyan(currentWebsite)}`);

  execa.sync('vue-cli-service', ['build', '--currentWebsite', currentWebsite, '--production'], {
    shell: true,
    env: {
      VUE_APP_CURRENT_WEBSITE: config.currentWebsite,
      FORCE_COLOR: true
    },
    stdio: 'inherit'
  });
}

module.exports = (config, options) => {
  if (options.list) {
    options.list.forEach(c => run(config, c, options));
  } else {
    gulp.src(options.pattern).pipe(
      tap(projectFolder => {
        run(config, path.basename(projectFolder.path), options);
      })
    );
  }
};

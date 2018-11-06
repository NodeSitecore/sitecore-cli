const path = require('path');
const gulp = require('gulp');
const tap = require('gulp-tap');
const { info, chalk } = require('@vue/cli-shared-utils');
const execa = require('execa');

module.exports = (config, options) =>
  gulp.src(options.pattern).pipe(
    tap(projectFolder => {
      const currentWebsite = path.basename(projectFolder.path);

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

      let cmd = `${options.cmd}${options.cmd.match(/^npm/) ? ' -- ' : ''} --currentWebsite ${currentWebsite}`;
      cmd = cmd.split(' ');

      const task = cmd[0];
      const args = cmd.splice(1).filter(t => !!t);

      execa.sync(task, args, {
        shell: true,
        env: {
          FORCE_COLOR: true
        },
        stdio: 'inherit'
      });
    })
  );

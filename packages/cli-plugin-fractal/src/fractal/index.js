/* eslint-disable global-require,import/no-dynamic-require */
const execa = require('execa');
const gulp = require('gulp');
const path = require('path');
const debug = require('gulp-debug');
const newer = require('gulp-newer');
const fs = require('fs-extra');
const log = require('fancy-log');
const stripAnsi = require('strip-ansi');
const createInstance = require('./create-instance');

const toPromise = stream =>
  new Promise((resolve, reject) =>
    stream
      .on('end', resolve)
      .on('finish', resolve)
      .on('error', reject)
  );

module.exports = {
  async copy(config) {
    const { copy = [] } = config.get('fractal');

    const promises = copy.map(task =>
      toPromise(
        gulp
          .src(task.paths)
          .pipe(newer(task.outputDir))
          .pipe(debug({ title: 'Copying ' }))
          .pipe(gulp.dest(task.outputDir))
      )
    );

    return Promise.all(promises);
  },
  /**
   *
   * @returns {*}
   */
  async build(config) {
    const { devServer = {} } = config;
    const fractal = createInstance(config, {
      buildMode: true,
      port: devServer.port
    });

    const builder = fractal.web.builder();

    builder.on('error', err => log.error(err.message));

    await builder.build();

    return fractal;
  },
  /**
   *
   * @returns {*}
   */
  async dev(config, webpackPort = null) {
    const that = module.exports;
    that.loaded = false;
    that.server = null;
    that.logger = null;
    that.port = webpackPort;

    const fractal = createInstance(config, {
      host: 'localhost',
      port: webpackPort
    });

    that.server = fractal.web.server({
      sync: true
    });
    that.logger = fractal.cli.console;
    that.server.on('error', err2 => that.logger.error(err2.message));

    await that.server.start();

    module.exports.loaded = true;
    module.exports.printSuccess();
  },

  printSuccess() {
    console.error('\n');
    const { logger, server, port } = module.exports;

    logger.success(`Fractal server is now running at ${server.url}`);
    logger.success(`Webpack server is now running at http://localhost:${port}`);
    logger.success(`                  Assets list at http://localhost:${port}/webpack-dev-server`);
  },

  async runBuildAfter(cmd, config) {
    cmd = cmd.split(' ');
    const task = cmd[0];
    const args = cmd.splice(1);

    await execa(task, args, {
      shell: true,
      env: {
        FORCE_COLOR: true
      },
      stdio: 'inherit'
    });

    await fs.copy(config.vueCli.outputDir, config.fractal.outputDir);
    await fs.copy(config.vueCli.outputDir, path.join(config.fractal.outputDir, config.get('vueCli').baseUrl.production));
  },

  async runDevBefore(cmd) {
    return new Promise(resolve => {
      cmd = cmd.split(' ');
      const stream = execa(cmd[0], cmd.splice(1), { shell: true, env: { FORCE_COLOR: true } });
      stream.stderr.pipe(process.stderr);
      // stream.stdout.pipe(process.stdout);
      let hasError = false;
      stream.stdout.on('data', data => {
        const content = data.toString();
        const match = stripAnsi(content).match(/localhost:([0-9].*)/);

        if (match && !module.exports.loaded) {
          const [, port] = match;
          resolve(parseInt(port, 0));
        }

        if (match && module.exports.loaded) {
          return module.exports.printSuccess();
        }

        if (content.match(/([0-9].2)%/) || content.match(/INFO/)) {
          return process.stdout.write(data);
        }

        if (content.match(/warning /)) {
          return process.stderr.write(data);
        }
        if (content.match(/ERROR /) || (hasError && !module.exports.loaded)) {
          if (!hasError) {
            process.stderr.write('\n');
          }
          hasError = true;
          return process.stderr.write(data);
        }

        return null;
      });

      return stream;
    });
  }
};

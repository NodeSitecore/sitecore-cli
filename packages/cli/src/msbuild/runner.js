/* eslint-disable consistent-return,guard-for-in,no-cond-assign */
const commandBuilder = require('gulp-msbuild/lib/msbuild-command-builder');
const logger = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');
const PluginError = require('plugin-error');
const glob = require('glob');
const fs = require('fs');
const execa = require('execa');
const through = require('through2');
const _ = require('lodash');
const constants = require('gulp-msbuild/lib/constants');
const didYouMean = require('didyoumean');
const timestamp = require('time-stamp');
const replaceStream = require('./stream-replace');

function getTimestamp() {
  return `[${chalk.gray(timestamp('HH:mm:ss'))}]`;
}

/**
 *
 * @param options
 * @returns {*}
 */
function mergeOptionsWithDefaults(options) {
  return _.extend({}, constants.DEFAULTS, options);
}

/**
 *
 * @param options
 */
function validateOptions(options) {
  for (const key in options) {
    const defaultKeys = Object.keys(constants.DEFAULTS);
    if (defaultKeys.indexOf(key) < 0) {
      let match;
      let msg = `Unknown option '${key}'!`;

      if ((match = didYouMean(key, defaultKeys))) {
        msg += ` Did you mean '${match}'?`;
      }

      throw new PluginError(constants.PLUGIN_NAME, chalk.red(msg));
    }
  }
}

/**
 *
 * @param options
 * @param file
 * @param stream
 * @param callback
 */
const startMsBuildTask = (options, file, stream, callback) => {
  const command = commandBuilder.construct(file, options);

  if (options.logCommand) {
    logger(chalk.cyan('Using MSBuild command:'), command.executable, command.args.join(' '));
  }
  const spawnOptions = {};
  const errors = [];

  let closed = false;
  const cp = execa(command.executable, command.args, spawnOptions);

  cp.stdout
    .pipe(
      replaceStream(line => {
        let content = getTimestamp();

        if (line.match(': error')) {
          content = content + chalk.red('[ERROR]');
          errors.push(line.trim());
          line = chalk.red(line);
        } else if (line.match(': warning')) {
          content = content + chalk.yellow('[WARN ]');
        } else {
          content = content + chalk.blue('[INFO ]');
        }

        return `${content} ${line.trim()}\n\n`;
      })
    )
    .pipe(process.stdout);

  cp.stderr
    .pipe(
      replaceStream(line => {
        errors.push(line.trim());
        return getTimestamp() + chalk.red(`[ERROR] ${line.trim()}`);
      })
    )
    .pipe(process.stderr);

  cp.on('error', err => {
    if (err) {
      logger.error(err);
    }

    // The 'exit' event also can fire after the error event. We need to guard
    // when the process has already been closed:
    // https://nodejs.org/api/child_process.html#child_process_event_error
    if (closed) {
      return;
    }

    closed = true;
    if (err) {
      logger(chalk.red('MSBuild failed!'));

      if (options.errorOnFail) {
        return callback(err);
      }
    }

    return callback();
  });

  cp.on('exit', (code, signal) => {
    // The 'exit' event also can fire after the error event. We need to guard
    // when the process has already been closed:
    // https://nodejs.org/api/child_process.html#child_process_event_error
    if (closed) {
      return;
    }

    closed = true;
    if (code === 0) {
      logger(chalk.cyan('MSBuild complete!'));

      if (options.emitPublishedFiles) {
        const { publishDirectory } = options;
        glob('**/*', { cwd: publishDirectory, nodir: true, absolute: true }, (err, files) => {
          if (err) {
            const msg = `Error globbing published files at ${publishDirectory}`;
            logger(chalk.red(msg));
            return callback(err);
          }

          for (let i = 0; i < files.length; i++) {
            const filePath = files[i];

            if (fs.statSync(filePath).isFile()) {
              stream.push(
                new File({
                  cwd: publishDirectory,
                  base: publishDirectory,
                  path: filePath,
                  contents: Buffer.from(fs.readFileSync(filePath))
                })
              );
            }
          }
          return callback();
        });
      } else {
        return callback();
      }
    } else {
      let msg;

      if (code != null) {
        // Exited normally, but failed.
        msg = `MSBuild failed with code ${code}!`;
      } else {
        // Killed by parent process.
        msg = `MSBuild killed with signal ${signal}!`;
      }

      logger.error(chalk.red(msg));
      errors.forEach(line => logger(`${chalk.red(line)}\n\n`));

      if (options.errorOnFail) {
        return callback(new Error(msg));
      }
    }
  });
};

module.exports = options => {
  const mergedOptions = _.cloneDeep(mergeOptionsWithDefaults(options));
  validateOptions(mergedOptions);

  return through.obj((file, enc, callback) => {
    const self = this;
    if (!file || !file.path) {
      self.push(file);
      return callback();
    }

    return startMsBuildTask(mergedOptions, file, self, err => {
      if (err) return callback(err);
      if (mergedOptions.emitEndEvent) self.emit('end');
      return callback();
    });
  });
};

/* eslint-disable global-require,import/no-dynamic-require */
const log = require('fancy-log');
const chalk = require('chalk');
const fractal = require('./src/fractal');

module.exports = (api, config) => {
  api.registerCommand(
    'fractal',
    {
      usage: '<serve|buid> [options]',
      description: 'Run or build a fractal server',
      options: {
        '-e, --execute': {
          type: String,
          description: 'Run command before loading Fractal server. Useful for webpack dev server.'
        }
      }
    },
    async (commander, args) => {
      const [mode = 'serve'] = args;

      log(`Starting '${chalk.cyan('clean workspace')}'...`);
      await module.exports.clean(config);

      log(`Finished '${chalk.cyan('clean workspace')}'...`);

      if (mode === 'serve') {
        if (commander.execute) {
          await fractal.runDevBefore(commander.execute);
        }

        await fractal.dev(config);
      } else {
        if (commander.execute) {
          log(`Starting '${chalk.cyan('cli:build')}'...`);
          await fractal.runBuildBefore(commander.execute);
          log(`Finished '${chalk.cyan('cli:build')}'`);
        }

        await fractal.build(config);
        log(`Fractal static HTML build complete!`);
      }
    }
  );
};

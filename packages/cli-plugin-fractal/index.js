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
        '-e, --execute <cmd>': {
          type: String,
          description: 'Run command before loading Fractal server. Useful for webpack dev server.'
        }
      }
    },
    async (commander, args) => {
      const [mode = 'serve'] = args;

      log(`Starting '${chalk.cyan('clean workspace')}'...`);
      await fractal.clean(config);

      log(`Finished '${chalk.cyan('clean workspace')}'...`);

      if (mode === 'serve') {
        let port;
        if (commander.execute) {
          port = await fractal.runDevBefore(commander.execute);
        }

        await fractal.dev(config, port);
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

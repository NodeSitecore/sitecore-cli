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

      if (mode === 'serve') {
        let port;
        if (commander.execute) {
          port = await fractal.runDevBefore(commander.execute);
        }

        await fractal.dev(config, port);
      } else {
        log(`Starting build fractal...`);
        await fractal.build(config);

        if (commander.execute) {
          log(`Starting build app '${chalk.cyan(commander.execute)}'...`);
          await fractal.runBuildAfter(commander.execute, config);
          log(`Finished build'${chalk.cyan(commander.execute)}'`);
        }

        log(`Fractal static HTML build complete in ${config.fractal.outputDir}`);
      }
    }
  );
};

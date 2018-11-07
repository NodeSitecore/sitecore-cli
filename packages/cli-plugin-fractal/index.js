/* eslint-disable global-require,import/no-dynamic-require,no-case-declarations */
const log = require('fancy-log');
const chalk = require('chalk');
const fractal = require('./src/fractal');

module.exports = (api, config) => {
  api.registerCommand(
    'fractal',
    {
      usage: '<serve|buid|copy> [options]',
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

      switch (mode) {
        case 'serve':
          let port;
          if (commander.execute) {
            port = await fractal.runDevBefore(commander.execute, config);
          }

          await fractal.dev(config, port);
          break;

        case 'build':
          log(`Starting build fractal...`);
          await fractal.build(config);

          if (commander.execute) {
            log(`Starting build app '${chalk.cyan(commander.execute)}'...`);
            await fractal.runBuildAfter(commander.execute, config);
            log(`Finished build'${chalk.cyan(commander.execute)}'`);
          }

          log(`Fractal static HTML build complete in ${config.fractal.outputDir}`);
          break;

        case 'copy':
          if (config.get('fractal').copy) {
            log(`Starting copy documentation...`);
            await fractal.copy(config);
          } else {
            log(`No copy tasks has registered in fractal configuration`);
          }

          break;

        default:
          break;
      }
    }
  );
};

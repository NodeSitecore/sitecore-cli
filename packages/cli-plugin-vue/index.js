/* eslint-disable no-unused-vars,no-case-declarations */
const path = require('path');
const { info, chalk, warn } = require('@vue/cli-shared-utils');
const fs = require('fs');
const multipleBuild = require('./src/command/multiple-build');

module.exports = (api, config) => {
  api.registerCommand(
    'vue',
    {
      usage: '<build|check> [options]',
      description: 'Build multiple vue app',
      options: {
        '-p, --pattern <cmd>': {
          type: String,
          description: 'Glob pattern to list project'
        },
        '-l, --list <cmd>': {
          type: Array,
          description: 'Website code list (EU,FR,etc)'
        },
        '-e, --exclude <cmd>': {
          type: Array,
          description: 'Exclude Website code list (Common,etc)'
        }
      }
    },
    async (commander, args) => {
      const [mode = 'build'] = args;

      switch (mode) {
        case 'build':
          info(`Starting build vue app...`);

          await multipleBuild(config, {
            pattern: commander.pattern,
            exclude: commander.exclude || [],
            list: commander.list || [config.currentWebsite]
          });
          break;

        case 'check':
          const { entries } = config.vueCli;

          info(`Check entries for currentWebsite ${chalk.cyan(config.currentWebsite)}`);

          entries.forEach(entry => {
            entry.paths.forEach(file => {
              if (!fs.existsSync(file)) {
                warn(`Entry is KO: ${chalk.red(file)}`);
                process.exit(-1);
              }
            });
          });

          info(`Entries is ok for the currentWebsite ${chalk.cyan(config.currentWebsite)}`);
          break;

        default:
          break;
      }
    }
  );
};

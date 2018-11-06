/* eslint-disable no-unused-vars,no-case-declarations */
const path = require('path');
const { info, chalk, warn } = require('@vue/cli-shared-utils');
const fs = require('fs');
const multipleBuild = require('./src/command/multiple-build');

module.exports = (api, config) => {
  api.registerCommand(
    'vue',
    {
      usage: '<build|check> <pattern> [options]',
      description: 'Build multiple vue app',
      options: {
        '-e, --execute <cmd>': {
          type: String,
          description: 'Run command to build a vue application'
        }
      }
    },
    async (commander, args) => {
      const [mode = 'build', pattern = path.join(config.projectDir, '**')] = args;

      switch (mode) {
        case 'build':
          info(`Starting build vue app...`);

          await multipleBuild(config, {
            cmd: commander.execute || 'vue-cli-service build --mode production',
            pattern
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

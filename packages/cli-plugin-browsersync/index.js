const inquirer = require('inquirer');
const log = require('fancy-log');
const proxyServer = require('./src/browser-sync');

module.exports = (api, config) => {
  api.registerCommand(
    'browsersync',
    {
      description: '',
      usage: '[Feature|Foundation|Project|solution] [options]',
      options: {
        '-p, --package <package>': {
          description: 'Load a snippet for a given localization',
          type: String
        },

        '-c, --concurrently <npm task>': {
          description: 'Load a snippet for a given localization'
        }
      }
    },
    commander => {
      runInteractive(commander);

      function runInteractive(options) {
        let questions;

        if (config.proxyUrls.length) {
          questions = [
            {
              type: 'list',
              name: 'proxyUrl',
              message: 'Which url do you want to proxify ? ',
              choices: config.proxyUrls.concat([new inquirer.Separator(), 'Enter new url']),
              required: true
            },
            {
              type: 'input',
              name: 'proxyUrl',
              when: answers => answers.proxyUrl === 'Enter new url',
              message: 'Which url do you want to proxify ? ',
              default: config.siteUrl,
              required: true
            }
          ];
        } else {
          questions = [
            {
              type: 'input',
              name: 'proxyUrl',
              message: 'Which url do you want to proxify ? ',
              default: config.siteUrl,
              required: true
            }
          ];
        }

        return inquirer
          .prompt(questions)
          .then(answers => {
            config.pushProxyUrl(answers.proxyUrl);

            proxyServer({
              url: answers.proxyUrl,
              package: options.package,
              concurrently: options.concurrently
            });
          })
          .catch(er => log.error(er));
      }
    }
  );
};

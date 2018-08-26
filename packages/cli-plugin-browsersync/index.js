const inquirer = require('inquirer');
const log = require('fancy-log');
const execa = require('execa');
const browserSync = require('./src/browser-sync');

module.exports = (api, config) => {
  api.registerCommand(
    'browsersync',
    {
      description: 'Run browsersync server and proxy a given server',
      usage: '[options]',
      options: {
        // '-p, --package <package>': {
        //  type: String,
        //  description: 'Load a snippet for a given localization',
        // },

        '-e, --execute <cmd>': {
          description: 'Run command concurrently'
        }
      }
    },
    commander => {
      const { urls } = config.browserSync;

      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'url',
            message: 'Which url do you want to proxify ? ',
            choices: urls.concat([new inquirer.Separator(), 'Enter new url']),
            required: true
          },
          {
            type: 'input',
            name: 'url',
            when: answers => answers.url === 'Enter new url',
            message: 'Which url do you want to proxify ? ',
            default: config.siteUrl,
            required: true
          }
        ])
        .then(answers => {
          config.setBSUrls(answers.url);

          if (commander.execute) {
            execa.shell(commander.execute, {
              stdio: 'inherit'
            });
          }

          browserSync(answers.url, config, {});
        })
        .catch(er => log.error(er));
    }
  );
};

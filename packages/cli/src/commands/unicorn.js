const Table = require('cli-table');
const inquirer = require('inquirer');
const log = require('fancy-log');
const chalk = require('chalk');
const unicorn = require('../unicorn');

const description = {
  description: 'Perform a Unicorn synchronisation',
  usage: '[action] [configs ...]',
  options: {
    '-c, --configs <items>': {
      description: 'Unicorn configurations list that you want to synchronise',
      type: Array
    }
  }
};

module.exports = (api, config) => {
  api.registerCommand('unicorn', description, (commander, args) => {
    const action = args[0];

    switch (action) {
      default:
        unicorn.getConfigurations(config).then(configs => {
          runInteractive(configs);
        });
        break;

      case 'list':
        unicorn
          .getConfigurations(config)
          .then(configs => {
            const table = new Table({
              head: ['Name', 'Descriptions', 'Dependencies'],
              colWidths: [40, 50, 50]
            });

            configs = configs.map(conf => [conf.name, conf.description || '', conf.dependencies.join('\n  > ')]);

            table.push(...configs);

            console.log(table.toString());
          })
          .catch(er => console.error(er));

        break;

      case 'sync':
        // config.checkPreconditions();
        unicorn.sync({
          siteUrl: config.siteUrl,
          authConfigFile: config.authConfigFile,
          configs: commander.configs
        });
        break;
    }

    /**
     *
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    function runInteractive(configs) {
      const questions = [
        {
          type: 'checkbox',
          name: 'configs',
          message: 'Choose configurations',
          required: true,
          choices: configs.map(c => c.name)
        }
      ];

      return inquirer
        .prompt(questions)
        .then(answers =>
          unicorn.sync({
            siteUrl: config.siteUrl,
            authConfigFile: config.authConfigFile,
            configs: answers.configs
          })
        )
        .catch(er => log.error(chalk.red(String(er))));
    }
  });
};

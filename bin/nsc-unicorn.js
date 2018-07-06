#!/usr/bin/env node


const commander = require('commander');
const Table = require('cli-table');
const inquirer = require('inquirer');
const log = require('fancy-log');
const chalk = require('chalk');
const unicorn = require('../src/unicorn');
const config = require('@node-sitecore/config');

const options = {
  action: 'wizard',
  configs: [],
  all: false
};

commander
  .usage('[sync|sync-all|list] [configs ...]')
  .arguments('[action] [configs ...]')
  .alias('nsc unicorn')
  .option('-c, --configs <items>', 'Unicorn configurations list that you want to synchronise', options.configs)
  .option('-a, --all', 'Sync all configuration', (v, t) => t + 1, 0)
  .action((action) => {
    options.action = action;
  })
  .parse(process.argv);

commander.on('--help', () => {
  console.log('\n  Usages:');
  console.log('');
  console.log('    nsc unicorn                  Run wizard');
  console.log('    nsc unicorn sync [-c|-a]     Perform a Unicorn synchronisation on the given configuration');
  console.log('    nsc unicorn list             List all available configurations');
  console.log('');
});

switch (options.action) {
  default:

    // config.checkPreconditions();

    unicorn
      .getConfigurations()
      .then((configs) => {
        runInteractive(configs);
      });
    break;

  case 'list':
    unicorn
      .getConfigurations()
      .then((configs) => {
        const table = new Table({
          head: [ 'Name', 'Descriptions', 'Dependencies' ],
          colWidths: [ 40, 50, 50 ]
        });

        configs = configs.map((conf) => [ conf.name, conf.description || '', conf.dependencies.join(' > ') ]);

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
      configs: options.configs
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
    .then((answers) => unicorn.sync({
      siteUrl: config.siteUrl,
      authConfigFile: config.authConfigFile,
      configs: answers.configs
    }))
    .catch(er => log.error(chalk.red(String(er))));
}

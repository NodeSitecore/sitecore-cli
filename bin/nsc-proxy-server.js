#!/usr/bin/env node


const inquirer = require('inquirer');
const commander = require('commander');
const log = require('fancy-log');
const proxyServer = require('../src/proxy-server');
const config = require('../src/config');

commander
  .alias('nsc proxy-server')
  .option('--local <locale>', 'Load a snippet for a given localization')
  .parse(process.argv);

runInteractive(commander);

function runInteractive(options) {
  let questions;

  if (config.proxyUrls.length) {
    questions = [ {
      type: 'list',
      name: 'proxyUrl',
      message: 'Which url do you want to proxify ? ',
      choices: config.proxyUrls.concat([ new inquirer.Separator(), 'Enter new url' ]),
      required: true
    },
    {
      type: 'input',
      name: 'proxyUrl',
      when: (answers) => answers.proxyUrl === 'Enter new url',
      message: 'Which url do you want to proxify ? ',
      default: config.siteUrl,
      required: true
    }
    ];
  } else {
    questions = [ {
      type: 'input',
      name: 'proxyUrl',
      message: 'Which url do you want to proxify ? ',
      default: config.siteUrl,
      required: true
    } ];
  }


  return inquirer
    .prompt(questions)
    .then((answers) => {
      config.pushProxyUrl(answers.proxyUrl);

      proxyServer({
        url: answers.proxyUrl,
        local: options.local
      });
    })
    .catch(er => log.error(er));
}

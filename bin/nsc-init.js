#!/usr/bin/env node

/* eslint-disable no-param-reassign */

const inquirer = require('inquirer');
const config = require('@node-sitecore/config');

const questions = [
  {
    type: 'input',
    name: 'currentWebsite',
    message: 'What is the code name of your website ?',
    default: config.currentWebsite,
    required: true
  },
  {
    type: 'input',
    name: 'siteUrl',
    message: 'What is the website url ?',
    default: config.nconf.get('siteUrl'),
    required: true
  },
  {
    type: 'input',
    name: 'instanceRoot',
    message: 'What is the path of your instance ?',
    default: config.nconf.get('instanceRoot'),
    required: true
  },
  {
    type: 'input',
    name: 'websiteRoot',
    message: 'What is the relative path of your Website (from instanceDir) ?',
    default: config.nconf.get('websiteRoot'),
    required: true
  },
  {
    type: 'input',
    name: 'licensePath',
    message: 'What is the relative path of license.xml (from instanceDir) ?',
    default: config.nconf.get('licensePath'),
    required: true
  },
  {
    type: 'input',
    name: 'sitecoreLibrariesRoot',
    message: 'What is the relative path of the Sitecore librairies  (from instanceDir) ?',
    default: config.nconf.get('sitecoreLibrariesRoot'),
    required: true
  },
  {
    type: 'input',
    name: 'solutionName',
    message: 'What is the name of your Solution.sln (MySitecore.sln) ?',
    default: config.nconf.get('solutionName'),
    required: true
  },
  {
    type: 'input',
    name: 'buildToolsVersion',
    message: 'What is the version of your Microsoft Build Tools (MsBuildTools) ?',
    default: String(config.nconf.get('buildToolsVersion')),
    required: true
  }
];

function runInteractive() {
  return inquirer.prompt(questions)
    .then((answers) => {
      Object.keys(answers).forEach((key) => {
        if (key === 'solutionName') {
          answers[key] = answers[key].replace('.sln', '');
        }
        config.set(key, answers[key] || config.get(key));
      });
      config.set('masterWebsite', config.get('currentWebsite'));
      config.create();
    });
}

runInteractive();

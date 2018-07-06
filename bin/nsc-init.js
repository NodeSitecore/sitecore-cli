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
    default: config.siteUrl,
    required: true
  },
  {
    type: 'input',
    name: 'instanceRoot',
    message: 'What is the path of your instance ?',
    default: config.instanceRoot,
    required: true
  },
  {
    type: 'input',
    name: 'websiteRoot',
    message: 'What is the relative path of your Website (from instanceRoot) ?',
    default: config.get('websiteRoot'),
    required: true
  },
  {
    type: 'input',
    name: 'licensePath',
    message: 'What is the relative path of license.xml (from instanceRoot) ?',
    default: config.get('licensePath'),
    required: true
  },
  {
    type: 'input',
    name: 'sitecoreLibrairiesRoot',
    message: 'What is the relative path of the Sitecore librairies  (from instanceRoot) ?',
    default: config.get('sitecoreLibrairiesRoot'),
    required: true
  },
  {
    type: 'input',
    name: 'solutionName',
    message: 'What is the name of your Solution.sln (MySitecore.sln) ?',
    default: config.get('solutionName'),
    required: true
  },
  {
    type: 'input',
    name: 'buildToolsVersion',
    message: 'What is the version of your Microsoft Build Tools (MsBuildTools) ?',
    default: config.get('buildToolsVersion'),
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
      config.create();
    });
}

runInteractive();

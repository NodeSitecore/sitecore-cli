#!/usr/bin/env node

const commander = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

commander
  .version(pkg.version)
  .command('init', 'Init a Sitecore Project')
  .command('restore', 'Restore all NuGet Packages')
  .command('install', 'Install a sitecore package')
  .command('build', 'Build project solution')
  .command('unicorn [options]', 'Perform a Unicorn synchronisation')
  .command('publish', 'Publish content (Foundation, Feature, Project)')
  .parse(process.argv);


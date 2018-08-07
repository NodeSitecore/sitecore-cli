#!/usr/bin/env node

const commander = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

commander
  .version(pkg.version)
  .option(
    '--configPath <path>',
    'Path to .nscrc file'
  )
  .command('init', 'Init a Sitecore Project')
  .command('restore', 'Restore all NuGet Packages')
  .command('nuget <action> [options]', 'Nuget commands')
  .command('run', 'Run a powershell script')
  .command('build', 'Build project solution')
  .command('publish', 'Publish project solution')
  .command('unicorn [action] [configs ...]', 'Perform a Unicorn synchronisation')
  .command('publish', 'Publish content (Foundation, Feature, Project)')
  .command('proxy-server', 'Run a proxy server')
  .parse(process.argv);

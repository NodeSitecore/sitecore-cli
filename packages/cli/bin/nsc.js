#!/usr/bin/env node
const semver = require('semver');
const logger = require('fancy-log');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const requiredVersion = pkg.engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  logger.error(
    chalk.red(
      `You are using Node ${process.version}, but node-sitecore-cli ` +
        `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    )
  );
  process.exit(1);
}

const service = require('../loader.js');

const command = process.argv.slice(2)[0];

service.run(command).catch(err => {
  logger.error(chalk.red(err));
  logger.error(err.stack);
  process.exit(1);
});

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

const execa = require('execa');
const config = require('@node-sitecore/config');
const logger = require('fancy-log');
const chalk = require('chalk');
const path = require('path');

module.exports = {
  exec(cmd, args = [], options = {}) {
    const cwd = path.resolve(config.rootDir);

    cmd = `npm run ${cmd}`;

    logger('Run', `"${chalk.cyan(cmd)}"`);
    logger('rootDir', `"${chalk.cyan(cwd)}"`);
    logger('context', `"${chalk.cyan(config.context)}"`);
    logger('config file', `"${chalk.cyan(config.configPath)}"`);

    const child = execa.shell(`${cmd} ${args.join(' ')}`, {
      cwd,
      maxBuffer: 1024 * 500,
      stdio: 'inherit',
      env: {
        NSC_CONF_PATH: config.configPath,
        NSC_CONF_CONTEXT: config.context
      },
      ...options
    });

    return child;
  }
};

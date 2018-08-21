/* eslint-disable global-require,import/no-dynamic-require,consistent-return,indent,no-shadow */
const fs = require('fs-extra');
const path = require('path');
const readPkg = require('read-pkg');
const logger = require('fancy-log');
const chalk = require('chalk');
const commander = require('commander');
const padEnd = require('string.prototype.padend');
const config = require('@node-sitecore/config');
const PluginAPI = require('./plugin-api');
const { isPlugin } = require('./utils/plugin-resolution');
const getPadLength = require('./utils/get-pad-length');
const getArgs = require('./utils/get-args');

const BUILT_IN_PLUGINS = [
  './commands/init',
  './commands/build',
  './commands/nuget',
  './commands/publish',
  './commands/restore',
  './commands/ps',
  './commands/run',
  './commands/unicorn',
  './commands/inspect'
];

const PARSERS = new Map();
PARSERS.set(Array, v => v.split(','));
PARSERS.set(Number, v => Number(v));
PARSERS.set(String, v => String(v));
PARSERS.set(Boolean, () => true);

/* istanbul ignore next */
const getParserFn = ({ type, pattern, transform }) => {
  if (pattern) {
    return pattern;
  }

  if (transform) {
    return transform;
  }

  if (type) {
    return PARSERS.has(type) ? PARSERS.get(type) : type;
  }

  return undefined;
};

class CliService {
  constructor(context, { pkg } = {}) {
    process.NSC_CLI_SERVICE = this;
    this.initialized = false;
    this.context = context;
    this.commands = {};

    // package.json containing the plugins
    this.pkg = this.resolvePkg(pkg);
    // If there are inline plugins, they will be used instead of those
    // found in package.json.
    this.plugins = this.resolvePlugins();

    // load env variables, load user config, apply plugins
    this.init();
  }

  /**
   *
   * @param inlinePkg
   * @param context
   * @returns {{}}
   */
  resolvePkg(inlinePkg, context = this.context) {
    if (inlinePkg) {
      return inlinePkg;
    }

    if (fs.existsSync(path.join(context, 'package.json'))) {
      return readPkg.sync({ cwd: context });
    }

    return {};
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // apply plugins.
    this.plugins.forEach(({ id, apply }) => {
      apply(new PluginAPI(id, this), config);
    });
  }

  /**
   *
   * @returns {{id: *, apply: *}[]}
   */
  resolvePlugins() {
    const idToPlugin = id => ({
      id: id.replace(/^.\//, 'built-in:'),
      apply: require(id)
    });

    const builtInPlugins = BUILT_IN_PLUGINS.map(idToPlugin);

    const projectPlugins = Object.keys(this.pkg.devDependencies || {})
      .concat(Object.keys(this.pkg.dependencies || {}))
      .filter(isPlugin)
      .map(idToPlugin);

    return builtInPlugins.concat(projectPlugins);
  }

  async run(name) {
    const command = this.commands[name];

    /* istanbul ignore next */
    if (!command && name) {
      logger.error(chalk.red(`command "${name}" does not exist.`));
      process.exit(1);
    }

    if (!command) {
      this.printMan();
      return;
    }

    const {
      fn,
      opts: { type = 'commander', usage, options }
    } = command;

    if (type === 'raw') {
      return fn(getArgs(command));
    }

    commander.version(require('../package').version);

    if (usage) {
      commander.usage(`${chalk.blue(name)} ${usage}`);
    }

    commander.option('--configPath <path>', 'Path to .nscrc file');

    if (options) {
      Object.keys(options).forEach(key => {
        const { description } = options[key];

        commander.option(key, chalk.green(description), getParserFn(options[key]));
      });
    }

    commander.parse(process.argv);

    if (process.argv.indexOf('--help') > -1) {
      commander.outputHelp();
      return;
    }

    return fn(commander, commander.args.slice(1, commander.args.length));
  }

  printMan() {
    console.log('\n  Usage: nsc <command> [options]');
    console.log('\n  Options:\n');
    console.log(`    ${chalk.blue('-h, --help')}        output usage information`);
    console.log(`    ${chalk.blue('-h, --configPath')}  Load a configuration file from specific location path`);
    console.log('\n  Commands:\n');

    const padLength = getPadLength(this.commands);
    for (const name in this.commands) {
      if (name !== 'help') {
        const opts = this.commands[name].opts || {};
        console.log(`    ${chalk.blue(padEnd(name, padLength))}${opts.description || ''}`);
      }
    }
    console.log(`\n  run ${chalk.green('nsc [command] --help')} for usage of a specific command.\n`);
  }
}

module.exports = CliService;

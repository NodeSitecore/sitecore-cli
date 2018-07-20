/* eslint-disable prefer-destructuring */
const execa = require('execa');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const uuidv4 = require('uuid/v4');
const chalk = require('chalk');
const log = require('fancy-log');
const config = require('@node-sitecore/config');

const UNICORN_CONF = 'unicorn-configurations.ashx';

const runScript = (script, options = {}) => {
  const child = execa.shell(`powershell -executionpolicy unrestricted "${script}"`, {
    cwd: `${__dirname}/`,
    maxBuffer: 1024 * 500,
    ...options
  });

  return child;
};

module.exports = {

  getUrl(options) {
    const siteUrl = module.exports.formatUrl(options.siteUrl);
    return `${siteUrl}/unicorn.aspx`;
  },
  /**
   *
   * @param siteUrl
   * @returns {Buffer|T[]|SharedArrayBuffer|Uint8ClampedArray|Uint32Array|Blob|any}
   */
  formatUrl(siteUrl) {
    const lastChar = siteUrl.slice(-1);
    return lastChar === '/' ? siteUrl.slice(0, -1) : siteUrl;
  },
  /**
   *
   * @returns {*}
   */
  sync(options) {
    const url = module.exports.getUrl(options);
    const secret = module.exports.getUnicornSharedSecretKey(options);

    let syncScript = `${path.join(__dirname, '/SyncAll.ps1')} -secret ${secret} -url ${url}`;

    if (options.configs && options.configs.length) {
      syncScript = `${path.join(__dirname, '/Sync.ps1')} -secret ${secret} -url ${url} -configs ${options.configs.join(',')}`;
    }

    const child = runScript(syncScript);

    /* istanbul ignore */
    child.stdout.on('data', (data) => {
      let content = data.toString().trim();

      if (content.match('WARNING:')) {
        content = chalk.yellow(content);
      }

      if (content.match('DEBUG:')) {
        content = chalk.gray(content);
      }

      if (content.match('INFO:')) {
        content = chalk.cyan(content);
      }

      if (content.match('ERROR:')) {
        content = chalk.red(content);
      }

      log(content);
    });

    /* istanbul ignore */
    child.stderr.on('data', (data) => {
      log.error(chalk.red(data.toString().trim()));
    });

    /* istanbul ignore */
    child.catch((err) => {
      log.error(chalk.red(err.message));
      process.exit(-1);
    });

    return child;
  },

  /**
   *
   * @param options
   * @returns {*}
   */
  getUnicornSharedSecretKey(options) {
    if (options.secret) {
      return options.secret;
    }
    try {
      module.exports.writeSharedSecretKey(options.authConfigFile);

      const data = fs.readFileSync(options.authConfigFile);
      const parser = new xml2js.Parser();
      let secret;

      parser.parseString(data, (err, result) => {
        /* istanbul ignore next */
        if (err !== null) throw err;

        secret = result.configuration.sitecore[ 0 ].unicorn[ 0 ].authenticationProvider[ 0 ].SharedSecret[ 0 ];
      });

      return secret;
    } catch (er) {
      /* istanbul ignore next */
      log.error(chalk.red('[error] Unable to read your shared secret key in your Sitecore website. You must run `nsc` under your project root directory.'));
      /* istanbul ignore next */
      return process.exit();
    }
  },
  /**
   *
   * @param src
   */
  writeSharedSecretKey(src) {
    let content = fs.readFileSync(src, { encoding: 'utf8' });

    if (content.indexOf('#{UnicornSecret}') > -1) {
      const secret = uuidv4().toUpperCase();
      content = content.replace('#{UnicornSecret}', secret + secret);

      fs.writeFileSync(src, content, { encoding: 'utf8' });
    }
  },
  /**
   *
   */
  writeUnicornConfigurationsFile() {
    const configPath = path.join(config.websiteRoot, UNICORN_CONF);

    if (!fs.existsSync(configPath)) {
      try {
        fs.copyFileSync(path.join(__dirname, UNICORN_CONF), configPath);
      } catch (er) {
        /* istanbul ignore next */
        log.error(chalk.yellow('[warn] Unable to create configurations file in your Sitecore website.'));
      }
    }
  },
  /**
   *
   * @returns {request}
   */
  getConfigurations(options) {
    module.exports.writeUnicornConfigurationsFile();

    const url = module.exports.getUrl(options);
    const secret = module.exports.getUnicornSharedSecretKey(options);
    const syncScript = `${path.join(__dirname, '/GetConfig.ps1')} -secret ${secret} -url ${url} -configUrl ${options.siteUrl}/${UNICORN_CONF}`;
    const child = runScript(syncScript);

    /* instanbul ignore next */
    child.catch((err) => {
      log.error(chalk.red(err.message));
      process.exit(-1);
    });

    return child.then((response) => JSON.parse(response.stdout.split('----- JSON RESPONSE')[ 1 ].trim()).value);
  }
};

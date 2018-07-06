/* eslint-disable prefer-destructuring */
const execa = require('execa');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const uuidv4 = require('uuid/v4');
const request = require('request-promise-native');
const chalk = require('chalk');
const log = require('fancy-log');
const config = require('@node-sitecore/config');

const UNICORN_CONF = 'unicorn-configurations.ashx';

module.exports = {
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
    const siteUrl = module.exports.formatUrl(options.siteUrl);
    const secret = module.exports.getUnicornSharedSecretKey(options);
    const url = `${siteUrl}/unicorn.aspx`;
    let syncScript = `${path.join(__dirname, '/unicorn/SyncAll.ps1')} -secret ${secret} -url ${url}`;

    if (options.configs && options.configs.length) {
      syncScript = `${path.join(__dirname, '/unicorn/Sync.ps1')} -secret ${secret} -url ${url} -configs ${options.configs.join(',')}`;
    }

    try {
      execa.shellSync(`powershell -executionpolicy unrestricted "${syncScript}"`, {
        cwd: `${__dirname}/unicorn/`,
        maxBuffer: 1024 * 500,
        stdio: ['inherit', 'inherit', 'inherit']
      });
    } catch (er) {
      // / console.error(er);
    }
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

        secret = result.configuration.sitecore[0].unicorn[0].authenticationProvider[0].SharedSecret[0];
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
        fs.copyFileSync(path.join(__dirname, 'unicorn', UNICORN_CONF), configPath);
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
  getConfigurations() {
    module.exports.writeUnicornConfigurationsFile();

    return request.get({ uri: `${config.siteUrl}/${UNICORN_CONF}`, json: true });
  }
};

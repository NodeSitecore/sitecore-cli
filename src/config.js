const path = require('path');
const fs = require('fs');
const log = require('fancy-log');
const chalk = require('chalk');
const formatPath = require('./format-path');

class Config {
  constructor() {
    this.load();
  }


  get(key) {
    return this._config.get(key);
  }

  set(key, value) {
    return this._config.set(key, value);
  }

  has(key) {
    return this._config.has(key);
  }

  get siteUrl() {
    return this.get('siteUrl');
  }

  /**
   *
   * @returns {*|string}
   */
  get authConfigFile() {
    return formatPath(path.join(this.websiteRoot, 'App_config', 'Include', 'Unicorn', 'Unicorn.UI.config'));
  }

  /**
   *
   * @returns {string | void | *}
   */
  get instanceRoot() {
    return formatPath(this.get('instanceRoot').replace(/^\.(\/|\\)/, `${process.cwd()}/`));
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteRoot() {
    return formatPath(path.join(this.instanceRoot, this.get('websiteRoot')));
  }

  /**
   *
   * @returns {*|string}
   */
  get sitecoreLibraries() {
    return formatPath(path.join(this.instanceRoot, this.get('sitecoreLibraries')));
  }

  /**
   *
   * @returns {*|string}
   */
  get licensePath() {
    return formatPath(path.join(this.instanceRoot, this.get('licensePath')));
  }

  /**
   *
   * @returns {string}
   */
  get solutionPath() {
    return formatPath(`./${this.get('solutionName')}.sln`);
  }

  /**
   *
   * @returns {string}
   */
  get projectRoot() {
    return formatPath('./src');
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteViewsPath() {
    return formatPath(path.join(this.websiteRoot, 'Views'));
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteConfigPath() {
    return formatPath(path.join(this.websiteRoot, 'App_Config'));
  }

  get proxyUrls() {
    return this.get('proxyUrls') || [];
  }

  pushProxyUrl(url) {
    const { proxyUrls } = this;

    if (proxyUrls.indexOf(url) === -1) {
      proxyUrls.push(url);
    }

    this.set('proxyUrls', proxyUrls);
    this.writeConfiguration();
  }

  load() {
    this._config = new Map();
    this.set('instanceRoot', formatPath('./build'));
    this.set('siteUrl', 'http://base.dev.local');
    this.set('websiteRoot', formatPath('./Website'));
    this.set('sitecoreLibraries', formatPath('./Website/bin'));
    this.set('licensePath', formatPath('./Data/license.xml'));
    this.set('solutionName', 'Base');
    this.set('buildConfiguration', 'Debug');
    this.set('buildToolsVersion', 15.0);
    this.set('buildMaxCpuCount', 0);
    this.set('buildVerbosity', 'minimal');
    this.set('buildPlatform', 'Any CPU');
    this.set('publishPlatform', 'AnyCpu');
    this.set('runCleanBuilds', 'false');
    this.set('excludeFilesFromDeployment', [ 'packages.config' ]);

    this.readConfiguration();
    this.readDevConfiguration();
  }

  /**
   *
   */
  readConfiguration() {
    if (this.hasConfiguration()) {
      const conf = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.nscrc'), 'utf8'));

      Object.keys(conf).forEach((key) => {
        this.set(key, conf[ key ]);
      });

      this.set('loaded', true);
    }
  }

  /**
   *
   */
  readDevConfiguration() {
    if (this.hasDevConfiguration()) {
      const conf = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.development.nscrc'), 'utf8'));

      Object.keys(conf).forEach((key) => {
        this._config.set(key, conf[ key ]);
      });

      this.set('loaded', true);
    }
  }

  isLoaded() {
    return !!this.get('loaded');
  }

  /* istanbul ignore next */
  checkPreconditions() {
    if (!this.isLoaded()) {
      log.error(chalk.red('`ncs` tool is not executed under a Sitecore project or the `.nscrc` is not initialized for your project. Run `nsc init` before to configure you `.nscrc`.'));
      process.exit();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  hasConfiguration() {
    return fs.existsSync(path.join(process.cwd(), '.nscrc'), 'utf8');
  }

  /**
   *
   * @returns {boolean}
   */
  hasDevConfiguration() {
    return fs.existsSync(path.join(process.cwd(), '.development.nscrc'), 'utf8');
  }

  writeConfiguration() {
    const conf = {};

    this._config.forEach((value, key) => {
      conf[ key ] = value;
    });

    fs.writeFileSync(path.join(process.cwd(), '.nscrc'), JSON.stringify(conf, null, 2), { encoding: 'utf8' });
  }
}

module.exports = new Config();


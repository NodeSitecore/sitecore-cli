const path = require('path');
const fs = require('fs');

class Config {

  constructor() {
    this.load();
  }

  load() {
    this._config = new Map();
    this._config.set('instanceRoot', '.\\build');
    this._config.set('websiteRoot', '.\\Website');
    this._config.set('sitecoreLibraries', '.\\Website\\bin');
    this._config.set('licensePath', '.\\Data\\license.xml');
    this._config.set('solutionName', 'ScProject');
    this._config.set('buildConfiguration', 'Debug');
    this._config.set('buildToolsVersion', 15.0);
    this._config.set('buildMaxCpuCount', 0);
    this._config.set('buildVerbosity', 'minimal');
    this._config.set('buildPlatform', 'Any CPU');
    this._config.set('publishPlatform', 'AnyCpu');
    this._config.set('runCleanBuilds', 'false');

    this.readConfiguration();
    this.readDevConfiguration();
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

  /**
   *
   * @returns {string | void | *}
   */
  get instanceRoot() {
    return this.get('instanceRoot').replace(/^\.\//, process.cwd());
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteRoot() {
    return path.join(this.instanceRoot, this.get('websiteRoot'));
  }

  /**
   *
   * @returns {*|string}
   */
  get sitecoreLibraries() {
    return path.join(this.instanceRoot, this.get('sitecoreLibraries'));
  }

  /**
   *
   * @returns {*|string}
   */
  get licensePath() {
    return path.join(this.instanceRoot, this.get('licensePath'));
  }

  /**
   *
   * @returns {string}
   */
  get solutionPath() {
    return './' + `${this.get('solutionName')}.sln`;
  }

  /**
   *
   * @returns {string}
   */
  get projectRoot() {
    return './src';
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteViewsPath() {
    return path.join(this.websiteRoot, 'Views');
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteConfigPath() {
    return path.join(this.websiteRoot, 'App_Config');
  }

  /**
   *
   */
  readConfiguration() {
    if (this.hasConfiguration()) {
      const conf = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.nscrc'), 'utf8'));

      Object.keys(conf).forEach((key) => {
        this._config.set(key, conf[ key ]);
      });
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


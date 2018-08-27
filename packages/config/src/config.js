const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const defaultModel = require('./default-model');
const resolverFiles = require('./utils/resolve-files');
const { DEFAULT_CONF_PATH } = require('./constant');
const placeholders = require('./placeholders');

class Config {
  constructor(context = process.cwd()) {
    this.init(context);
  }

  /**
   * Load configuration with nconf
   */
  init(context) {
    this.nconf = nconf;
    this.context = context;

    //
    // LOAD env and args variables
    //
    this.nconf.argv().env({ separator: '__' });
    this.nconf.file('default', { file: DEFAULT_CONF_PATH });

    /* istanbul ignore next */
    if (nconf.get('configPath') && !fs.existsSync(this.nconf.get('configPath'))) {
      throw new Error(`Unable to read config file from ${this.nconf.get('configPath')}`);
    }
    //
    // Found
    //

    /* istanbul ignore next */
    const onLoadFiles = fileConf => {
      if (fileConf.type === 'default') {
        this.configPath = fileConf.src;
      }

      nconf.file(fileConf.type, { file: fileConf.src });
    };

    resolverFiles({
      defaultFile: this.nconf.get('configPath') || process.env.NSC_CONF_PATH || DEFAULT_CONF_PATH
    }).forEach(onLoadFiles);

    const rootDir = this.nconf.get('rootDir') || context;

    this.nconf.defaults(defaultModel());
    this.placeholders = placeholders(rootDir, context);
  }

  /**
   * Add a new placeholder.
   * @param pattern
   * @param replacement
   */
  definePlaceholder(pattern, replacement) {
    this.placeholders.unshift({
      pattern: `<${pattern}>`,
      replacement
    });
  }

  /**
   * Create a new getter in configuration class.
   * @param prop
   * @param fn
   */
  defineGetter(prop, fn) {
    if (this[prop] === undefined) {
      Object.defineProperty(this, prop, {
        enumerable: true,
        configurable: false,
        get: fn.bind(this)
      });
    }
  }

  /**
   *
   * @param prop
   * @param fn
   */
  defineMethod(prop, fn) {
    if (this[prop] === undefined) {
      Object.defineProperty(this, prop, {
        enumerable: true,
        configurable: false,
        value: fn.bind(this)
      });
    }
  }

  /**
   *
   */
  create(options = {}) {
    const defaulfConf = defaultModel();

    Object.keys(defaulfConf).forEach(key => {
      this.nconf.set(key, options[key] || this.nconf.get(key));
    });
    this.save();
  }

  /**
   *
   */
  save() {
    this.nconf.save();
  }

  /**
   *
   * @param values
   * @returns {*}
   */
  resolve(obj, ...values) {
    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        if (obj instanceof Array && key === 'length') {
          return acc;
        }

        acc[key] = this.resolve(obj[key]);

        return acc;
      }, obj instanceof Array ? [] : {});
    }

    if (typeof obj !== 'string') {
      return obj;
    }

    let value = path.normalize(path.join(obj, ...values));

    this.placeholders.forEach(placeholder => {
      value = value.replace(placeholder.pattern, placeholder.replacement(this.nconf));
    });

    return value;
  }

  /**
   *
   * @param dir
   * @returns {*}
   */
  toRel(dir) {
    return dir.replace(`${this.rootDir}/`, '');
  }

  /**
   *
   * @returns {string}
   */
  keys() {
    return Object.keys(this.nconf.stores)
      .filter(key => this.nconf.stores[key].type === 'file')
      .reduce((acc, storeKey) => {
        const keys = Object.keys(this.nconf.stores[storeKey].store).filter(confKey => acc.indexOf(confKey) === -1 && confKey !== 'type');

        return acc.concat(keys);
      }, Object.keys(defaultModel()));
  }

  /**
   *
   * @returns {*}
   */
  toObject() {
    return this.keys().reduce((acc, key) => {
      acc[key] = this[key] || this.get(key);
      return acc;
    }, {});
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  get(key) {
    const value = this.nconf.get(key);
    if ((typeof value === 'string' && value.match(/<(.*)>/)) || key === 'outputDir') {
      return this.resolve(key === 'outputDir' ? value.replace(/^\.(\/|\\)/, `${process.cwd()}/`) : value);
    }

    return typeof value === 'object' ? this.resolve(value) : value;
  }

  /**
   *
   * @param key
   * @param value
   * @returns {*}
   */
  set(key, value) {
    if (key === 'outputDir') {
      value = value.replace(process.cwd(), '<rootDir>');
    }

    return this.nconf.set(key, value);
  }

  /**
   *
   * @param key
   * @returns {*}
   */
  has(key) {
    return this.nconf.get(key) !== undefined;
  }

  /**
   *
   * @returns {*}
   */
  get currentWebsite() {
    return this.nconf.get('currentWebsite');
  }

  /**
   *
   * @returns {*}
   */
  get siteUrl() {
    return this.get('siteUrl');
  }

  /**
   * return the path of auth config file required by unicorn synchro task.
   * @returns {*|string}
   */
  get authConfigFile() {
    return this.get('authConfigFilePath');
  }

  /**
   *
   * @returns {*}
   */
  get authConfigFilePath() {
    return this.authConfigFile;
  }

  /**
   * Return the absolute path of the root project.
   * @returns {*|string}
   */
  get rootDir() {
    return this.resolve('<rootDir>');
  }

  /**
   * Return the absolute path of instance (example: `/path/to/build/`).
   * @returns {*|string}
   * @deprecated
   */
  get instanceRoot() {
    return this.outputDir;
  }

  /**
   * Return the absolute path of outputDir where is installed the Sitecore instance (example: `/path/to/build/`).
   * @returns {*|string}
   */
  get outputDir() {
    return this.resolve('<outputDir>');
  }

  /**
   * Return the website root (example: `path/to/build/Website/`).
   * @deprecated
   * @returns {*|string}
   */
  get websiteRoot() {
    return this.websiteDir;
  }

  /**
   * Return the website root (example: `path/to/build/Website/`).
   * @returns {*|string}
   */
  get websiteDir() {
    return this.resolve('<websiteDir>');
  }

  /**
   * Return the website theme root (example: `path/to/build/Website/themes/`).
   * @returns {*|string}
   */
  get themeWebsiteDir() {
    return this.resolve('<themesDir>');
  }

  /**
   * Return the website theme root (example: `path/to/build/Website/themes/`).
   * @returns {*|string}
   * @deprecated
   */
  get themeWebsiteRoot() {
    return this.themeWebsiteDir;
  }

  /**
   * Return the website theme root (example: `path/to/build/Website/themes/`).
   * @returns {*|string}
   */
  get currentWebsiteDir() {
    return this.resolve('<themesDir>', '<currentWebsite>');
  }

  /**
   * Return the website theme root (example: `path/to/build/Website/themes/`).
   * @returns {*|string}
   * @deprecated
   */
  get currentWebsiteRoot() {
    return this.currentWebsiteDir;
  }

  /**
   * Path of the sitecore librairies
   * @returns {*|string}
   */
  get websiteLibrariesDir() {
    return this.get('websiteLibrariesDir');
  }

  /**
   * Path of the sitecore librairies
   * @returns {*|string}
   */
  get sitecoreLibrariesRoot() {
    return this.websiteLibrariesDir;
  }

  /**
   *
   * @returns {*|string}
   */
  get licensePath() {
    return this.get('licensePath');
  }

  /**
   *
   * @returns {string}
   */
  get solutionPath() {
    return this.resolve('<solutionPath>');
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteViewsDir() {
    return this.get('websiteViewsDir');
  }

  /**
   *
   * @deprecated
   * @returns {*|string}
   */
  get websiteViewsRoot() {
    return this.websiteViewsDir;
  }

  /**
   *
   * @returns {*|string}
   */
  get websiteConfigDir() {
    return this.resolve('<websiteDir>', 'App_Config');
  }

  /**
   * @deprecated
   * @returns {*|string}
   */
  get websiteConfigRoot() {
    return this.websiteConfigDir;
  }

  /**
   * Project root directory.
   * @returns {string}
   */
  get srcDir() {
    return this.resolve('<srcDir>');
  }

  /**
   * Project root directory.
   * @returns {string}
   * @deprecated
   */
  get srcRoot() {
    return this.srcDir;
  }

  /**
   *
   * @returns {*}
   */
  get foundationDir() {
    return this.resolve('<foundationDir>');
  }

  /**
   *
   * @returns {*}
   * @deprecated
   */
  get foundationRoot() {
    return this.foundationDir;
  }

  /**
   *
   * @returns {*}
   */
  get foundationScriptsDir() {
    return this.get('foundationScriptsDir');
  }

  /**
   *
   * @deprecated
   * @returns {*}
   */
  get foundationScriptsRoot() {
    return this.foundationScriptsDir;
  }

  /**
   *
   * @returns {*}
   */
  get featureDir() {
    return this.resolve('<featureDir>');
  }

  /**
   *
   * @returns {*}
   * @deprecated
   */
  get featureRoot() {
    return this.featureDir;
  }

  /**
   *
   * @returns {*}
   */
  get projectDir() {
    return this.resolve('<projectDir>');
  }

  /**
   *
   * @deprecated
   * @returns {*}
   */
  get projectRoot() {
    return this.projectDir;
  }

  /**
   * Path to the current project.
   * @returns {*}
   */
  get currentProjectDir() {
    return this.resolve('<currentProjectDir>');
  }

  /**
   * Path to the current project.
   * @returns {*}
   * @deprecated
   */
  get currentProjectRoot() {
    return this.currentProjectDir;
  }

  /**
   *
   * @returns {*}
   */
  get buildPaths() {
    const paths = this.get('buildPaths') || [];
    if (paths.length) {
      return paths.map(p => this.resolve(p));
    }

    /* istanbul ignore next */
    return [this.solutionPath];
  }

  /**
   *
   * @returns {*}
   */
  get publishPaths() {
    const paths = this.get('publishPaths') || [];

    if (paths.length) {
      return paths.map(p => this.resolve(p));
    }

    /* istanbul ignore next */
    return [this.solutionPath];
  }
}

module.exports = Config;

/* eslint-disable global-require,import/no-dynamic-require */
const path = require('path');
const fs = require('fs-extra');

const { DEFAULT_CONF_PATH, ENV } = require('./constant');
/**
 *
 * @type {string}
 */
const DEFAULT_SCOPE = 'current';
/**
 *
 * @type {{FILE: string, LITERAL: string}}
 */
const NCONF_TYPE = {
  FILE: 'file',
  LITERAL: 'literal'
};

module.exports = {
  /**
   * Resolve inheritance files and load all stores in nconf.
   * @param nconf
   * @param defaultModel
   * @returns {{rootDir: *, configPath: *}}
   */
  loadStores(nconf, defaultModel) {
    let configPath;
    //
    // LOAD env and args variables
    //
    nconf.argv().env({ separator: '__' });

    /* istanbul ignore next */
    if (nconf.get('configPath') && !fs.existsSync(nconf.get('configPath'))) {
      throw new Error(`Unable to read config file from ${nconf.get('configPath')}`);
    }
    //
    // Found
    //
    const onLoadStores = ({ type, scope, store, file }) => {
      if (scope === DEFAULT_SCOPE) {
        configPath = file;
      }

      switch (type) {
        case NCONF_TYPE.LITERAL:
          nconf.add(scope, { type, store });
          break;
        case NCONF_TYPE.FILE:
          nconf.file(scope, { file });
          break;

        default:
          break;
      }
    };

    module.exports
      .resolveStores({
        defaultFile: nconf.get('configPath') || process.env.NSC_CONF_PATH || DEFAULT_CONF_PATH
      })
      .forEach(onLoadStores);

    const rootDir = nconf.get('rootDir');

    // Load base configuration
    nconf.defaults(defaultModel);

    return {
      rootDir,
      configPath
    };
  },
  /**
   * Resolve stores inheritance.
   *
   * - Parent configuration
   * - Base configuration
   * - Profile configuration
   *
   * @param parameters
   * @returns {*|Array}
   */
  resolveStores(parameters) {
    const { file = `./${DEFAULT_CONF_PATH}`, cwd = process.cwd(), scope = DEFAULT_SCOPE } = parameters;
    const env = process.env.NODE_ENV || 'development';

    const stores = [
      {
        file,
        type: NCONF_TYPE.FILE,
        scope
      },
      {
        file: `${ENV[env]}${DEFAULT_CONF_PATH}`,
        type: NCONF_TYPE.FILE,
        scope: env
      }
    ];

    return stores.reduce((acc, store) => module.exports.whenResolveStore(acc, store, cwd), []);
  },

  getConfigurationInfo(extendsPath) {
    const dirname = path.dirname(extendsPath);
    const file = path.basename(extendsPath);
    const scope = `${path.basename(dirname)}${file === DEFAULT_CONF_PATH ? '' : file}`;

    return {
      dirname,
      file,
      scope
    };
  },
  /**
   * Look extends keys in the store and try to load the parent file configuration.
   * @param acc
   * @param store
   * @param cwd
   * @returns {*}
   */
  whenResolveStore(acc, store, cwd) {
    if (store.file) {
      const current = module.exports.readConfiguration(store, cwd);

      if (current) {
        acc.push(current);

        if (current.store && current.store.extends) {
          const { file, scope, dirname } = module.exports.getConfigurationInfo(current.store.extends);
          const stores = module.exports.whenResolveStore([], { file, scope }, path.join(cwd, dirname));

          current.store.extends = scope;

          acc = acc.concat(stores);
        }
      }
    }

    return acc;
  },

  readJson(file, store) {
    store.type = NCONF_TYPE.LITERAL;
    store.file = file;
    store.store = fs.readJsonSync(file);

    store.store.rootDir = store.store.rootDir || path.dirname(file);

    return store;
  },

  requireFile(file, store) {
    store.type = NCONF_TYPE.LITERAL;
    store.file = file;
    store.store = { ...require(file) };
    store.store.rootDir = store.store.rootDir || path.dirname(file);

    return store;
  },
  /**
   *
   * @param file
   * @param cwd
   * @returns {*}
   */
  resolveFileName(file, cwd) {
    if (!file.match(/^\.\//) && file.match(/[a-zA-Z]/)) {
      return `${cwd}/${file}`;
    }

    return file.replace(/^\.\//, `${cwd}/`);
  },
  /**
   *
   * @param store
   * @param cwd
   * @returns {*}
   */
  readConfiguration(store, cwd) {
    store.type = NCONF_TYPE.FILE;
    store.file = module.exports.resolveFileName(store.file, cwd);

    if (store.file) {
      if (fs.existsSync(store.file)) {
        return module.exports.readJson(store.file, store);
      }

      const jsonSrc = `${store.file}.json`;
      if (fs.existsSync(jsonSrc)) {
        return module.exports.readJson(jsonSrc, store);
      }

      const moduleSrc = `${store.file}.js`;
      if (fs.existsSync(moduleSrc)) {
        return module.exports.requireFile(moduleSrc, store);
      }
    }

    return false;
  }
};

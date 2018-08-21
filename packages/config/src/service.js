/* eslint-disable global-require,import/no-dynamic-require,consistent-return,indent,no-shadow */
const fs = require('fs-extra');
const path = require('path');
const readPkg = require('read-pkg');
const Config = require('./config');
const { isPlugin, requirePlugin } = require('./utils/plugin-resolution');

class ConfigService {
  constructor(context, { pkg } = {}) {
    process.NSC_CONF_SERVICE = this;
    this.initialized = false;
    this.config = new Config(context);
    this.context = context;

    // Folder containing the target package.json for plugins
    this.pkgContext = context;
    // package.json containing the plugins
    this.pkg = pkg || this.resolvePkg();
    // If there are inline plugins, they will be used instead of those
    // found in package.json.
    this.plugins = this.resolvePlugins();

    this.init();
  }

  /**
   *
   * @param context
   * @returns {{}}
   */
  resolvePkg(context = this.context) {
    if (fs.existsSync(path.join(context, 'package.json'))) {
      return readPkg.sync({ cwd: context });
    }

    return {};
  }

  init(/* mode = process.env.NSC_CLI_MODE */) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // apply plugins.
    this.plugins.forEach(({ apply }) => {
      apply(this.config);
    });

    if ((this.pkg.devDependencies || {})['@node-sitecore/cli']) {
      setTimeout(() => require('@node-sitecore/cli'));
    }
  }

  /**
   *
   * @returns {{id: *, apply: *}[]}
   */
  resolvePlugins() {
    const idToPlugin = id => ({
      id: id.replace(/^.\//, 'built-in:'),
      apply: requirePlugin(id)
    });

    return Object.keys(this.pkg.devDependencies || {})
      .concat(Object.keys(this.pkg.dependencies || {}))
      .filter(isPlugin)
      .map(idToPlugin);
  }
}

module.exports = ConfigService;

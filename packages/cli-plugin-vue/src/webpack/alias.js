const path = require('path');
const { info, chalk } = require('@vue/cli-shared-utils');

module.exports = function buildWebpackAlias(config, webpackConfig) {
  const isProd = process.env.NODE_ENV === 'production';
  const { alias = {} } = config.vueCli;

  Object.keys(alias).forEach(key => {
    const src = path.resolve(alias[key]);

    if (!isProd) {
      info(`Add alias ${chalk.magenta(key)}: '${chalk.cyan(src)}'`);
    }

    webpackConfig.resolve.alias.set(key, src);
  });
};

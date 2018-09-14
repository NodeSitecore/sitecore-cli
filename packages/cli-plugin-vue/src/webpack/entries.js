/* eslint-disable global-require */
const path = require('path');
const { info, chalk } = require('@vue/cli-shared-utils');
const fs = require('fs-extra');
const { done } = require('@vue/cli-shared-utils');
const PostBuild = require('./post-build');

module.exports = function buildWebpackEntries(config, webpackConfig, vueConfig) {
  const { entries } = config.vueCli;
  const { outputDir, baseUrl } = vueConfig;
  const isProd = process.env.NODE_ENV === 'production';

  webpackConfig.entryPoints.clear();

  const cacheGroups = Object.keys(entries).reduce((acc, key) => {
    const { name, paths, mode, extractVendors } = entries[key];

    if (mode && mode !== process.env.NODE_ENV) {
      return acc;
    }

    const wEntry = webpackConfig
      .mode('development')
      .context(webpackConfig.store.get('context'))
      .entry(name);

    paths.forEach(entryPath => {
      if (!isProd) {
        info(`Add entry to ${chalk.magenta(name)}: '${chalk.cyan(entryPath)}'`);
      }
      wEntry.add(entryPath);
    });

    wEntry
      .end()
      .output.path(path.resolve(outputDir))
      .filename('[name].js')
      .publicPath(baseUrl);

    if (extractVendors !== false) {

      acc[name] = {
        test: /[\\/]node_modules[\\/]/,
        name: `vendors.${name}`,
        chunks: chunk => chunk.name === name
      };
    }

    return acc;
  }, {});

  webpackConfig.optimization.splitChunks({ cacheGroups });

  if (isProd) {
    webpackConfig.plugin('post-build').use(PostBuild, [
      () => {
        fs.remove(`${outputDir}/index.html`).then(() => {
          done(`Build complete. The ${chalk.cyan(outputDir)} directory is deployed.\n`);
        });
      }
    ]);
  }
};

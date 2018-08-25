/* eslint-disable global-require */
const path = require('path');
const { info, chalk } = require('@vue/cli-shared-utils');
const fs = require('fs-extra');
const { done } = require('@vue/cli-shared-utils');
const clean = require('./clean');
const PostBuild = require('./post-build');

module.exports = function buildWebpackEntries(config, webpackConfig, { outputDir }) {
  const { entries } = config.vueCli;
  const isProd = process.env.NODE_ENV === 'production';
  const cleanGlob = ['precache-manifest.**', 'service-worker.js', 'vendors.**'];

  const cacheGroups = Object.keys(entries).reduce((acc, key) => {
    const { name, paths, mode } = entries[key];

    if (mode && mode !== process.env.NODE_ENV) {
      return acc;
    }

    const wEntry = webpackConfig.context(webpackConfig.store.get('context')).entry(name);

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
      .publicPath('/');

    acc[name] = {
      test: /[\\/]node_modules[\\/]/,
      name: `vendors.${name}`,
      chunks: chunk => chunk.name === name
    };

    cleanGlob.push(`${name}.**`);

    return acc;
  }, {});

  webpackConfig.optimization.splitChunks({ cacheGroups });

  if (isProd) {
    const outputDestDir = config.vueCli || config.currentWebsiteDir;

    webpackConfig.plugin('post-build').use(PostBuild, [
      () => {
        clean(cleanGlob, { cwd: outputDestDir })
          .then(() => fs.remove(`${outputDir}/index.html`))
          .then(() => fs.copy(outputDir, outputDestDir))
          .then(() => {
            done(`Build complete. The ${chalk.cyan(outputDestDir)} directory is deployed.\n`);
          });
      }
    ]);
  }
};

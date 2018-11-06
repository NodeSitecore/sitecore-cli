/* eslint-disable global-require,prefer-destructuring */
const path = require('path');
const fs = require('fs-extra');
const { info, chalk } = require('@vue/cli-shared-utils');
const resetWebpackConfig = require('./reset');
const buildWebpackEntries = require('./entries');
const buildWebpackAlias = require('./alias');
const buildWebpackAssets = require('./assets');

module.exports = (config, baseVueConfig) => {
  const { scssMixinsPath, scssMixins = [], outputDir = config.currentWebsiteDir, alias } = config.vueCli;
  const isProd = process.env.NODE_ENV === 'production';

  let sass = [scssMixinsPath]
    .concat(scssMixins)
    .filter(mixinsPath => !!mixinsPath && fs.existsSync(scssMixinsPath))
    .reduce(
      (acc, mixinsPath) => {
        acc.data += `\n${fs.readFileSync(mixinsPath, 'utf-8')}`;
        acc.includePaths.push(path.dirname(mixinsPath));

        if (!isProd) {
          info(`Add sass mixins: '${chalk.cyan(mixinsPath)}'`);
        }

        return acc;
      },
      { data: '', includePaths: [] }
    );

  if (sass.includePaths.length === 0) {
    sass = {};
  } else {
    Object.keys(alias).forEach(key => {
      const search = new RegExp(key.replace(/@/, '~'), 'gi');
      info(search.toString());
      sass.data = sass.data.replace(search, alias[key]);
    });
  }

  let baseUrl;

  if (config.vueCli.baseUrl === 'string') {
    baseUrl = config.vueCli.baseUrl;
  } else {
    baseUrl = process.env.NODE_ENV === 'production' ? config.vueCli.baseUrl.production : config.vueCli.baseUrl.development;
  }

  baseUrl = baseUrl.replace(/\\/gi, '/');

  const vueConfig = {
    ...baseVueConfig,
    baseUrl,
    outputDir,

    css: {
      ...baseVueConfig.css,
      loaderOptions: {
        sass
      }
    },

    configureWebpack: {
      ...baseVueConfig.configureWebpack,
      watch: process.argv.indexOf('--watch') > -1
    },

    chainWebpack(webpackConfig) {
      // const isProd = process.env.NODE_ENV === 'production';
      // Reset configuration
      resetWebpackConfig(webpackConfig);

      // if (isProd) {
      //   webpackConfig
      //     .devtool('source-map')
      //     .output.filename('[name].js')
      //     .chunkFilename('[id].js');
      // }

      buildWebpackAlias(config, webpackConfig);
      buildWebpackEntries(config, webpackConfig, vueConfig);
      buildWebpackAssets(config, webpackConfig, vueConfig);

      if (baseVueConfig.chainWebpack) {
        baseVueConfig.chainWebpack(webpackConfig);
      }
    }
  };

  return vueConfig;
};

/* eslint-disable global-require,prefer-destructuring */
const path = require('path');
const fs = require('fs-extra');
const resetWebpackConfig = require('./reset');
const buildWebpackEntries = require('./entries');
const buildWebpackAlias = require('./alias');
const buildWebpackAssets = require('./assets');

module.exports = (config, baseVueConfig) => {
  const { scssMixinsPath, outputDir = config.currentWebsiteDir } = config.vueCli;
  let sass = {};

  if (fs.existsSync(scssMixinsPath)) {
    sass = {
      data: fs.readFileSync(scssMixinsPath, 'utf-8'),
      includePaths: [path.dirname(scssMixinsPath)]
    };
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

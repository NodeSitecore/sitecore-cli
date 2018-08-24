module.exports = function resetWebpackConfig(webpackConfig) {
  webpackConfig.entryPoints.clear();

  if (webpackConfig.plugins.has('copy')) {
    webpackConfig.plugins.delete('copy');
  }

  if (webpackConfig.plugins.has('split-vendor')) {
    webpackConfig.plugins.delete('split-vendor');
  }
};

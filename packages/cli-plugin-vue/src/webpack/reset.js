module.exports = function resetWebpackConfig(webpackConfig) {
  if (webpackConfig.plugins.has('split-vendor')) {
    webpackConfig.plugins.delete('split-vendor');
  }
};

const getAssetPath = require('@vue/cli-service/lib/util/getAssetPath');

module.exports = function buildWebpackAssets(config, webpackConfig, vueConfig) {
  webpackConfig
    .mode('production')
    .devtool('source-map')
    .output.filename(getAssetPath(vueConfig, '[name].js'))
    .chunkFilename(getAssetPath(vueConfig, '[name].js'));
};

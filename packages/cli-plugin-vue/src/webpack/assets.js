const getAssetPath = require('@vue/cli-service/lib/util/getAssetPath');

module.exports = function buildWebpackAssets(config, webpackConfig, vueConfig) {
  const inlineLimit = 10000;

  webpackConfig
    .mode('production')
    .devtool('source-map')
    .output.filename(getAssetPath(vueConfig, '[name].js'))
    .chunkFilename(getAssetPath(vueConfig, '[name].js'));

  webpackConfig.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'Images/[name].[hash:8].[ext]'
    });

  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: 'Icons/[name].[hash:8].[ext]'
    });

  webpackConfig.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'Medias/[name].[hash:8].[ext]'
    });

  webpackConfig.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'Fonts/[name].[hash:8].[ext]'
    });

  if (webpackConfig.plugins.has('extract-css')) {
    webpackConfig.plugin('extract-css').tap(args =>
      args.map(item => ({
        ...item,
        filename: getAssetPath(webpackConfig, '[name].css'),
        chunkFilename: getAssetPath(webpackConfig, '[name].css')
      }))
    );
  }
};

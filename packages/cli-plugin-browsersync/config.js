/**
 *
 * @param {Config} config
 */
module.exports = config => {
  config.defineGetter('browserSync', () =>
    config.resolve({
      https: true,
      port: 8001,
      logLevel: 'debug',
      urls: [],
      ...(config.get('browserSync') || {})
    })
  );

  /**
   *
   * @param url
   */
  config.defineMethod('setBSUrls', url => {
    const { urls } = config.browserSync;

    if (urls.indexOf(url) === -1) {
      urls.push(url);
    }

    config.set('browserSync', { ...config.browserSync, urls });
    config.save();
  });
};

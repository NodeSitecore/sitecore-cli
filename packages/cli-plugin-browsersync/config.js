/**
 *
 * @param {Config} config
 */
module.exports = config => {
  /**
   *
   * @param url
   */
  config.defineMethod('pushProxyUrl', url => {
    const { proxyUrls } = this;

    if (proxyUrls.indexOf(url) === -1) {
      proxyUrls.push(url);
    }

    this.set('proxyUrls', proxyUrls);
    this.save();
  });
  /**
   *
   */
  config.defineGetter('proxyUrls', () => config.get('proxyUrls') || []);
};

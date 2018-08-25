const proxy = require('http-proxy-middleware');

module.exports = () =>
  proxy(['**/translate_a/element.js'], {
    target: `http://translate.google.com/`,
    ws: false,
    changeOrigin: true,
    logLevel: 'silent'
  });

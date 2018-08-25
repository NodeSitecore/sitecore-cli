const proxy = require('http-proxy-middleware');

module.exports = (config, { host, port }) =>
  proxy(
    config.fractal.proxyPattern.concat([
      '**/sockjs-node/**',
      '/**.hot-update.json',
      '/**.hot-update.js',
      '/**.hot-update.js.map',
      'ws://**'
    ]),
    {
      target: `http://${host || 'localhost'}:${port}`,
      ws: true,
      changeOrigin: true,
      logLevel: 'silent'
    }
  );

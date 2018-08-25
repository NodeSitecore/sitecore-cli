const serveStatic = require('serve-static');

module.exports = config => ({
  route: '/assets',
  handle: serveStatic(config.fractal.assetsDir)
});

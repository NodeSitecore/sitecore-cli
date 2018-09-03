/* eslint-disable global-require,import/no-dynamic-require */
/**
 * Run fractal from command line with "node tasks/run-fractal.js"
 * Note: Run `npm run build:fractal` or `gulp fractal:build`
 *
 */
const http = require('http');
const https = require('http');
const fs = require('fs');
const log = require('fancy-log');
const chalk = require('chalk');
const express = require('express');
const config = require('@node-sitecore/config');

module.exports = ({ httpsOptions } = {}) => {
  const { outputDir, middlewaresDir } = config.fractal;
  const app = express();
  const server = !httpsOptions ? http.createServer(app) : https.createServer(httpsOptions, app);

  const portIndex = process.argv.indexOf('--port');
  const port = (portIndex > -1 && process.argv[portIndex + 1]) || 3000;

  app.use(express.static(outputDir));

  const middlewares = require('./src/middlewares')(config, { buildMode: true });

  if (middlewaresDir && fs.existsSync(middlewaresDir)) {
    const mdlwOpts = require(middlewaresDir)(config, { buildMode: true });

    (mdlwOpts.before || []).concat(middlewares).concat(mdlwOpts.after || []);

    middlewares.forEach(mdlw => {
      if (typeof mdlw === 'function') {
        app.use(mdlw);
      } else {
        app.use(mdlw.route, mdlw.handle);
      }
    });
  }

  server.listen(port, () => {
    log(`Fractal running at '${chalk.cyan(`http${httpsOptions ? 's' : ''}://localhost:${server.address().port}`)}'`);
  });
};

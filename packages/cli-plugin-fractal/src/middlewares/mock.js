/* eslint-disable global-require,import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const log = require('fancy-log');

module.exports = config => {
  const { mocksDir, mockRoutes = ['/api'], mockResponseDelay = 0 } = config.fractal;
  const handle = (req, response) => {
    const fileName = req.url.substring(1, req.url.indexOf('?')); //`${}.json`; // '/search?query=123' => 'search'

    const filePathJson = path.join(mocksDir, `${fileName}.json`);
    const filePathJs = path.join(mocksDir, `${fileName}.js`);

    if (fs.existsSync(filePathJson)) {
      setTimeout(() => {
        log(`${chalk.green(req.method)} ${req.url} mocked with ${filePathJson.replace(mocksDir, '')}`);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        fs.createReadStream(filePathJson).pipe(response);
      }, mockResponseDelay);
    } else if (filePathJs) {
      setTimeout(() => {
        log(`${chalk.green(req.method)} ${req.url} mocked with ${filePathJs.replace(mocksDir, '')}`);

        // delegate response
        require(filePathJs)(req, response);
      }, mockResponseDelay);
    }
  };

  return mockRoutes.map(route => ({
    route,
    handle
  }));
};

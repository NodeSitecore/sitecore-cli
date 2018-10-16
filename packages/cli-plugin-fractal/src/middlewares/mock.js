/* eslint-disable global-require,import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const log = require('fancy-log');

module.exports = config => (req, res, next) => {
  const { mocksDir, mockResponseDelay = 0 } = config.fractal;
  const indexOf = req.url.indexOf('?');

  const fileName = req.url.substring(1, indexOf > -1 ? indexOf : undefined); //`${}.json`; // '/search?query=123' => 'search'
  const filePathJson = path.join(mocksDir, `${fileName}.json`);
  const filePathJs = path.join(mocksDir, `${fileName}.js`);

  if (fs.existsSync(filePathJson)) {
    setTimeout(() => {
      log(`${chalk.green(req.method)} ${req.url} mocked with ${filePathJson.replace(mocksDir, '')}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      fs.createReadStream(filePathJson).pipe(res);
    }, mockResponseDelay);
  } else if (fs.existsSync(filePathJs)) {
    setTimeout(() => {
      log(`${chalk.green(req.method)} ${req.url} mocked with ${filePathJs.replace(mocksDir, '')}`);

      // delegate response
      require(filePathJs)(req, res, next);
    }, mockResponseDelay);
  } else {
    next();
  }
};

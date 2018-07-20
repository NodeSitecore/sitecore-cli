// const request = require('request');
// const fs = require('fs');
const execa = require('execa');
const chalk = require('chalk');
const log = require('fancy-log');

module.exports = {
  /**
   *
   * @returns {Promise<any>}
   */
  // updateNuget() {
  //  return new Promise((resolve, reject) => {
  //    request
  //      .get('http://nuget.org/nuget.exe')
  //      .pipe(fs.createWriteStream('nuget.exe'))
  //      .on('close', resolve)
  //      .on('reject', reject);
  //  });
  // },

  /**
   *
   */
  exec(cmd, ...args) {
    const nugetPath = `${__dirname}./nuget.exe`;
    const child = execa(nugetPath, [ cmd ].concat(args), {
      maxBuffer: 1024 * 500
    });

    /* istanbul ignore */
    child.stdout.on('data', (data) => {
      log(data.toString().trim());
    });

    /* istanbul ignore */
    child.stderr.on('data', (data) => {
      log.error(chalk.red(data.toString().trim()));
    });

    /* istanbul ignore */
    child.catch((err) => {
      log.error(chalk.red(err.message));
      process.exit(-1);
    });

    return child;
  }
};

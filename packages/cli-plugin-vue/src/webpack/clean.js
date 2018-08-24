const globby = require('globby');
const fs = require('fs-extra');
const path = require('path');

module.exports = (rules, options = {}) =>
  globby(rules, options).then(paths => Promise.all(paths.map(src => fs.remove(path.join(options.cwd || '', src)))));

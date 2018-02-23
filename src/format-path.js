const isWin = process.platform === 'win32';

/* istanbul ignore next */
module.exports = (path) => {
  return isWin ? path.replace(/\//gi, '\\') : path.replace(/\\/gi, '/');
};
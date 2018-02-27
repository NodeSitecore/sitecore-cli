const isWin = process.platform === 'win32';

/* istanbul ignore next */
module.exports = (path) => (isWin ? path.replace(/\//gi, '\\') : path.replace(/\\/gi, '/'));

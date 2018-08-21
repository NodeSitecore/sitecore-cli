const isWin = process.platform === 'win32';

/**
 *
 * @param path
 * @returns {string}
 */
module.exports = path => (isWin ? path.replace(/\//gi, '\\') : path.replace(/\\/gi, '/'));

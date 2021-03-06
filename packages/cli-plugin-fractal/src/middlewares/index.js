/* eslint-disable global-require */
module.exports = (config, options) => {
  const { buildMode } = options;

  return [buildMode ? (req, res, next) => next() : require('./proxy-webpack')(config, options)];
};

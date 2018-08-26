/* eslint-disable global-require */
module.exports = (config, options) => {
  const { buildMode } = options;

  return [
    require('./google-translate')(config, options),
    buildMode ? (req, res, next) => next() : require('./proxy-webpack')(config, options),
    require('./serve-static')(config, options)
  ].concat(require('./mock')(config, options));
};

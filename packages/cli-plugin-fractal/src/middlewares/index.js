/* eslint-disable global-require */
module.exports = (config, options) => {
  const { buildMode } = options;
  return [
    require('./google-translate')(config, options),
    buildMode ? (req, res, next) => next() : require('./proxy-webpack')(config, options),
    require('./assets')(config, options),
    buildMode ? (req, res, next) => next() : require('./mock')(config, options)
  ];
};

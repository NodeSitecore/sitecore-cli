/* eslint-disable global-require,import/no-dynamic-require */

module.exports = (api, config) => {
  ['src/commands/dev', 'src/commands/build'].forEach(script => {
    require(`./${script}`)(api, config);
  });
};

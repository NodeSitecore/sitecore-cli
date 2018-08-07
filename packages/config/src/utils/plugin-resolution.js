/* eslint-disable global-require,import/no-dynamic-require,no-empty */
const pluginREConfig = /^(@node-sitecore\/|nsc-|@[\w-]+\/nsc-)config-/;
const pluginRECLI = /^(@node-sitecore\/|nsc-|@[\w-]+\/nsc-)cli-plugin-/;

/**
 *
 * @param id
 * @returns {boolean}
 */
/* istanbul ignore next */
exports.isPlugin = id => {
  if (pluginREConfig.test(id)) {
    return true;
  }
  if (pluginRECLI.test(id)) {
    try {
      require.resolve(`${id}/config`);
      return true;
    } catch (er) {}
  }
  return false;
};

/* istanbul ignore next */
exports.requirePlugin = id => (pluginRECLI.test(id) ? require(`${id}/config`) : require(id));

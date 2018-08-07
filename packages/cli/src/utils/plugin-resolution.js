/* eslint-disable global-require,import/no-dynamic-require,no-empty */
const pluginRE = /^(@node-sitecore\/|nsc-|@[\w-]+\/nsc-)cli-plugin-/;
const scopeRE = /^@[\w-]+\//;
/**
 *
 * @param id
 * @returns {boolean}
 */
/* istanbul ignore next */
exports.isPlugin = id => pluginRE.test(id);

/* istanbul ignore next */
exports.matchesPluginId = (input, full) => {
  const short = full.replace(pluginRE, '');

  return (
    // input is full
    full === input ||
    // input is short without scope
    short === input ||
    // input is short with scope
    short === input.replace(scopeRE, '')
  );
};

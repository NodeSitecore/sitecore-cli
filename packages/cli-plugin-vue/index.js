// module.exports = (api, config) => {};

/**
 *
 * @returns {{}}
 */
// get scriptPaths() {
//   const scriptPaths = this.get('scriptPaths') || {};
//
//   return Object.keys(scriptPaths).reduce((acc, key) => {
//     acc[key] = this.resolve(scriptPaths[key]);
//
//     return acc;
//   }, {});
// }

/**
 *
 * @returns {{}}
 */
// get scssPaths() {
//   const scriptPaths = this.get('scssPaths') || {};
//
//   return Object.keys(scriptPaths).reduce((acc, key) => {
//     acc[key] = this.resolve(scriptPaths[key]);
//
//     return acc;
//   }, {});
// }

/**
 * Path to the current project (master or localisation).
 * @returns {*}
 */
// get projectScriptsRoot() {
//  return this.resolve('<currentDir>', 'Scripts');
// }

/**
 *
 * @returns {{'^@Foundation(.*)$': string, '^@Feature(.*)$': string, '^@Project(.*)$': string, '^@Master(.*)$': string, '^@/(.*)$': string}}
 */
// get moduleNameMapper() {
//   return {
//     '^@Foundation(.*)$': `${this.foundationScriptsRoot.replace(process.cwd(), '<rootDir>')}$1`,
//     '^@Feature(.*)$': `${this.featureRoot.replace(process.cwd(), '<rootDir>')}$1`,
//     '^@Project(.*)$': `${this.projectRoot.replace(process.cwd(), '<rootDir>')}$1`,
//     // '^@Master(.*)$': `${this.masterProjectRoot.replace(process.cwd(), '<rootDir>')}$1`,
//     '^@/(.*)$': `${this.srcRoot.replace(process.cwd(), '<rootDir>')}/$1`
//   };
// }

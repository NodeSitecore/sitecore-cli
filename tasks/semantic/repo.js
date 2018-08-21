const gflow = require('gflow');
const fs = require('fs');
const logger = require('fancy-log');
const gulpRepo = require('../gulp/repo');

process.env.GH_TOKEN = '5e3ccfa78331b015885858c2d9c1058d29f640ba';

module.exports = {
  /**
   *
   * @returns {Promise<T | never>}
   */
  async prepare(pluginConfig, context) {
    const { nextRelease: { version } } = context;

    gflow.release.pre();

    logger('Write package.json');

    const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
    pkg.version = version;

    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf8' });

    await gulpRepo.clean();
    await gulpRepo.copy();
  },
  /**
   *
   * @returns {*}
   */
  async publish(pluginConfig) {
    if (pluginConfig.dryRun) {
      return gulpRepo.dryRun();
    }
    return gulpRepo.publish();
  },

  async success(pluginConfig) {
    if (!pluginConfig.dryRun) {
      gflow.release.post();
    }
  }
};

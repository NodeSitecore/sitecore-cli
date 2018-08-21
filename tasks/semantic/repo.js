const gflow = require('gflow');
const execa = require('execa');
const logger = require('fancy-log');
const gulpRepo = require('../gulp/repo');

module.exports = {
  /**
   *
   * @returns {Promise<T | never>}
   */
  async prepare(pluginConfig, context) {
    const {
      nextRelease: { version }
    } = context;

    gflow.release.pre();

    logger('Write package.json');

    const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
    pkg.version = version;

    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf8' });

    await gulpRepo.clean();
    await gulpRepo.copy();

    if (!pluginConfig.dryRun) {
      await gflow.release.post();
    }
  },
  /**
   *
   * @returns {*}
   */
  async publish(pluginConfig) {
    if (pluginConfig.dryRun) {
      return gulpRepo.dryRun().then(() => execa.sync('npm', ['run', 'docs:deploy']));
    }

    return gulpRepo.publish().then(() => execa.sync('npm', ['run', 'docs:deploy']));
  }
};

const gflow = require('gflow');
const CI = require('gflow/src/config/ci');
const fs = require('fs');
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
      const { git, config } = gflow;

      try {
        const { GH_TOKEN } = process.env;
        const {
          repository: { url }
        } = pkg;
        const repository = url.replace('https://', '');

        console.log('[Gflow release]', `Generate release for v${version}`);
        console.log('[Gflow release]', `REPOSITORY:      ${repository}`);
        console.log('[Gflow release]', `RELEASE_BRANCH:  ${config.production}`);
        console.log('[Gflow release]', `MASTER_BRANCH:   ${config.master}`);
        console.log('[Gflow release]', `BUILD:           ${CI.BUILD_NUMBER}`);

        if (GH_TOKEN) {
          console.log('[Gflow release]', `Configure remote repository ${repository}`);
          git.remoteSync('add', CI.ORIGIN, `https://${GH_TOKEN}@${repository}`);
        }

        console.log('[Gflow release]', 'Adding files to commit');
        git.addSync('-A');

        console.log('[Gflow release]', 'Reset .npmrc');
        git.resetSync('--', '.npmrc');

        console.log('[Gflow release]', 'Commit files');
        git.commitSync('-m', `${CI.NAME} build: ${CI.BUILD_NUMBER} v${version} [ci skip]`);
      } catch (er) {}
    }
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

  async success() {
    const { git, config } = gflow;

    console.log('[Gflow release]', `Push to ${config.production}`);

    git.pushSync('--quiet', '--set-upstream', CI.ORIGIN, config.production);
    git.pushSync('-f', CI.ORIGIN, `${config.production}:refs/heads/${config.develop}`);

    execa.sync('npm', ['run', 'docs:deploy']);
  }
};

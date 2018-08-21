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

  async success(pluginConfig, context) {
    const {
      nextRelease: { version }
    } = context;

    const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
    const { git, config } = gflow;
    const {
      repository: { url }
    } = pkg;
    const { GH_TOKEN } = process.env;
    const repository = url.replace('https://', '');

    console.log('[Gflow release]', `Push to ${config.production}`);
    const vuePressPath = './docs/.vuepress/dist';

    git.pushSync('--quiet', '--set-upstream', CI.ORIGIN, config.production);
    git.pushSync('-f', CI.ORIGIN, `${config.production}:refs/heads/${config.develop}`);

    console.log('[Gflow release]', `Build documentation`);

    await execa('npm', ['run', 'docs:build']);

    await execa.shell('git init', {
      cwd: vuePressPath
    });

    await execa.shell('git add -A', {
      cwd: vuePressPath
    });

    await execa.shell(`git commit -m 'Deploy documentation v${version}'`, {
      cwd: vuePressPath
    });

    await execa.shell(`git push -f https://${GH_TOKEN}@${repository} master:gh-pages`, {
      cwd: vuePressPath
    });
  }
};

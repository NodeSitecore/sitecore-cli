const gflow = require('gflow');
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

  async success(pluginConfig, context) {
    const {
      nextRelease: { version }
    } = context;

    const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
    const {
      repository: { url }
    } = pkg;
    const { GH_TOKEN } = process.env;
    const repository = url.replace('https://', '');

    const vuePressPath = './docs/.vuepress/dist';

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

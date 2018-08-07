/* eslint-disable global-require,no-template-curly-in-string */
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const logger = require('fancy-log');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const glob = require('glob');
const readPackageJson = require('read-package-json');
const jeditor = require('gulp-json-editor');
const { sync } = require('execa');
const all = require('./utils/all');

const { outputDir, packagesDir, pkgTemplate, npmAccess, npmScope, ignorePublishPackages = [] } = require('../../repo.config');
/**
 *
 * @returns {Promise<any>}
 */
const readPackage = () =>
  new Promise(resolve => {
    readPackageJson('./package.json', console.error, null, (er, data) => resolve(data));
  });

const toPromise = stream =>
  new Promise((resolve, reject) =>
    stream
      .on('end', resolve)
      .on('finish', resolve)
      .on('error', reject)
  );
/**
 *
 * @returns {*}
 */
const findPackages = () => {
  const list = [];
  const packages = glob
    .sync('*/package.json', {
      cwd: packagesDir
    })
    .reduce((acc, pkg) => {
      const packageName = pkg.split('/')[0];
      const pkgConfig = {
        prority: 0,
        packageName,
        content: JSON.parse(fs.readFileSync(path.join(packagesDir, packageName, 'package.json'), { encode: 'utf8' }))
      };

      acc[`${npmScope}/${packageName}`] = pkgConfig;

      list.push(pkgConfig);

      return acc;
    }, {});

  list.forEach(pkgConfig => {
    const pkg = pkgConfig.content;

    Object.keys(pkg.peerDependencies || {}).forEach(depName => {
      if (packages[depName]) {
        packages[depName].prority++;
      }
    });
  });

  return list.sort((a, b) => a.prority < b.prority).map(pkg => pkg.packageName);
};

module.exports = {
  /**
   *
   * @param g
   */
  clean(g = gulp) {
    const stream = g.src(outputDir, { read: false, allowEmpty: true }).pipe(clean());

    return toPromise(stream);
  },
  /**
   *
   */
  bootstrap() {
    findPackages().map(pkgName => {
      logger('Mount package', chalk.cyan(`'${pkgName}'`));

      sync('npm', ['link', `./${path.join(packagesDir, pkgName)}`], {
        stdio: 'inherit'
      });

      return undefined;
    });

    return Promise.resolve();
  },
  /**
   *
   * @returns {Promise<void | never>}
   * @param g
   */
  copy(g = gulp) {
    return readPackage().then(repoPkg => {
      const { version } = repoPkg;

      logger('Copy packages');

      const stream = g
        .src([`${packagesDir}/**`, `!${packagesDir}/**/node_modules/**`], { base: packagesDir })
        .pipe(replace('0.0.0-PLACEHOLDER', version))
        .pipe(g.dest(`./${path.join(outputDir)}`));

      return toPromise(stream);
    });
  },
  /**
   *
   * @returns {Promise<any | never>}
   * @param g
   */
  writePackages(g = gulp) {
    return readPackage().then(repoPkg => {
      const streams = findPackages().map(pkgName => {
        logger('Write package.json', chalk.cyan(`'${npmScope}/${pkgName}'`));

        return g
          .src([`${outputDir}/${pkgName}/package.json`])
          .pipe(jeditor(pkgTemplate(pkgName, repoPkg)))
          .pipe(g.dest(`${outputDir}/${pkgName}`));
      });

      return all(...streams);
    });
  },
  /**
   *
   * @param g
   */
  build(g = gulp) {
    return Promise.resolve()
      .then(() => module.exports.clean(g))
      .then(() => module.exports.copy(g))
      .then(() => module.exports.writePackages(g));
  },
  /**
   *
   */
  dryRun() {
    findPackages().map(pkgName => {
      logger('Publish package', chalk.cyan(`'${npmScope}/${pkgName}'`));
      const cwd = `./${path.join(outputDir, pkgName)}`;

      try {
        sync('npm', ['pack'], {
          cwd,
          stdio: 'inherit'
        });
      } catch (er) {
        logger(chalk.red(er.message), chalk.red(er.stack));
      }

      return undefined;
    });

    return Promise.resolve();
  },
  /**
   *
   */
  publish() {
    findPackages()
      .filter(pkgName => ignorePublishPackages.indexOf(pkgName) === -1)
      .map(pkgName => {
        logger('Publish package', chalk.cyan(`'${npmScope}/${pkgName}'`));
        const cwd = `./${path.join(outputDir, pkgName)}`;

        try {
          const npmrc = `./${path.join(cwd, '.npmrc')}`;
          fs.writeFileSync(npmrc, '//registry.npmjs.org/:_authToken=${NPM_TOKEN}', { encode: 'utf8' });

          sync('npm', ['publish', '--access', npmAccess], {
            cwd,
            stdio: ['inherit', 'inherit', 'inherit']
          });
        } catch (er) {
          logger(chalk.red(er.message), chalk.red(er.stack));
        }

        return undefined;
      });

    return Promise.resolve();
  }
};

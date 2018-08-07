/* eslint-disable global-require,import/no-dynamic-require */
const path = require('path');
const fs = require('fs-extra');

const { DEFAULT_CONF_PATH, ENV } = require('../constant');

/* istanbul ignore next */
function whenResolveFile(acc, file, cwd) {
  file.src = file.src.replace(/^\.\//, `${cwd}/`);

  if (file.src && fs.existsSync(file.src)) {
    const settings = fs.readJsonSync(file.src);

    if (settings.extends) {
      const fileExtends = settings.extends;
      const dirName = path.dirname(fileExtends);
      const baseName = path.basename(fileExtends);

      acc = acc.concat(
        module.exports({
          cwd: dirName,
          scope: `${path.basename(dirName)}/${baseName}`
        })
      );
    }

    acc.push({ ...file, settings });
  }

  return acc;
}

module.exports = function resolveFiles(parameters) {
  const { defaultFile = `./${DEFAULT_CONF_PATH}`, cwd = process.cwd(), scope = 'default' } = parameters;

  const env = process.env.NODE_ENV || 'development';
  const files = [
    { src: defaultFile, type: scope },
    {
      src: `${ENV[env]}${DEFAULT_CONF_PATH}`,
      type: env
    }
  ];

  return files.reduce((acc, file) => whenResolveFile(acc, file, cwd), []);
};

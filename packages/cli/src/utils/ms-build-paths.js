const config = require('@node-sitecore/config');
const path = require('path');

module.exports = (parameters = {}) => {
  const { process, type = 'solution', paths = [] } = parameters;
  if (paths && paths.length) {
    return paths.map(p => path.normalize(p));
  }
  switch (type) {
    case 'all':
    case 'solution':
    default:
      return (process === 'build' ? config.buildPaths : config.publishPaths).map(p => path.normalize(p));

    case 'Foundation':
      paths.push(`${config.foundationRoot}/**/code/*.csproj`);
      break;

    case 'Feature':
      paths.push(`${config.featureRoot}/**/code/*.csproj`);
      break;

    case 'Project':
      paths.push(`${config.projectRoot}/**/code/*.csproj`);
      break;
  }

  return paths.map(p => path.normalize(p));
};

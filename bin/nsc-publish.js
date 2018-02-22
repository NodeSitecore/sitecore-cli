const commander = require('commander');
const PUBLISH_TYPES = [
  'Foundation',
  'Feature',
  'Projects',
  'Project',
  'Assemblies',
  'Views',
  'Configs'
];

commander
  .usage('[' + PUBLISH_TYPES.join('|') + ']')
  .alias('nsc publish')
  .arguments('<arg1> [arg2]')
  .action((_type_) => {
    options.type = _type_;
  })
  .parse(process.argv);

if (!options.type) {

}

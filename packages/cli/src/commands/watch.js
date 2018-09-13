const watchViews = require('../sitecore/watch-views');

const description = {
  description: 'Watch files and auto-publish it in your Sitecore instance',
  usage: '[views]',
  options: {}
};

module.exports = api => {
  api.registerCommand('watch', description, (commander, args) => {
    const action = args[0];

    switch (action) {
      default:
      case 'views':
        return watchViews();
    }
  });
};

module.exports = {
  title: 'NodeSitecore CLI',
  description: 'An extensible Node.js CLI to build and publish your code on Sitecore instance',
  base: '/sitecore-cli/',
  themeConfig: {
    repo: 'NodeSitecore/sitecore-cli',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        sidebar: {
          '/usage/': [
            {
              title: 'Usage',
              collapsable: false,
              children: ['getting-started', 'configuration']
            }
          ],
          '/dev-guide/': [
            {
              title: 'Plugin Development Guide',
              collapsable: false,
              children: ['', 'config-plugins', 'cli-plugins', 'multiple-projects']
            }
          ]
        },
        nav: [
          {
            text: 'Getting started',
            link: '/usage/getting-started.md'
          },
          {
            text: 'Configuration',
            link: '/usage/configuration.md'
          },
          {
            text: 'Dev guide',
            items: [
              { link: '/dev-guide/', text: 'Introduction' },
              { link: '/dev-guide/config-plugins', text: 'Config plugins' },
              { link: '/dev-guide/cli-plugins', text: 'CLI plugins' },
              { link: '/dev-guide/multiple-projects', text: 'Multiple projects' }
            ]
          },
          {
            text: 'Packages',
            items: [
              { link: '/packages/config.html', text: 'Config' },
              { link: '/packages/cli.html', text: 'CLI' },
              { link: '/packages/browserify.html', text: 'Browserify' }
            ]
          },
          {
            text: 'Releases note',
            link: 'https://github.com/NodeSitecore/sitecore-cli/releases'
          }
        ]
      }
    }
  }
};

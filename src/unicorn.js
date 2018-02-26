const execa = require('execa');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const uuidv4 = require('uuid/v4');

// const unquote = function (str) {
//  return str.replace(/^"(.*)"$/, '$1');
// };

module.exports = {
  /**
   *
   * @param src
   * @returns {Promise<any>}
   */
  /* enumerate(src) {
     return new Promise((resolve, reject) => {

       const itemPaths = [];
       gulp.src(src)
         .pipe(foreach((stream, file) => {
           const itemPath = this.getFullItemPath(file);

           itemPaths.push({
             itemPath,
             path: file.path
           });
           return stream;
         }))
         .pipe(gutil.buffer(() => {
           resolve(itemPaths);
         }))
         .on('error', reject);
     });
   },*/
  /**
   *
   * @returns {*}
   */
  // enumerateItems() {
  //
  //   return this.enumerate([
  //     './src/**/serialization/**/*.yml',
  //     '!./src/**/serialization/Roles/**/*.yml',
  //     '!./src/**/serialization/Users/**/*.yml'
  //   ])
  //     .then((list) => {
  //
  //       return list
  //         .map(item => {
  //           const path = item.path.split('\\');
  //           return path[ path.length - 2 ].split('.').slice(0, 3).join('.');
  //         })
  //         .reduce((acc, value) => {
  //           if (acc.indexOf(value) === -1) {
  //             acc.push(value);
  //           }
  //           return acc;
  //         }, []);
  //
  //     });
  // },

  /**
   *
   */
  // getFullItemPath(itemFile) {
  //  const fileContent = itemFile.contents.toString();
  //  const path = unquote(fileContent.match(/Path:\s*(.*)$/m)[ 1 ]);
  //  const id = unquote(fileContent.match(/ID:\s*(.*)$/m)[ 1 ]);
  //  const dbMatch = fileContent.match(/DB:\s*(.*)$/m);
  //  const db = dbMatch ? dbMatch[ 1 ] : 'master';

  //  return `/${db}${path}/{${id}}/invariant/0`;
  // },
  /**
   *
   * @param userFile
   * @returns {string}
   */
  // getUserPath(userFile) {
  //  const fileContent = userFile.contents.toString();
  //  const userName = fileContent.match(/username:\s*(.*)$/m)[ 1 ];
  //  return `users:${userName}`;
  // },
  /**
   *
   * @param roleFile
   * @returns {string}
   */
  // getRolePath(roleFile) {
  //  const fileContent = roleFile.contents.toString();
  //  const roleName = fileContent.match(/Role:\s*(.*)$/m)[ 1 ];
  //  return `roles:${roleName}`;
  // },
  /**
   *
   * @param siteUrl
   * @returns {Buffer|T[]|SharedArrayBuffer|Uint8ClampedArray|Uint32Array|Blob|any}
   */
  formatUrl(siteUrl) {
    let lastChar = siteUrl.slice(-1);
    return lastChar === '/' ? siteUrl.slice(0, -1) : siteUrl;
  },
  /**
   *
   * @returns {*}
   */
  sync(options) {

    const siteUrl = module.exports.formatUrl(options.siteUrl);
    const secret = module.exports.getUnicornSharedSecretKey(options);
    const url = siteUrl + '/unicorn.aspx';
    let syncScript = path.join(__dirname, '/unicorn/SyncAll.ps1') + ' -secret ' + secret + ' -url ' + url;

    if (options.configs && options.configs.length) {
      syncScript = path.join(__dirname, '/unicorn/Sync.ps1') + ' -secret ' + secret + ' -url ' + url + ' -configs ' + options.configs.join(',');
    }

    try {
      execa.shellSync('powershell -executionpolicy unrestricted "' + syncScript + '"', {
        cwd: __dirname + '/unicorn/',
        maxBuffer: 1024 * 500,
        stdio: [ 'inherit', 'inherit', 'inherit' ]
      });
    } catch (er) {
      /// console.error(er);
    }
  },

  /**
   *
   * @param options
   * @returns {*}
   */
  getUnicornSharedSecretKey(options) {
    if (options.secret) {
      return options.secret;
    }

    module.exports.writeSharedSecretKey(options.authConfigFile);

    const data = fs.readFileSync(options.authConfigFile);
    const parser = new xml2js.Parser();
    let secret;

    parser.parseString(data, (err, result) => {
      /* istanbul ignore next */
      if (err !== null) throw err;

      secret = result.configuration.sitecore[ 0 ].unicorn[ 0 ].authenticationProvider[ 0 ].SharedSecret[ 0 ];
    });

    return secret;
  },
  /**
   *
   * @param src
   */
  writeSharedSecretKey(src) {
    let content = fs.readFileSync(src, { encoding: 'utf8' });

    if (content.indexOf('#{UnicornSecret}') > -1) {
      const secret = uuidv4().toUpperCase();
      content = content.replace('#{UnicornSecret}', secret + secret);
      fs.writeFileSync(src, content, { encoding: 'utf8' });
    }
  }
};
const path = require('path');
const fs = require('fs');

module.exports = config => {
  const { mocksDir } = config.fractal;

  return {
    route: '/api',
    handle: (req, response) => {
      const fileName = `${req.url.substring(1, req.url.indexOf('?'))}.json`; // '/search?query=123' => 'search'
      const filePath = path.join(mocksDir, fileName);

      if (fs.existsSync(filePath)) {
        setTimeout(() => {
          console.log(`Giving out the '${fileName}' mock!`);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          fs.createReadStream(filePath).pipe(response);
        }, 1500);
      } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('ERROR File does not exist');
      }
    }
  };
};

const micro = require('micro');
const { send } = micro;
const mime = require('mime-types');
const match = require('fs-router')(__dirname + '/server');
const fs = require('fs');

const next = require('next');

const isProd = process.env.NODE_ENV === 'production';
const app = next({ dev: !isProd });
const handle = app.getRequestHandler();

const buildStats = isProd
  ? JSON.parse(fs.readFileSync('./.next/build-stats.json', 'utf8').toString())
  : null;

const buildId = isProd
  ? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString()
  : null;

app.prepare().then(() => {
  const server = micro(async (req, res) => {
    const matched = match(req);
    if (matched) {
      return await matched(req, res);
    }
    if (req.url.indexOf('/manifest.') === 0) {
      res.setHeader('Content-Type', mime.lookup(req.url));
      let content = fs.readFileSync('./.next/' + req.url, 'utf8').toString();

      if (isProd && req.url === '/manifest.appcache') {
        content = content
          .split('\n')
          .map((p, i, a) => {
            if (p.indexOf('/_next/-/') === 0) {
              const file = p.replace(`/_next/-/`, '');
              const hash = buildStats[file] ? buildStats[file].hash : buildId;
              return p.replace('/_next/-', '/_next/' + hash);
            }
            return p;
          })
          .join('\n');
      }
      return send(res, 200, content);
    }
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000, production = ' + isProd);
  });
});

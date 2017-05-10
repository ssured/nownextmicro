const micro = require('micro');
const { send } = micro;
const match = require('fs-router')(__dirname + '/server');

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = micro(async (req, res) => {
    const matched = match(req);
    if (matched) {
      return await matched(req, res);
    }
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

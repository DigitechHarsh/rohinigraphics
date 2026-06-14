const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Hostinger passes the Unix socket path in process.env.PORT
const port = process.env.PORT || 3000;

// If it's a Unix socket, clean up any stale socket files before binding
if (typeof port === 'string' && !/^\d+$/.test(port)) {
  if (fs.existsSync(port)) {
    try {
      fs.unlinkSync(port);
      console.log(`Removed stale socket file at: ${port}`);
    } catch (e) {
      console.warn('Could not remove existing socket file:', e.message);
    }
  }
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js Server ready and listening on: ${port}`);
  });
});

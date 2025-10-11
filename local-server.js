import handler from './api/index.js';

// local-server is a tiny wrapper that uses the exported handler and
// the internal Express app behavior for local dev. It expects
// api/index.js to export a default handler compatible with (req,res).

import http from 'http';

const port = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  // handler may return a Promise
  Promise.resolve(handler(req, res)).catch((err) => {
    console.error('Error in handler:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

server.listen(port, () => {
  console.log(`Local server listening on http://localhost:${port}`);
});

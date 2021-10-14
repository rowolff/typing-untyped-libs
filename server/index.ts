import { Http2ServerRequest, Http2ServerResponse } from 'http2';

const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer(
  async (_req: Http2ServerRequest, res: Http2ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const responseBody = { clientToken: 'thetokenfromserver' };
    res.write(JSON.stringify(responseBody));
    res.end();
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
const server = createServer((request, response) => {
  const cleanPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = normalize(join(process.cwd(), cleanPath));
  if (!filePath.startsWith(process.cwd()) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});

server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));

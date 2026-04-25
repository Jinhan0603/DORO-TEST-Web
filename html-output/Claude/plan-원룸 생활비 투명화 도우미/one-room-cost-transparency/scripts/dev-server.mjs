import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const port = Number(process.env.PORT ?? 5173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  const requested = resolve(join(root, cleanPath || 'index.html'));
  return requested.startsWith(root) ? requested : join(root, 'index.html');
}

const server = createServer((request, response) => {
  let filePath = safePath(request.url ?? '/');
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(root, 'index.html');
  }
  const ext = extname(filePath);
  response.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`원룸 생활비 투명화 도우미 로컬 서버: http://localhost:${port}`);
});

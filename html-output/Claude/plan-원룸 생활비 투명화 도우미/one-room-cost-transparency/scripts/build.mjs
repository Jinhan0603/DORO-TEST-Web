import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
['index.html', 'src', 'public'].forEach((entry) => {
  cpSync(join(root, entry), join(dist, entry), { recursive: true });
});
console.log('Build completed: dist/');

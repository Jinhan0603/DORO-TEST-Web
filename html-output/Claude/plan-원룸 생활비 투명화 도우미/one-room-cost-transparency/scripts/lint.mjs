import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const requiredFiles = [
  'index.html',
  'src/main.js',
  'src/styles.css',
  'src/engines/costEngine.js',
  'src/engines/riskEngine.js',
  'AGENTS.md',
  'CODEX_PROMPT.md',
  'CODEX_TASKS.md',
  'docs/PRODUCT_SPEC.md',
  'docs/DESIGN_GUIDE.md',
  'docs/SYSTEM_ARCHITECTURE.md'
];

const missing = requiredFiles.filter((file) => !statSafe(join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  process.exit(1);
}

const jsFiles = walk(join(root, 'src')).filter((file) => file.endsWith('.js'));
const forbidden = [];
for (const file of jsFiles) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('innerHTML') && !text.includes('render')) {
    forbidden.push(`${file}: suspicious innerHTML usage`);
  }
  if (/TODO_PLACEHOLDER/.test(text)) {
    forbidden.push(`${file}: TODO_PLACEHOLDER remains`);
  }
}

if (forbidden.length) {
  console.error(forbidden.join('\n'));
  process.exit(1);
}

console.log(`Lint passed: ${requiredFiles.length} required files, ${jsFiles.length} JS modules checked.`);

function statSafe(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

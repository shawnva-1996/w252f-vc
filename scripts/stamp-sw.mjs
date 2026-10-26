// Run before each deploy: lists the site's files in sw.js and gives it a new
// version, so phones and laptops pick up the update next time they open it.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const files = ['/index.html', '/css/app.css', '/data/songs.json', '/data/presets.json',
  ...readdirSync('img').filter(f => /\.(jpg|png|svg)$/.test(f)).sort().map(f => '/img/' + f),
  ...readdirSync('js').filter(f => f.endsWith('.js')).sort().map(f => '/js/' + f)];
const hash = createHash('sha1');
// index.html carries the version itself, so that line is left out of the sum.
const unstamped = t => t.replace(/<meta name="app-version" content="[^"]*">/, '');
for (const f of files) hash.update(f === '/index.html' ? unstamped(readFileSync('index.html', 'utf8')) : readFileSync('.' + f));
const version = hash.digest('hex').slice(0, 10);
const ext = [
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];
let sw = readFileSync('sw.js', 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`)
  .replace(/const SHELL = \[[^\]]*\];/, `const SHELL = ${JSON.stringify(files)};`);
writeFileSync('sw.js', sw);
let html = readFileSync('index.html', 'utf8');
html = html.replace(/<!-- preload -->[\s\S]*?<!-- \/preload -->/, '<!-- preload -->\n  ' +
  [...files.filter(f => f.startsWith('/js/')), ...ext.filter(u => u.includes('firebasejs'))].map(f => `<link rel="modulepreload" href="${f}">`).join('\n  ') + '\n  <!-- /preload -->');
html = html.replace(/<meta name="app-version" content="[^"]*">/, `<meta name="app-version" content="${version}">`);
writeFileSync('index.html', html);
console.log('sw version', version, files.length, 'files');

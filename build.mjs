// Netlify build: site-src/ → dist/, орчны хувьсагчаас config.js ба _redirects үүсгэнэ.
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

// Хавтсуудыг (site-src, netlify) bundle.json-оос задлана — GitHub дээр хавтас оруулах шаардлагагүй болгоно.
if (existsSync('bundle.json')) {
  const b = JSON.parse(readFileSync('bundle.json', 'utf8'));
  for (const [p, data] of Object.entries(b)) {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, Buffer.from(data, 'base64'));
  }
  console.log('bundle задарлаа:', Object.keys(b).length, 'файл');
}

const need = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
for (const k of need) if (!process.env[k]) { console.error(`Орчны хувьсагч дутуу: ${k}`); process.exit(1); }
const url = process.env.SUPABASE_URL.replace(/\/+$/, '');
const root = process.env.ROOT_DOMAIN || 'splus.news';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('site-src', 'dist', { recursive: true });
if (existsSync('dist/index.html') === false) { console.error('site-src/index.html алга'); process.exit(1); }

writeFileSync('dist/config.js',
  `window.SP_CONFIG=${JSON.stringify({ SUPABASE_URL: url, SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY, ROOT_DOMAIN: root })};\n`);

writeFileSync('dist/_redirects', [
  `/_blob/*  ${url}/storage/v1/object/public/media/:splat  200`,
  `/n/*  /index.html  200`,
  ''
].join('\n'));

console.log('build OK →', url);

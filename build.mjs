// Netlify build: site-src/ → dist/, орчны хувьсагчаас config.js ба _redirects үүсгэнэ.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';

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

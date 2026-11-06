// Renders the app to static HTML after the CRA build, so Google and link
// previews see the full page instead of an empty <div id="root">.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, rmSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const out = path.resolve('build/.prerender.cjs');

await build({
  entryPoints: ['src/App.jsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react-dom'],
  outfile: out,
  logLevel: 'error',
});

const React = require('react');
const { renderToString } = require('react-dom/server');
const mod = require(out);
const App = mod.default;
const html = renderToString(React.createElement(App));

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: mod.FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const file = 'build/index.html';
let page = readFileSync(file, 'utf8');
if (!page.includes('<div id="root"></div>')) throw new Error('root div not found');
page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
page = page.replace('</head>', `<script type="application/ld+json">${JSON.stringify(faqLd).replace(/</g, '\\u003c')}</script></head>`);
writeFileSync(file, page);
rmSync(out);
console.log(`Prerendered ${html.length} characters into build/index.html`);

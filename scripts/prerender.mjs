// Renders the app to static HTML after the CRA build, so Google and link
// previews see the full page instead of an empty <div id="root">.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'fs';
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

// Static recipe pages, recipes index, 404 and sitemap
const pagesOut = path.resolve('build/.pages.cjs');
await build({
  entryPoints: ['src/RecipePages.jsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react-dom'],
  outfile: pagesOut,
  logLevel: 'error',
});
const { renderToStaticMarkup } = require('react-dom/server');
const P = require(pagesOut);
const writePage = (rel, el) => {
  const dir = path.join('build', rel);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), '<!DOCTYPE html>' + renderToStaticMarkup(el));
};
const { RECIPES, recipeSlug } = mod;
const urls = [P.SITE + '/', P.SITE + '/recipes/'];
writePage('recipes', React.createElement(P.RecipeIndex));
for (const r of RECIPES) {
  writePage(`recipes/${recipeSlug(r)}`, React.createElement(P.RecipePage, { r }));
  urls.push(`${P.SITE}/recipes/${recipeSlug(r)}/`);
}
writeFileSync('build/404.html', '<!DOCTYPE html>' + renderToStaticMarkup(React.createElement(P.NotFound)));
const today = new Date().toISOString().slice(0, 10);
writeFileSync('build/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n');
rmSync(pagesOut);
console.log(`Wrote ${RECIPES.length} recipe pages, recipes index, 404 and sitemap (${urls.length} URLs)`);
console.log(`Prerendered ${html.length} characters into build/index.html`);

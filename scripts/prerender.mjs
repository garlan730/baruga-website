// Writes static HTML for every page after `vite build` + the SSR build, so search engines
// and link previews get real content, per-page meta tags, and a 200 status for each route.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const { render, PAGES, SITE_URL, OG_IMAGE, jsonLdFor } = await import(path.join(ssrDir, 'entry-server.js'))

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function head(page, { noindex = false } = {}) {
  const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`
  const ld = noindex ? [] : jsonLdFor(page.path)
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="id_ID" />',
    `<meta property="og:site_name" content="Baruga Medical Center" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...ld.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
}

function page(p, opts) {
  return template
    .replace('<!--seo-head-->', head(p, opts))
    .replace('<div id="root"></div>', `<div id="root">${render(p.path)}</div>`)
}

// /vaksin-umroh -> dist/vaksin-umroh.html: GitHub Pages serves it at the extensionless URL
// with a 200 and no trailing-slash redirect, so it matches the canonical URL.
for (const p of PAGES) {
  const file = p.path === '/' ? 'index.html' : `${p.path.slice(1)}.html`
  await writeFile(path.join(dist, file), page(p))
  console.log('prerendered', p.path, '->', file)
}

// Unknown URLs: GitHub Pages serves 404.html with a 404 status; show the home page, not indexed.
await writeFile(path.join(dist, '404.html'), page(PAGES[0], { noindex: true }))

const today = new Date().toISOString().slice(0, 10)
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

await rm(ssrDir, { recursive: true, force: true })
console.log('wrote 404.html, sitemap.xml, robots.txt')

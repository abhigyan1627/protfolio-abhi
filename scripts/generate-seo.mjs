// Generates robots.txt and sitemap.xml in /public from the site configuration and route list.
// Runs automatically before `npm run build`. The sitemap is only written once siteConfig.websiteUrl is set,
// because a sitemap with placeholder URLs would be invalid.
import { rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/config/siteConfig.js'
import { sitePages } from '../src/data/pages.js'
import { services } from '../src/data/services.js'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

function originOf(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.origin : ''
  } catch {
    return ''
  }
}

const base = originOf(siteConfig.websiteUrl)
const lastmod = new Date().toISOString().slice(0, 10)

const robotsLines = ['User-agent: *', 'Allow: /']
if (base) robotsLines.push('', `Sitemap: ${base}/sitemap.xml`)
await writeFile(join(publicDir, 'robots.txt'), `${robotsLines.join('\n')}\n`)

const sitemapPath = join(publicDir, 'sitemap.xml')

if (!base) {
  await rm(sitemapPath, { force: true })
  console.warn('[seo] siteConfig.websiteUrl is not set. sitemap.xml was not generated.')
} else {
  const entries = [
    ...sitePages.map((page) => ({ path: page.path, priority: page.priority })),
    ...services.map((service) => ({ path: `/services/${service.id}`, priority: '0.7' })),
  ]
  const urls = entries
    .map(
      ({ path, priority }) =>
        `  <url>\n    <loc>${base}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join('\n')
  await writeFile(
    sitemapPath,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

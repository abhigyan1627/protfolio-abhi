// Runs after `vite build`. Writes robots.txt and sitemap.xml into dist/ using the public site URL.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const siteUrl = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '');
const apiBase = (process.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const distDir = new URL('../dist/', import.meta.url);

const STATIC_PATHS = ['/', '/services', '/pricing', '/about', '/resources', '/contact', '/privacy-policy', '/terms'];

async function fetchItems(path) {
  // Relative API paths (for example /api) only resolve on the deployed site, so they are skipped here.
  if (!/^https?:\/\//.test(apiBase)) return [];
  try {
    const response = await fetch(`${apiBase}${path}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const body = await response.json();
    return Array.isArray(body.items) ? body.items : [];
  } catch {
    return [];
  }
}

const robotsLines = ['User-agent: *', 'Allow: /', 'Disallow: /admin/'];
if (siteUrl) robotsLines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
await writeFile(fileURLToPath(new URL('robots.txt', distDir)), `${robotsLines.join('\n')}\n`);

if (!siteUrl) {
  console.warn('VITE_SITE_URL is not set. Skipped sitemap.xml. Set it before building for production.');
} else {
  const services = await fetchItems('/services');
  const resources = await fetchItems('/resources');
  if (services.length === 0 || resources.length === 0) {
    console.warn('Could not load services or resources from the API. The sitemap includes only static pages.');
  }

  const paths = [
    ...STATIC_PATHS,
    ...services.map((service) => `/services/${service.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(fileURLToPath(new URL('sitemap.xml', distDir)), xml);
  console.log(`Wrote sitemap.xml with ${paths.length} URLs.`);
}

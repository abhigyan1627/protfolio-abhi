import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './src/config/siteConfig.js'

/** Fills firm-specific values into index.html so the static tags always match src/config/siteConfig.js. */
function siteHtml() {
  return {
    name: 'site-html',
    transformIndexHtml(html) {
      const base = siteConfig.websiteUrl.replace(/\/$/, '')
      const image = base ? `${base}${siteConfig.seo.ogImage}` : siteConfig.seo.ogImage
      return html
        .replaceAll('%SITE_TITLE%', siteConfig.seo.defaultTitle)
        .replaceAll('%SITE_DESCRIPTION%', siteConfig.description)
        .replaceAll('%SITE_NAME%', siteConfig.firmName)
        .replaceAll('%OG_IMAGE%', image)
        .replaceAll('%OG_LOCALE%', siteConfig.seo.locale)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteHtml()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
})

import { useEffect } from 'react'
import { siteConfig } from '../config/siteConfig'

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = href
}

/** Absolute URL for a path, or '' until websiteUrl is configured. */
export function absoluteUrl(path = '/') {
  return siteConfig.websiteUrl ? `${siteConfig.websiteUrl.replace(/\/$/, '')}${path}` : ''
}

/**
 * Sets the page title, description, Open Graph and canonical tags for the current route.
 * The site is a client-rendered single-page app, so these tags are updated on each navigation.
 */
export function useDocumentMeta({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.firmName}` : siteConfig.seo.defaultTitle
    const url = absoluteUrl(path)

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    if (url) upsertMeta('property', 'og:url', url)
    upsertCanonical(url)
  }, [title, description, path])
}

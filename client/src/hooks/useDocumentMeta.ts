import { useEffect } from 'react';
import { absoluteUrl } from '../config/business';

interface DocumentMeta {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

// Sets title, description, canonical and Open Graph tags for the current route.
export function useDocumentMeta({ title, description, path, type = 'website', noindex = false }: DocumentMeta) {
  useEffect(() => {
    const url = absoluteUrl(path);
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', 'CA Mohit Agrawal');
    upsertMeta('name', 'twitter:card', 'summary');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, type, noindex]);
}

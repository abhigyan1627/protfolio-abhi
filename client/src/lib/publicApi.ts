import { API_BASE_URL } from '../config/business';
import { apiRequest } from './api';
import type {
  Audience,
  EnquiryReceipt,
  Faq,
  FaqScope,
  Plan,
  PublicSettings,
  Resource,
  ResourceSummary,
  Service,
  ServiceCategory,
} from '../types/api';

const get = <T>(path: string, signal?: AbortSignal) => apiRequest<T>(API_BASE_URL, path, { signal });

const withQuery = (path: string, params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

export const publicApi = {
  health: (signal?: AbortSignal) => get<{ status: string }>('/health', signal),

  services: (signal?: AbortSignal, category?: ServiceCategory) =>
    get<{ items: Service[] }>(withQuery('/services', { category }), signal).then((response) => response.items),

  service: (slug: string, signal?: AbortSignal) => get<Service>(`/services/${encodeURIComponent(slug)}`, signal),

  plans: (signal?: AbortSignal, filter: { audience?: Audience; serviceCategory?: ServiceCategory } = {}) =>
    get<{ items: Plan[] }>(withQuery('/plans', filter), signal).then((response) => response.items),

  plan: (slug: string, signal?: AbortSignal) => get<Plan>(`/plans/${encodeURIComponent(slug)}`, signal),

  faqs: (signal?: AbortSignal, scope?: FaqScope) =>
    get<{ items: Faq[] }>(withQuery('/faqs', { scope }), signal).then((response) => response.items),

  resources: (signal?: AbortSignal) =>
    get<{ items: ResourceSummary[] }>('/resources', signal).then((response) => response.items),

  resource: (slug: string, signal?: AbortSignal) => get<Resource>(`/resources/${encodeURIComponent(slug)}`, signal),

  settings: (signal?: AbortSignal) => get<PublicSettings>('/site-settings/public', signal),

  submitEnquiry: (payload: Record<string, unknown>) =>
    apiRequest<EnquiryReceipt>(API_BASE_URL, '/enquiries', { method: 'POST', body: payload }),
};

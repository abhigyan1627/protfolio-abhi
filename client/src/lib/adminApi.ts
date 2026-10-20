import { API_BASE_URL } from '../config/business';
import { apiRequest } from './api';
import type {
  AdminDashboard,
  AdminFaq,
  AdminPlan,
  AdminResource,
  AdminService,
  AdminSettings,
  AdminUser,
  EnquiryDetail,
  EnquirySummary,
  EnquiryStatus,
  Paginated,
} from '../types/api';

// The CSRF token is issued with the session (login and /me) and must accompany every state-changing request.
let csrfToken = '';

export function setAdminCsrfToken(token: string) {
  csrfToken = token;
}

const read = <T>(path: string, signal?: AbortSignal) =>
  apiRequest<T>(API_BASE_URL, `/admin${path}`, { signal });

const write = <T>(method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown) =>
  apiRequest<T>(API_BASE_URL, `/admin${path}`, { method, body, csrfToken });

export interface EnquiryQuery {
  status?: EnquiryStatus | '';
  q?: string;
  page: number;
  pageSize?: number;
}

export const adminApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: AdminUser; csrfToken: string }>(API_BASE_URL, '/admin/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  logout: () => write<void>('POST', '/auth/logout'),
  me: (signal?: AbortSignal) => read<{ user: AdminUser; csrfToken: string }>('/auth/me', signal),

  dashboard: (signal?: AbortSignal) => read<AdminDashboard>('/dashboard', signal),

  enquiries: (query: EnquiryQuery, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: String(query.page), pageSize: String(query.pageSize ?? 20) });
    if (query.status) params.set('status', query.status);
    if (query.q) params.set('q', query.q);
    return read<Paginated<EnquirySummary>>(`/enquiries?${params.toString()}`, signal);
  },
  enquiry: (id: string, signal?: AbortSignal) => read<EnquiryDetail>(`/enquiries/${id}`, signal),
  updateEnquiry: (id: string, patch: { status?: EnquiryStatus; internalNote?: string | null }) =>
    write<EnquiryDetail>('PATCH', `/enquiries/${id}`, patch),

  services: (signal?: AbortSignal) =>
    read<{ items: AdminService[] }>('/services', signal).then((response) => response.items),
  createService: (body: unknown) => write<AdminService>('POST', '/services', body),
  updateService: (id: string, body: unknown) => write<AdminService>('PATCH', `/services/${id}`, body),
  deleteService: (id: string) => write<void>('DELETE', `/services/${id}`),

  plans: (signal?: AbortSignal) => read<{ items: AdminPlan[] }>('/plans', signal).then((response) => response.items),
  createPlan: (body: unknown) => write<AdminPlan>('POST', '/plans', body),
  updatePlan: (id: string, body: unknown) => write<AdminPlan>('PATCH', `/plans/${id}`, body),
  deletePlan: (id: string) => write<void>('DELETE', `/plans/${id}`),

  faqs: (signal?: AbortSignal) => read<{ items: AdminFaq[] }>('/faqs', signal).then((response) => response.items),
  createFaq: (body: unknown) => write<AdminFaq>('POST', '/faqs', body),
  updateFaq: (id: string, body: unknown) => write<AdminFaq>('PATCH', `/faqs/${id}`, body),
  deleteFaq: (id: string) => write<void>('DELETE', `/faqs/${id}`),

  resources: (signal?: AbortSignal) =>
    read<{ items: AdminResource[] }>('/resources', signal).then((response) => response.items),
  createResource: (body: unknown) => write<AdminResource>('POST', '/resources', body),
  updateResource: (id: string, body: unknown) => write<AdminResource>('PATCH', `/resources/${id}`, body),
  deleteResource: (id: string) => write<void>('DELETE', `/resources/${id}`),

  settings: (signal?: AbortSignal) => read<AdminSettings>('/settings', signal),
  updateSettings: (body: unknown) =>
    write<{ settings: AdminSettings }>('PATCH', '/settings', body).then((response) => response.settings),
};

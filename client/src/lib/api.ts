export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: ApiFieldError[] | undefined;

  constructor(message: string, status: number, code: string, fields?: ApiFieldError[]) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const NETWORK_ERROR_MESSAGE =
  'We could not reach the server. Please check your connection, or contact us on WhatsApp.';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  csrfToken?: string;
  signal?: AbortSignal;
}

// Requests go to VITE_API_BASE_URL, or to /api when the frontend and API share a host (via dev proxy or rewrite).
export async function apiRequest<T>(apiBase: string, path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.csrfToken) headers['X-CSRF-Token'] = options.csrfToken;

  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiRequestError(NETWORK_ERROR_MESSAGE, 0, 'NETWORK_ERROR');
  }

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as { error?: { message?: string; code?: string; fields?: ApiFieldError[] } } | null)?.error;
    throw new ApiRequestError(
      error?.message ?? 'Something went wrong. Please try again.',
      response.status,
      error?.code ?? 'HTTP_ERROR',
      error?.fields,
    );
  }

  return payload as T;
}

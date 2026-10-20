import { ApiRequestError } from './api';

// Returns the server's message for API errors, or the supplied fallback for anything else.
export function messageFromError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return error instanceof ApiRequestError ? error.message : fallback;
}

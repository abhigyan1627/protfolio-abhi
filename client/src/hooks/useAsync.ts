import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { ApiRequestError } from '../lib/api';
import { messageFromError } from '../lib/errors';

interface AsyncState<T> {
  status: 'loading' | 'success' | 'error';
  data: T | undefined;
  error: string | null;
  errorStatus: number | null;
}

// Runs a loader on mount and whenever deps change. Ignores results from superseded requests.
export function useAsync<T>(load: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: undefined, error: null, errorStatus: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ status: 'loading', data: previous.data, error: null, errorStatus: null }));

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data, error: null, errorStatus: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          data: undefined,
          error: messageFromError(error, 'We could not load this content.'),
          errorStatus: error instanceof ApiRequestError ? error.status : null,
        });
      });

    return () => controller.abort();
    // The caller controls when the loader re-runs through deps and retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, loading: state.status === 'loading', retry };
}

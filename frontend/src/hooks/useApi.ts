import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data from the API.
 * Usage: const { data, loading, error, refetch } = useApi(() => getTransactions())
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Something went wrong.';
      setState({ data: null, loading: false, error: msg });
      // If 401, clear token and redirect
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        window.location.href = '/signin';
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

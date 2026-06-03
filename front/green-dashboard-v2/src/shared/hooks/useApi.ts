import { useState, useCallback } from 'react';
import { useToast } from './useToast';

type ApiFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export function useApi<T, Args extends any[] = []>(
  apiFunction: ApiFunction<T, Args>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { success, error: showError } = useToast();

  const execute = useCallback(async (...args: Args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      options.onSuccess?.(result);
      if (options.showToast) {
        success('Operation completed successfully');
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      options.onError?.(err);
      if (options.showToast) {
        showError(errorMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, options, success, showError]);

  return {
    execute,
    isLoading,
    error,
    data
  };
} 
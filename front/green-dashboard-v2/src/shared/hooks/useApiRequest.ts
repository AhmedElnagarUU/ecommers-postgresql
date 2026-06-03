import { useState, useCallback } from 'react';
import { useApiError } from './useApiError';

interface UseApiRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApiRequest = <T>({ onSuccess, onError }: UseApiRequestOptions<T> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useApiError();

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiCall();
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = handleError(err);
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, onSuccess, onError]
  );

  return {
    isLoading,
    error,
    execute,
  };
}; 
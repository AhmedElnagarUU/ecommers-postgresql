import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/shared/lib/axios';

export const useApiError = () => {
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data as ApiErrorResponse;
      return errorResponse?.error || 'An unexpected error occurred';
    }
    return 'An unexpected error occurred';
  };

  return { handleError };
};  
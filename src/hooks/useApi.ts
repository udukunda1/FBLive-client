import { useState, useCallback } from 'react';
import { handleApiError, ApiError, logError } from '../utils/errorHandler';
import { buildApiUrl } from '../utils/apiConfig';

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
  showErrorNotification?: boolean;
}

interface UseApiReturn {
  loading: boolean;
  error: ApiError | null;
  execute: (url: string, options?: RequestInit) => Promise<unknown>;
  clearError: () => void;
}

export const useApi = (options: UseApiOptions = {}): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (url: string, requestOptions: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build the full API URL if it's a relative endpoint
      const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
      const response = await fetch(fullUrl, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          type: 'server',
          status: response.status,
          details: response.statusText
        };
        
        logError(apiError, 'API Request');
        setError(apiError);
        options.onError?.(apiError);
        throw apiError;
      }

      const data = await response.json();
      options.onSuccess?.(data);
      return data;

    } catch (err) {
      const apiError = handleApiError(err);
      logError(apiError, 'API Request');
      setError(apiError);
      options.onError?.(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

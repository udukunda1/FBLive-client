export interface ApiError {
  message: string;
  type: 'network' | 'server' | 'client' | 'unknown';
  status?: number;
  details?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  // Network errors (server not responding, CORS, etc.)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Server is not responding. Please check if the backend is running.',
      type: 'network',
      details: error.message
    };
  }

  // HTTP errors with response
  if (error instanceof Response) {
    return {
      message: `HTTP ${error.status}: ${error.statusText}`,
      type: 'server',
      status: error.status,
      details: error.statusText
    };
  }

  // Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
      details: error.stack
    };
  }

  // Unknown errors
  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
    details: String(error)
  };
};

export const isServerOffline = (error: ApiError): boolean => {
  return error.type === 'network' || (error.type === 'server' && error.status === 0);
};

export const getErrorMessage = (error: ApiError): string => {
  switch (error.type) {
    case 'network':
      return 'Server is not responding. Please check if the backend is running.';
    case 'server':
      return error.message;
    case 'client':
      return 'Invalid request. Please check your input.';
    default:
      return error.message || 'An unexpected error occurred';
  }
};

export const logError = (error: ApiError, context?: string): void => {
  console.error(`[${context || 'API Error'}]:`, {
    message: error.message,
    type: error.type,
    status: error.status,
    details: error.details
  });
};

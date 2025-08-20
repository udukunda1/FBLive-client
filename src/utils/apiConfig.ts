// API Configuration
const getApiUrl = (): string => {
  // Use environment variable if available, otherwise fallback to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.51.238.232:3000';
  
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
};

export const API_BASE_URL = getApiUrl();

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

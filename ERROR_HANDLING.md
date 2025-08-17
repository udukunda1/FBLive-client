# Error Handling System

This document describes the comprehensive error handling system implemented in the FBLive frontend application.

## Overview

The error handling system provides:
- Real-time server status monitoring
- User-friendly error notifications
- Automatic error recovery
- Detailed error logging
- Network connectivity detection

## Components

### 1. ErrorNotification Component
- **Location**: `src/components/ErrorNotification.tsx`
- **Purpose**: Displays error messages to users with auto-dismiss functionality
- **Features**:
  - Auto-hide after 8 seconds
  - Different styles for error, warning, and info types
  - Smooth animations
  - Manual dismiss option

### 2. ServerStatus Component
- **Location**: `src/components/ServerStatus.tsx`
- **Purpose**: Monitors server connectivity and displays current status
- **Features**:
  - Real-time status checking (every 30 seconds)
  - Visual status indicators
  - Troubleshooting tips when server is offline
  - Manual refresh option

### 3. Error Handler Utilities
- **Location**: `src/utils/errorHandler.ts`
- **Purpose**: Centralized error processing and categorization
- **Features**:
  - Categorizes errors (network, server, client, unknown)
  - Provides user-friendly error messages
  - Detailed error logging
  - Server offline detection

### 4. useApi Hook
- **Location**: `src/hooks/useApi.ts`
- **Purpose**: Custom hook for API calls with built-in error handling
- **Features**:
  - Automatic error handling
  - Loading states
  - Success/error callbacks
  - Consistent error formatting

## Error Types

### Network Errors
- **Cause**: Server not responding, CORS issues, network connectivity
- **Detection**: `TypeError` with fetch-related messages
- **User Message**: "Server is not responding. Please check if the backend is running."

### Server Errors
- **Cause**: HTTP error responses (4xx, 5xx)
- **Detection**: Response status codes
- **User Message**: HTTP status with description

### Client Errors
- **Cause**: Invalid requests, validation errors
- **Detection**: 4xx status codes
- **User Message**: "Invalid request. Please check your input."

### Unknown Errors
- **Cause**: Unexpected errors, unhandled exceptions
- **Detection**: Generic error objects
- **User Message**: "An unexpected error occurred"

## Usage Examples

### Basic Error Handling
```typescript
import { useApi } from '../hooks/useApi';

const MyComponent = () => {
  const { loading, error, execute } = useApi({
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error.message)
  });

  const handleSubmit = async () => {
    try {
      await execute('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Error is automatically handled by the hook
    }
  };
};
```

### Manual Error Handling
```typescript
import { handleApiError, getErrorMessage } from '../utils/errorHandler';

const handleApiCall = async () => {
  try {
    const response = await fetch('/api/endpoint');
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
  } catch (error) {
    const apiError = handleApiError(error);
    const message = getErrorMessage(apiError);
    // Display message to user
  }
};
```

## Server Status Monitoring

The application automatically monitors server status:
- **Check Interval**: Every 30 seconds
- **Timeout**: 5 seconds per check
- **Endpoint**: `/api/matches` (lightweight endpoint)
- **Visual Indicator**: Green pulse when online, red when offline

## Error Notification Display

Error notifications appear in the top-right corner:
- **Auto-dismiss**: 8 seconds
- **Manual dismiss**: Click the × button
- **Animation**: Slide in from right
- **Types**: Error (red), Warning (yellow), Info (blue)

## Best Practices

1. **Always handle errors**: Use try-catch blocks or the useApi hook
2. **Provide user feedback**: Show meaningful error messages
3. **Log errors**: Use the logError utility for debugging
4. **Graceful degradation**: Handle offline scenarios gracefully
5. **Clear error states**: Reset errors when appropriate

## Troubleshooting

### Server Offline
1. Check if backend server is running on port 3000
2. Verify server console for error messages
3. Check network connectivity
4. Restart the backend server

### API Errors
1. Check browser console for detailed error logs
2. Verify API endpoint URLs
3. Check request/response format
4. Review server logs for backend errors

### Network Issues
1. Check internet connectivity
2. Verify CORS configuration
3. Check firewall settings
4. Try refreshing the page

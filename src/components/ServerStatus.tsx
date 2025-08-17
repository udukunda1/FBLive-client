'use client';

import { useState, useEffect } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

interface ServerStatusProps {
  onStatusChange: (isOnline: boolean) => void;
}

export default function ServerStatus({ onStatusChange }: ServerStatusProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(buildApiUrl('/api/matches'), {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsOnline(true);
        onStatusChange(true);
      } else {
        setIsOnline(false);
        onStatusChange(false);
      }
    } catch (error) {
      setIsOnline(false);
      onStatusChange(false);
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Initial check
    checkServerStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isOnline === null) return 'bg-gray-400';
    return isOnline ? 'bg-green-400' : 'bg-red-400';
  };

  const getStatusText = () => {
    if (isOnline === null) return 'Checking...';
    return isOnline ? 'Online' : 'Offline';
  };

  const getStatusDescription = () => {
    if (isOnline === null) return 'Checking server status...';
    if (isOnline) return 'Server is responding normally';
    return 'Server is not responding. Check if the backend is running.';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">Server Status</h3>
        <button
          onClick={checkServerStatus}
          disabled={isChecking}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
        >
          {isChecking ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isOnline ? 'animate-pulse' : ''}`}></div>
        <span className={`font-medium ${isOnline ? 'text-green-200' : isOnline === false ? 'text-red-200' : 'text-gray-200'}`}>
          {getStatusText()}
        </span>
      </div>
      
      <p className="text-sm text-blue-200 mb-2">
        {getStatusDescription()}
      </p>
      
      {lastChecked && (
        <p className="text-xs text-gray-300">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
      
      {!isOnline && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-200">
          <p className="font-medium mb-1">Troubleshooting:</p>
          <ul className="space-y-1">
            <li>• Make sure the backend server is running on port 3000</li>
            <li>• Check if there are any error messages in the server console</li>
            <li>• Verify the server URL is correct</li>
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

interface LiveTrackingProps {
  isTracking: boolean;
  onStartTracking: () => void;
}

export default function LiveTracking({ isTracking, onStartTracking }: LiveTrackingProps) {
  const [serverMessage, setServerMessage] = useState('');

  const handleStartTracking = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/match/start'), {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        setServerMessage(data.message || 'Live tracking started successfully!');
        // Only start tracking if the message indicates actual tracking started
        if (data.message && !data.message.includes('No live matches')) {
          onStartTracking();
        }
      } else {
        setServerMessage(data.error || 'Failed to start tracking');
      }
    } catch (error) {
      setServerMessage('Error connecting to server');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">Live Tracking</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-blue-200">
            {isTracking ? 'Live tracking is active' : 'Live tracking is inactive'}
          </span>
        </div>
        
        <p className="text-sm text-blue-200">
          {isTracking 
            ? 'Monitoring matches with watch=true and status=pending. Check the console for live updates.'
            : 'Click the button below to start live tracking of watched matches.'
          }
        </p>
        
        <button
          onClick={handleStartTracking}
          disabled={isTracking}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {isTracking ? 'Tracking Active' : 'Start Live Tracking'}
        </button>
        
        {serverMessage && (
          <div className={`mt-4 p-3 rounded-md ${
            serverMessage.includes('successfully') || serverMessage.includes('started')
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : 'bg-red-500/20 text-red-200 border border-red-500/30'
          }`}>
            {serverMessage}
          </div>
        )}
        
        {isTracking && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md">
            <p className="text-green-200 text-sm">
              💡 Tip: Open your server console to see live match updates including:
            </p>
            <ul className="text-green-200 text-sm mt-2 space-y-1">
              <li>• Kickoff notifications</li>
              <li>• Goal updates</li>
              <li>• Half-time announcements</li>
              <li>• Full-time results</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 
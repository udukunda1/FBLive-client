'use client';

import { useState, useEffect } from 'react';

export interface ErrorNotificationProps {
  error: string | null;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorNotification({ error, onClose, type = 'error' }: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      default:
        return 'bg-red-500/20 text-red-200 border-red-500/30';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`max-w-md p-4 rounded-lg border backdrop-blur-sm shadow-lg ${getStyles()}`}>
        <div className="flex items-start space-x-3">
          <span className="text-xl flex-shrink-0">{getIcon()}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">
              {type === 'error' ? 'Server Error' : type === 'warning' ? 'Warning' : 'Information'}
            </h3>
            <p className="text-sm leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

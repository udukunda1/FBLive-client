'use client';

import { useState } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

interface TeamNameEditorProps {
  match: {
    _id: string;
    homeTeam: string;
    awayTeam: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function TeamNameEditor({ match, isOpen, onClose, onSave }: TeamNameEditorProps) {
  const [homeTeam, setHomeTeam] = useState(match.homeTeam);
  const [awayTeam, setAwayTeam] = useState(match.awayTeam);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!homeTeam.trim() || !awayTeam.trim()) {
      setError('Both team names are required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl(`/api/match/${match._id}/teams`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
        }),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update team names');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setHomeTeam(match.homeTeam);
    setAwayTeam(match.awayTeam);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Edit Team Names</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="homeTeam" className="block text-sm font-medium text-blue-200 mb-1">
              Home Team
            </label>
            <input
              type="text"
              id="homeTeam"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter home team name"
            />
          </div>
          
          <div>
            <label htmlFor="awayTeam" className="block text-sm font-medium text-blue-200 mb-1">
              Away Team
            </label>
            <input
              type="text"
              id="awayTeam"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter away team name"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

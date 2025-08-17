'use client';

import { useState } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

interface MatchSearchProps {
  onMatchAdded: () => void;
}

export default function MatchSearch({ onMatchAdded }: MatchSearchProps) {
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(buildApiUrl('/api/match/search'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Match found and saved successfully!');
        setFormData({ homeTeam: '', awayTeam: '', date: '' });
        onMatchAdded();
      } else {
        setMessage(data.error || 'Error searching for match');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">Search Match</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="homeTeam" className="block text-sm font-medium text-blue-200 mb-1">
            Home Team
          </label>
          <input
            type="text"
            id="homeTeam"
            value={formData.homeTeam}
            onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Rangers"
            required
          />
        </div>

        <div>
          <label htmlFor="awayTeam" className="block text-sm font-medium text-blue-200 mb-1">
            Away Team
          </label>
          <input
            type="text"
            id="awayTeam"
            value={formData.awayTeam}
            onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Viktoria Plzeň"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-blue-200 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {isLoading ? 'Searching...' : 'Search Match'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
            : 'bg-red-500/20 text-red-200 border border-red-500/30'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
} 
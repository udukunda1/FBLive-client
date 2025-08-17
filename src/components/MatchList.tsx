'use client';

import { useState } from 'react';
import { buildApiUrl } from '../utils/apiConfig';
import TeamNameEditor from './TeamNameEditor';

interface Match {
  _id: string;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  status: string;
  watch: boolean;
}

interface MatchListProps {
  matches: Match[];
  onMatchUpdated: () => void;
}

export default function MatchList({ matches, onMatchUpdated }: MatchListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const handleToggleWatch = async (matchId: string) => {
    setTogglingId(matchId);
    try {
      const response = await fetch(buildApiUrl(`/api/match/${matchId}/toggle-watch`), {
        method: 'PATCH',
      });
      if (response.ok) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error('Error toggling watch:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    
    setDeletingId(matchId);
    try {
      const response = await fetch(buildApiUrl(`/api/match/${matchId}`), {
        method: 'DELETE',
      });
      if (response.ok) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error('Error deleting match:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
  };

  const handleEditClose = () => {
    setEditingMatch(null);
  };

  const handleEditSave = () => {
    onMatchUpdated();
    setEditingMatch(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'ended':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Sort matches by date and time (newest first)
  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">Matches ({matches.length})</h2>
      
      {sortedMatches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-blue-200">No matches found. Search for a match to get started!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedMatches.map((match) => (
            <div
              key={match._id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="text-sm text-blue-200">
                    {new Date(match.date).toLocaleDateString()} at {match.time}
                  </p>
                  <p className={`text-sm font-medium ${getStatusColor(match.status)}`}>
                    Status: {match.status}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(match)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleToggleWatch(match._id)}
                    disabled={togglingId === match._id}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      match.watch
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {togglingId === match._id ? '...' : match.watch ? 'Watching' : 'Watch'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(match._id)}
                    disabled={deletingId === match._id}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    {deletingId === match._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-300">
                Event ID: {match.eventId}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {editingMatch && (
        <TeamNameEditor
          match={editingMatch}
          isOpen={true}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
} 
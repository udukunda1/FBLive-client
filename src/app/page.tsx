'use client';

import { useState, useEffect } from 'react';
import { buildApiUrl } from '../utils/apiConfig';
import MatchSearch from '../components/MatchSearch';
import MatchList from '../components/MatchList';
import LiveTracking from '../components/LiveTracking';

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

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const fetchMatches = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/matches'));
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleMatchAdded = () => {
    fetchMatches();
  };

  const handleMatchUpdated = () => {
    fetchMatches();
  };

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            FBLive
          </h1>
          <p className="text-xl text-blue-200">
            Live Football Match Tracking
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <MatchSearch onMatchAdded={handleMatchAdded} />
            <LiveTracking 
              isTracking={isTracking}
              onStartTracking={handleStartTracking}
            />
          </div>

          {/* Right Column */}
          <div>
            <MatchList 
              matches={matches}
              onMatchUpdated={handleMatchUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

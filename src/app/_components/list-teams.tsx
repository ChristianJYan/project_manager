"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { fetchUserTeams } from '~/app/actions/auth.actions';

interface Team {
  id: string;
  name: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const result = await fetchUserTeams();
        if ('error' in result) {
          setError(result.error);
        } else {
          setTeams(result);
        }
      } catch (error) {
        setError("An error occurred while fetching teams.");
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTeams();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-purple-900 rounded-lg p-4 max-w-sm">
      <h3 className="text-white text-lg font-semibold mb-3">Your Teams</h3>
      <div className="max-h-60 overflow-y-auto">
        {teams.length === 0 ? (
          <p className="text-white">You are not a member of any teams.</p>
        ) : (
          teams.map((team) => (
            <Link 
              key={team.id}
              href={`/team/${encodeURIComponent(team.name)}`}
              className="block bg-purple-800 text-white p-3 mb-2 rounded hover:bg-purple-700 transition-colors"
            >
              {team.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamList;
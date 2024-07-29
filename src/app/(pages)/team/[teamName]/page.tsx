'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTeamDetails, checkTeamAccess } from '../../../actions/auth.actions';
interface TeamDetails {
    name: string;
    description: string | null;
    members: (string | null)[];
    // Add other team properties as needed
  }

console.log("Team page component is being rendered");

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const getTeamDetails = async () => {
    setIsLoading(true);
    try {
      const teamName = params.teamName as string;
      if (!teamName) {
        throw new Error('Team name is undefined');
      }

      const hasAccess = await checkTeamAccess(teamName);
      if (!hasAccess) {
        throw new Error('User does not have access to this team');
      }

      const details = await fetchTeamDetails(decodeURIComponent(teamName));
      setTeam(details);
    } catch (err) {
      console.error("Error in getTeamDetails:", err);
      router.push('/');
      setError("Couldn't find user in this team.");
    } finally {
      setIsLoading(false);
    }
  };

  void getTeamDetails();
}, [params.teamName, router]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!team) return <div className="text-white">Team not found</div>;

  return (
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white p-6">
      <div className="text-center mb-6">
        <h1 className="text-white text-4xl mb-2">{team.name}</h1>
        <p className="text-purple-200 text-lg">{team.description}</p>
      </div>
      <div className="flex w-full max-w-1xl">
        <div className="flex w-full">
          <div className="w-1/3">
            <h2 className="text-white text-xl mb-2">Team Members:</h2>
            <ul className="list-disc list-inside text-purple-200">
              {team.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};
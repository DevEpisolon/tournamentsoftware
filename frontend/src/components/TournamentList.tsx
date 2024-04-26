import React, { useState, useEffect } from 'react';

interface Tournament {
  _id: string;
  tournamentName: string;
  maxSlots: number;
  // Add more properties as needed
}

const TournamentsList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tournaments</h2>
      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
            <p>Max Slots: {tournament.maxSlots}</p>
            {/* Add more tournament details here as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Player {
  uniqueid: string;
  displayname: string;
  email: string;
}

const PlayersList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Players List</h2>
      <ul>
        {players.map((player) => (
          <li key={player.uniqueid} className="mb-2">
            <span className="font-semibold">{player.displayname}</span> - {player.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;


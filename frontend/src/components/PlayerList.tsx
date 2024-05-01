import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface Player {
  id: string; //Unique identifier for the player
  name: string; //Name of the player
  email: string; //Email of the player
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
          <li key={player.id} className="mb-2">
            <span className="font-semibold">{player.name}</span> - {player.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;



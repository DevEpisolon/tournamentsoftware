import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayersList: React.FC = () => {
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/players/all');
        const playerData = response.data as any[]; // Assuming the response data is an array of player objects
        const playerNames = playerData.map((player: any) => player.displayname); // Extract display names
        setPlayers(playerNames);
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
        {players.map((displayName, index) => (
          <li key={index} className="mb-2">
            <span className="font-semibold">{displayName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;


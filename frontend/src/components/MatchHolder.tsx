import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Player {
  displayname: string;
  score: number;
}

const MatchHolder: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/players/all');
        const playerData = response.data as Player[];
        setPlayers(playerData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Players and Scores</h2>
      <ul className="space-y-4">
        {players.map((player, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <span className="text-lg font-medium text-gray-800">{player.displayname}</span>
            <span className="text-lg font-semibold text-green-500">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHolder;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlayerProfilePage: React.FC = () => {
  const { playername } = useParams<{ playername: string }>();
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/players/${playername}`);
        setPlayerData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playername]);

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (!playerData) {
    return <div className="container mx-auto mt-8 text-center">Player not found</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">{playerData.displayName}</h1>
        {playerData.image && <img src={playerData.image} alt="Player Avatar" className="mx-auto mt-4 rounded-full w-32 h-32" />}
      </header>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Player Stats</h2>
            <p>Wins: {playerData.wins}</p>
            <p>Losses: {playerData.losses}</p>
            <p>Ties: {playerData.ties}</p>
            <p>Win Streak: {playerData.winStreak}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Player Details</h2>
            <p>Email: {playerData.email}</p>
            <p>Country: {playerData.country}</p>
            {/* Add more player details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;


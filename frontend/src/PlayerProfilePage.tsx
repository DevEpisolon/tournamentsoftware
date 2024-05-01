import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlayerProfilePage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get(`/api/players/${playerId}`);
        setPlayerData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playerData) {
    return <div>Player not found</div>;
  }

  return (
    <div className="player-profile">
      <header className="header relative flex justify-between items-center">
        <div className="flex items-center">
          <h1>{playerData.displayName}</h1>
          {playerData.image && <img src={playerData.image} alt="Player Avatar" />}
        </div>
        <div className="player-stats">
          <p>Wins: {playerData.wins}</p>
          <p>Losses: {playerData.losses}</p>
          <p>Ties: {playerData.ties}</p>
          <p>Win Streak: {playerData.winStreak}</p>
        </div>
      </header>
    </div>
  );
};

export default PlayerProfilePage;


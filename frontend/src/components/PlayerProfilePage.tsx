import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Default blank image URL
const DEFAULT_IMAGE_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const PlayerProfilePage: React.FC = () => {
  const { playername } = useParams<{ playername: string }>();
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/players/get_player/${playername}`
        );
        setPlayerData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player data:", error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playername]);

  const handleGoBack = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (!playerData) {
    return (
      <div className="container mx-auto mt-8 text-center">Player not found</div>
    );
  }

  // Use the player's image if available, otherwise use the default blank image
  const playerImage = playerData.avatar || DEFAULT_IMAGE_URL;

  return (
    <div className="container mx-auto mt-8 relative">
      <button
        className="absolute top-3 left-4 bg-pink-700 font-bold text-white px-3 py-2 rounded"
        onClick={handleGoBack}
      >
        Back
      </button>
      <header className="text-center mb-8">
        <img
          src={playerImage}
          alt="Player Avatar"
          className="rounded-full w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold">{playerData.displayname}</h1>
        <p className="text-sm italic">Joined: {playerData.join_date}</p>
      </header>
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">About Me</h2>
        {/* Add more player details as needed */}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-blue-100 p-2 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Wins</h2>
          <p className="text-xl">{playerData.wins}</p>
        </div>
        <div className="bg-green-100 p-2 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Losses</h2>
          <p className="text-xl">{playerData.losses}</p>
        </div>
        <div className="bg-yellow-100 p-2 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Ties</h2>
          <p className="text-xl">{playerData.ties}</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Winstreak</h2>
          <p className="text-xl">{playerData.winstreaks}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;

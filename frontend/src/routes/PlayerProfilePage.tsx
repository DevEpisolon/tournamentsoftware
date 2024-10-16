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
    <div className="bg-[#2D3250] min-h-screen text-white">
      <div className="container mx-auto pt-8 relative">
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
            className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white transition-transform duration-300 hover:scale-105 hover:filter hover:grayscale"
          />
          <h1 className="text-4xl font-bold">{playerData.displayname}</h1>
          <p className="text-sm italic">Joined: {playerData.join_date}</p>
        </header>

        <div className="border-4 border-white bg-gray-100 text-black p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">About Me</h2>
          {/* Add more player details as needed */}
        </div>

        <div className="grid grid-cols-2 gap-32 mt-12">
          {/* Diamond shape for Wins (Red) */}
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-red-500 shadow-md transition-transform duration-300 hover:scale-110">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Wins</h2>
              <p className="text-xl">{playerData.wins}</p>
            </div>
          </div>

          {/* Diamond shape for Losses (Blue) */}
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-blue-500 shadow-md transition-transform duration-300 hover:scale-110">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Losses</h2>
              <p className="text-xl">{playerData.losses}</p>
            </div>
          </div>

          {/* Diamond shape for Ties (#F6B17A) */}
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-[#F6B17A] shadow-md transition-transform duration-300 hover:scale-110">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Ties</h2>
              <p className="text-xl">{playerData.ties}</p>
            </div>
          </div>

          {/* Diamond shape for Winstreak (Green) */}
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-green-500 shadow-md transition-transform duration-300 hover:scale-110">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Winstreak</h2>
              <p className="text-xl">{playerData.winstreaks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;


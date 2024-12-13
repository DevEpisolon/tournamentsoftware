import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UpdateAvatar from "../components/UpdateAvatar";
import MatchHistory from "../components/MatchHistory";

const DEFAULT_IMAGE_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const PlayerProfilePage: React.FC = () => {
  const { playername } = useParams<{ playername: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { currentUser } = useAuth();

  const [playerData, setPlayerData] = useState<any>(state?.playerData || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [aboutMe, setAboutMe] = useState<string>("");
  const [showUpdateAvatar, setShowUpdateAvatar] = useState<boolean>(false);

  useEffect(() => {
    if (!playerData) {
      const fetchPlayerData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/players/get_player/${playername}`
          );
          const data = await response.json();
          setPlayerData(data);
          setAboutMe(data.aboutMe || "");
          setLoading(false);
        } catch (error) {
          console.error("Error fetching player data:", error);
          setLoading(false);
        }
      };
      fetchPlayerData();
    } else {
      setLoading(false);
    }
  }, [playername, playerData]);

  const handleGoBack = () => {
    navigate("/");
  };

  const addFriend = async () => {
    try {
      console.log(currentUser);
      const r = await fetch(`http://localhost:8000/api/players/add_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this header
        },
        body: JSON.stringify({
          sender: currentUser.displayName,
          receiver: playerData.playername,
        }),
      });
      window.location.reload();
    } catch (e) {
      alert("This is my error");
    }
  };

  const removeFriend = async () => {
    try {
      console.log(currentUser);
      const r = await fetch(`http://localhost:8000/api/players/remove_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this header
        },
        body: JSON.stringify({
          sender: currentUser.displayName,
          receiver: playerData.playername,
        }),
      });
      window.location.reload();
    } catch (e) {
      alert("This is my error");
    }
  };

  if (loading) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (!playerData || !currentUser) {
    return (
      <div className="container mx-auto mt-8 text-center">Player not found</div>
    );
  }

  const playerImage = playerData.avatar || DEFAULT_IMAGE_URL;

  return (
    <div className="bg-[#2D3250] min-h-screen text-white">
      <div className="p-5">
        <div className={"flex flex-row justify-between p-5"}>
          <button
            className="bg-pink-700 h-[60px] w-[100px] font-bold text-white px-3 py-2 rounded"
            onClick={handleGoBack}
          >
            Back
          </button>
          <header className="text-center mb-8">
            <img
              src={playerImage}
              alt="Player Avatar"
              className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white cursor-pointer"
            />
            <h1 className="text-4xl font-bold">{playerData.displayname}</h1>
            <p className="text-sm italic">Joined: {playerData.join_date}</p>
          </header>

          {playerData.playername != currentUser?.displayName ? (
            playerData.friends.some(
              (f) => f.playername == currentUser.displayName
            ) ? (
              <button
                className="bg-red-700 h-[60px] w-[150px] font-bold text-white px-3 py-2 rounded"
                onClick={removeFriend}
              >
                Remove Friend
              </button>
            ) : (
              <button
                className="bg-green-700 h-[60px] w-[150px] font-bold text-white px-3 py-2 rounded"
                onClick={addFriend}
              >
                Add Friend
              </button>
            )
          ) : (
            <div></div>
          )}
        </div>

        <div className="border-4 border-white p-4 rounded-md shadow-md mb-8 bg-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-black">About Me</h2>
          <div className="p-2 text-gray-800 bg-gray-200 cursor-text outline-none min-h-[50px]">
            {aboutMe}
          </div>
          <p className="text-sm italic text-gray-600"></p>
        </div>

        <div className="grid grid-cols-2 gap-32 mt-12">
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-red-500 shadow-md">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Wins</h2>
              <p className="text-xl">{playerData.wins}</p>
            </div>
          </div>
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-blue-500 shadow-md">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Losses</h2>
              <p className="text-xl">{playerData.losses}</p>
            </div>
          </div>
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-[#F6B17A] shadow-md">
            <div className="transform -rotate-45 text-center">
              <h2 className="text-lg font-semibold">Ties</h2>
              <p className="text-xl">{playerData.ties}</p>
            </div>
          </div>
          <div className="transform rotate-45 border-4 border-white w-36 h-36 mx-auto flex items-center justify-center bg-green-500 shadow-md">
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

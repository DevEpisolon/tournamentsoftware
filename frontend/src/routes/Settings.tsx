import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { GiCharacter } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { getAuth, signOut } from "firebase/auth";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("playerInfo");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current user from Firebase Auth
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Current user found:", user);
      setCurrentUser(user);
    } else {
      console.error("No user is signed in. Redirecting to sign-in.");
      navigate("/routes/sign-in");
    }
  }, [auth, navigate]);

  // Fetch player data from the backend
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!currentUser || !currentUser.uid) {
        console.error("No valid current user found.");
        return;
      }

      const url = `http://localhost:8000/api/players/settings/${currentUser.displayName}`;
      console.log("Fetching player data from:", url);

      try {
        const response = await axios.get(url);
        console.log("Player data response:", response.data);
        setPlayerData(response.data);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError("Failed to load player data.");

        if (err.response) {
          console.error("Error response from server:", err.response.data);
        } else {
          console.error("Network or other error:", err.message);
        }
      }
    };

    fetchPlayerData();
  }, [currentUser]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      navigate("/routes/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePlayerInfo = () => {
    setSelectedView("playerInfo");
  };

  const handlePlayerStats = () => {
    setSelectedView("playerStats");
  };

  const renderPlayerInfo = () => {
    if (loading) return <p>Loading player information...</p>;
    if (error) return <p>{error}</p>;
    if (!playerData) return <p>No player data available.</p>;

    // Format join date
    const joinDate = playerData.join_date 
      ? new Date(playerData.join_date).toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }) 
      : "Not available";

    return (
      <div className="account-info space-y-6">
        <div className="flex items-center space-x-4">
          <img
            src={playerData.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-xl font-semibold">{playerData.displayname || "Display Name"}</p>
            <p className="text-gray-400">{playerData.playername || "Player Name"}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p><strong>Display Name:</strong> {playerData.displayname || "Not set"}</p>
          <p><strong>Player Name:</strong> {playerData.playername || "Not set"}</p>
          <p><strong>Join Date:</strong> {joinDate}</p>
          <p><strong>About Me:</strong> {playerData.about_me || "No description provided"}</p>
        </div>
      </div>
    );
  };

  const renderPlayerStats = () => {
    if (!playerData) return <p>No stats data available.</p>;

    const winLossRatio = playerData.losses > 0 ? (playerData.wins / playerData.losses).toFixed(2) : "N/A";

    return (
      <div className="player-stats space-y-6">
        <h2 className="text-xl font-bold mb-4">Player Stats</h2>
        <div className="space-y-2">
          <p><strong>Wins:</strong> {playerData.wins}</p>
          <p><strong>Losses:</strong> {playerData.losses}</p>
          <p><strong>Ties:</strong> {playerData.ties}</p>
          <p><strong>Tournament Wins:</strong> {playerData.tournamentWins}</p>
          <p><strong>Tournament Losses:</strong> {playerData.tournamentLosses}</p>
          <p><strong>Win-Loss Ratio:</strong> {winLossRatio}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="settings-page h-screen flex">
      <div className="taskbar text-white w-24 p-6 flex flex-col items-center" style={{ minWidth: "90px", backgroundColor: "#424769" }}>
        <button className="mb-6 p-4" onClick={handleBackToHome} style={{ backgroundColor: "#F6B17A", color: "white" }}>
          <IoArrowBack size={20} />
        </button>
        <button className="mb-6 p-4" onClick={handlePlayerInfo} style={{ backgroundColor: "#4F81FF", color: "white" }}>
          <GiCharacter />
        </button>
        <button className="mb-6 p-4" onClick={handlePlayerStats} style={{ backgroundColor: "#76B041", color: "white" }}>
          <ImStatsDots />
        </button>
        <button className="mt-auto p-4" onClick={handleSignOut} style={{ backgroundColor: "#FF4F4F", color: "white" }}>
          <FaSignOutAlt />
        </button>
      </div>
      <div className="content flex-1 p-6" style={{ backgroundColor: "#2D3250", color: "white" }}>
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        {selectedView === "playerInfo" && renderPlayerInfo()}
        {selectedView === "playerStats" && renderPlayerStats()}
      </div>
    </div>
  );
};

export default Settings;
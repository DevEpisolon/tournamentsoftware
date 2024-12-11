import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { GiCharacter } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { getAuth, signOut } from 'firebase/auth';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null); // State to store player stats
  const [selectedView, setSelectedView] = useState<string>("playerInfo"); // Default view is "playerInfo"

  // Fetch account info on component mount
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/players/get_player/Kayz}");
        console.log("Account info response:", response.data); // Log the response data to the console
        setAccountInfo(response.data);
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

    fetchAccountInfo();
  }, []);

  // Fetch player stats from the backend
  const fetchPlayerStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/player-stats"); // Replace with your API endpoint for stats
      setPlayerStats(response.data); // Set player stats in the state
    } catch (error) {
      console.error("Error fetching player stats:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/routes/sign-in");
  };

  const handlePlayerInfo = () => {
    setSelectedView("playerInfo"); // Switch to Player Info view
  };

  const handlePlayerStats = () => {
    setSelectedView("playerStats"); // Switch to Player Stats view
    fetchPlayerStats(); // Fetch player stats when the button is clicked
  };

  // Render Player Info content
  const renderPlayerInfo = () => {
    if (!accountInfo) return <p>Loading account information...</p>;

    return (
      <div className="account-info space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img
            src={accountInfo.profilePicture || "/default-avatar.png"} // Fallback to a default image
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-xl font-semibold">{accountInfo.displayname || "Display Name"}</p>
            <p className="text-gray-400">{accountInfo.playername || "Player Name"}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-2">
          <p><strong>Email:</strong> {accountInfo.email || "Email not provided"}</p>
        </div>
      </div>
    );
  };

  // Render Player Stats content
  const renderPlayerStats = () => {
    if (!playerStats) return <p>Loading player stats...</p>;

    // Calculate Win-Loss ratio
    const winLossRatio = playerStats.losses > 0 ? (playerStats.wins / playerStats.losses).toFixed(2) : "N/A";

    return (
      <div className="player-stats space-y-6">
        <h2 className="text-xl font-bold mb-4">Player Stats</h2>

        {/* Displaying Player Stats */}
        <div className="space-y-2">
          <p><strong>Wins:</strong> {playerStats.wins}</p>
          <p><strong>Losses:</strong> {playerStats.losses}</p>
          <p><strong>Ties:</strong> {playerStats.ties}</p>
          <p><strong>Tournament Wins:</strong> {playerStats.tournamentWins}</p>
          <p><strong>Tournament Losses:</strong> {playerStats.tournamentLosses}</p>
          <p><strong>Win-Loss Ratio:</strong> {winLossRatio}</p>
        </div>

        {/* Match History */}
        <div className="match-history space-y-2">
          <h3 className="font-semibold">Match History</h3>
          {playerStats.matchHistory && playerStats.matchHistory.length > 0 ? (
            <ul>
              {playerStats.matchHistory.map((match: any, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{match.date}</span>
                  <span>{match.opponent} - {match.result}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No match history available.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="settings-page h-screen flex">
      {/* Sidebar / Taskbar */}
      <div
        className="taskbar text-white w-24 p-6 flex flex-col items-center"
        style={{ minWidth: "90px", backgroundColor: "#424769" }} // Taskbar background changed
      >
        {/* Back Button */}
        <button
          className="mb-6 p-4 flex items-center justify-center"
          onClick={handleBackToHome}
          style={{
            backgroundColor: "#F6B17A", // Yellow background
            color: "white",
            border: "2px solid #F6B17A",
            borderRadius: "8px",
            width: "70px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
            padding: "0",
          }}
        >
          <IoArrowBack size={20} />
        </button>

        {/* Player Information Button */}
        <button
          className="mb-6 p-4 flex items-center justify-center"
          onClick={handlePlayerInfo}
          style={{
            backgroundColor: "#4F81FF", // Blue background for player info
            color: "white",
            border: "2px solid #4F81FF",
            borderRadius: "8px",
            width: "70px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
            padding: "0",
          }}
        >
          <GiCharacter />
        </button>

        {/* Player Stats Button */}
        <button
          className="mb-6 p-4 flex items-center justify-center"
          onClick={handlePlayerStats}
          style={{
            backgroundColor: "#76B041", // Green background for stats
            color: "white",
            border: "2px solid #76B041",
            borderRadius: "8px",
            width: "70px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
            padding: "0",
          }}
        >
          <ImStatsDots />
        </button>

        {/* Sign Out Button */}
        <button
          className="mt-auto p-4 flex items-center justify-center"
          onClick={handleSignOut}
          style={{
            backgroundColor: "#FF4F4F", // Red background for sign-out
            color: "white",
            border: "2px solid #FF4F4F",
            borderRadius: "8px",
            width: "70px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
            padding: "0",
          }}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className="content flex-1 p-6"
        style={{ backgroundColor: "#2D3250", color: "white" }}
      >
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

        {/* Render the selected view */}
        {selectedView === "playerInfo" && renderPlayerInfo()}
        {selectedView === "playerStats" && renderPlayerStats()}
      </div>
    </div>
  );
};

export default Settings;

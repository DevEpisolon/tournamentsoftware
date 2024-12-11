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
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("playerInfo");

  // Fetch the current user from Firebase Auth
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    } else {
      console.error("No user is signed in.");
      navigate("/routes/sign-in"); // Redirect to sign-in if no user is logged in
    }
  }, [auth, navigate]);

  // Fetch account info dynamically based on the current user
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.get(`http://localhost:8000/api/players/get_player/${currentUser.uid}`);
        console.log("Account info response:", response.data);
        setAccountInfo(response.data);
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

    fetchAccountInfo();
  }, [currentUser]);

  // Fetch player stats
  const fetchPlayerStats = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/player-stats/${currentUser.uid}`);
      setPlayerStats(response.data);
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
    setSelectedView("playerInfo");
  };

  const handlePlayerStats = () => {
    setSelectedView("playerStats");
    fetchPlayerStats();
  };

  const renderPlayerInfo = () => {
    if (!accountInfo) return <p>Loading account information...</p>;

    return (
      <div className="account-info space-y-6">
        <div className="flex items-center space-x-4">
          <img
            src={accountInfo.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-xl font-semibold">{accountInfo.displayname || "Display Name"}</p>
            <p className="text-gray-400">{accountInfo.playername || "Player Name"}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p><strong>Email:</strong> {accountInfo.email || "Email not provided"}</p>
          <p><strong>Rank:</strong> {accountInfo.rank || "Unranked"}</p>
        </div>
      </div>
    );
  };

  const renderPlayerStats = () => {
    if (!playerStats) return <p>Loading player stats...</p>;

    const winLossRatio = playerStats.losses > 0 ? (playerStats.wins / playerStats.losses).toFixed(2) : "N/A";

    return (
      <div className="player-stats space-y-6">
        <h2 className="text-xl font-bold mb-4">Player Stats</h2>
        <div className="space-y-2">
          <p><strong>Wins:</strong> {playerStats.wins}</p>
          <p><strong>Losses:</strong> {playerStats.losses}</p>
          <p><strong>Ties:</strong> {playerStats.ties}</p>
          <p><strong>Tournament Wins:</strong> {playerStats.tournamentWins}</p>
          <p><strong>Tournament Losses:</strong> {playerStats.tournamentLosses}</p>
          <p><strong>Win-Loss Ratio:</strong> {winLossRatio}</p>
        </div>
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { GiCharacter } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { IoMdHome } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // Added icons for expanding/collapsing
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { useAuth } from "../utils/AuthContext";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State management
  const [playerData, setPlayerData] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("playerInfo");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [isTaskbarExpanded, setIsTaskbarExpanded] = useState<boolean>(false);

  // Fetch player data
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

  // Handlers
  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      console.log("User signed out successfully.");
      navigate("/routes/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      alert("Confirmation does not match. Account not deleted.");
      return;
    }

    try {
      const deleteUrl = `http://localhost:8000/api/players/delete_player/${currentUser.displayName}`;
      await axios.delete(deleteUrl);

      if (currentUser) {
        await deleteUser(currentUser);
      }

      navigate("/routes/sign-in");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const toggleTaskbar = () => {
    setIsTaskbarExpanded(!isTaskbarExpanded);
  };

  // Render sections
  const renderDeleteAccountModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 text-black">
          <h2 className="text-xl font-bold mb-4 text-red-600">Delete Account</h2>
          <p className="mb-4">
            This will permanently delete your account. This action cannot be undone.
          </p>
          <p className="mb-4">
            To confirm, type <strong>DELETE</strong> in the box below:
          </p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Type DELETE to confirm"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlayerInfo = () => {
    if (loading) return <p>Loading player information...</p>;
    if (error) return <p>{error}</p>;
    if (!playerData) return <p>No player data available.</p>;

    const joinDate = playerData["join date"]
      ? new Date(playerData["join date"]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
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
        <div className="pt-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <FaTrash /> <span>Delete Account</span>
          </button>
        </div>
      </div>
    );
  };

  const renderPlayerStats = () => {
    if (loading) return <p>Loading player stats...</p>;
    if (error) return <p>{error}</p>;
    if (!playerData) return <p>No player data available.</p>;


    return (
      <div className="player-stats space-y-6">
        <div className="space-y-2">
          <p><strong>Wins:</strong> {playerData.wins || "Not available"}</p>
          <p><strong>Losses:</strong> {playerData.losses || "Not available"}</p>
          <p><strong>Ties:</strong> {playerData.ties || "Not available"}</p>
          <p><strong>Win/Loss Ratio:</strong> {playerData.wlratio || "Not available"}</p>
          <p><strong>Tournament Wins:</strong> {playerData.current_tournament_wins || "Not available"}</p>
          <p><strong>Tournament Losses:</strong> {playerData.current_tournament_losses || "Not available"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Match History</h3>
          <ul>
            {playerData.match_history && playerData.match_history.length > 0 ? (
              playerData.match_history.map((match: any, index: number) => (
                <li key={index}>
                  {match.date}: {match.result}
                </li>
              ))
            ) : (
              <p>No match history available</p>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="settings-page h-screen flex">
      <div
        className={`taskbar text-white p-6 flex flex-col items-center transition-all duration-300 ${isTaskbarExpanded ? "w-64" : "w-16"}`}
        style={{ backgroundColor: "#424769" }}
      >
        <button
          className="mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 w-12 h-12 flex items-center justify-center"
          onClick={toggleTaskbar}
        >
          {isTaskbarExpanded ? <IoChevronBack size={32} /> : <IoChevronForward size={32} />}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={handleBackToHome}
        >
          <IoMdHome size={32} />
          {isTaskbarExpanded && <span className="ml-2">Home</span>}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={() => setSelectedView("playerInfo")}
        >
          <GiCharacter size={32} />
          {isTaskbarExpanded && <span className="ml-2">Player Info</span>}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={() => setSelectedView("playerStats")}
        >
          <ImStatsDots size={32} />
          {isTaskbarExpanded && <span className="ml-2">Player Stats</span>}
        </button>
        <button
          className={`mt-auto text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={handleSignOut}
        >
          <FaSignOutAlt size={32} />
          {isTaskbarExpanded && <span className="ml-2">Sign Out</span>}
        </button>
      </div>
      <div className="content flex-1 p-6" style={{ backgroundColor: "#2D3250", color: "white" }}>
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        {selectedView === "playerInfo" && renderPlayerInfo()}
        {selectedView === "playerStats" && renderPlayerStats()}
      </div>
      {renderDeleteAccountModal()}
    </div>
  );
};

export default Settings;

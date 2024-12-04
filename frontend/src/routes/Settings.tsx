import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/FirbaseConfig";

const Settings: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpdateDisplayName = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.updateProfile({
          displayName: displayName,
        });
        setMessage("Display name updated successfully!");
        setError(null);
      } catch (err: any) {
        setError("Failed to update display name. Please try again.");
        setMessage(null);
        console.error("Error updating display name:", err);
      }
    } else {
      setError("User not logged in.");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="settings-page p-4">
      {/* Back button */}
      <button
        className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        onClick={handleBackToHome}
      >
        Back to Home
      </button>

      <h1 className="text-2xl font-bold mt-4">Settings</h1>

      <div className="update-display-name mt-6">
        <h2 className="text-xl font-semibold">Change Display Name</h2>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 mt-2 w-full max-w-sm"
          placeholder="Enter new display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
          onClick={handleUpdateDisplayName}
        >
          Update Display Name
        </button>

        {/* Success/Error messages */}
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Settings;

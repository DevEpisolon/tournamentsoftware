import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTournament: React.FC = () => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(8); // Default to 8 players
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#2D3250"); // Default background color
  const [boxColor, setBoxColor] = useState<string>("#424769"); // Default box color
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate input
    if (!tournamentName.trim()) {
      setError("Tournament name is required.");
      return;
    }

    setLoading(true);
    setError(null); // Reset error on retry

    try {
      // Send POST request to create tournament
      const response = await axios.post("http://localhost:8000/api/tournaments", {
        tournamentName,
        maxPlayers,
      });

      // Redirect to tournament list or newly created tournament page
      navigate(`/tournament/${response.data._id}`);
    } catch (err: any) {
      // Extract detailed error message if available
      const errorMessage =
        err.response?.data?.message || "Error creating tournament.";
      setError(errorMessage);
      console.error("Error creating tournament:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-[#F6B17A] text-white px-4 py-2 rounded-md"
      >
        Back
      </button>

      {/* Color Picker */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <div className="flex flex-col items-center">
          <label className="text-white text-sm mb-1">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-8 h-8 border-none rounded-full cursor-pointer"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-white text-sm mb-1">Box</label>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => setBoxColor(e.target.value)}
            className="w-8 h-8 border-none rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Content Box */}
      <div
        className="max-w-lg mx-auto p-8 rounded-lg shadow-md"
        style={{ backgroundColor: boxColor }}
      >
        <header className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-[#F6B17A]">
            Create a New Tournament
          </h1>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tournamentName"
              className="block text-white text-lg mb-2"
            >
              Tournament Name
            </label>
            <input
              type="text"
              id="tournamentName"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter the name of the tournament"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="maxPlayers"
              className="block text-white text-lg mb-2"
            >
              Max Players
            </label>
            <select
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
              <option value={64}>64</option>
              <option value={128}>128</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#F6B17A] text-white font-bold rounded-lg w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tournament"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;

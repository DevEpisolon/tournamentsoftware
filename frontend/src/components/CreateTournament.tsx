import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTournament: React.FC = () => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(8); // Default to 8 players
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
    <div className="container mx-auto p-6">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-semibold text-[#F6B17A]">
          Create a New Tournament
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-md"
      >
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
          <label htmlFor="maxPlayers" className="block text-white text-lg mb-2">
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
  );
};

export default CreateTournament;

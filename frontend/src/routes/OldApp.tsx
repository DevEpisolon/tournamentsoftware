import React, { useState, useEffect } from "react";
import "../App.css";
import TournamentsList from "../components/TournamentsList";
import PlayerProfilePage from "./PlayerProfilePage";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../utils/FirbaseConfig";

function OldApp(): JSX.Element {
  const [tournaments, setTournaments] = useState<any[]>([]); // State to store fetched tournaments
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tournaments data from the FastAPI backend
    axios
      .get("http://localhost:8000/api/tournaments")
      .then((response) => {
        console.log("Tournament Data:", response.data);
        setTournaments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tournaments:", error);
      });
  }, []);

  const handleBackClick = (): void => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="app bg-[#2D3250] text-white min-h-screen flex flex-col">
      {/* Header Section */}
      <header
        className="header flex justify-between items-center w-full px-6 py-4"
        style={{ height: "80px" }}
      >
        <button
          onClick={handleBackClick}
          className="rounded-md bg-[#F6B17A] text-[#2D3250] px-4 py-2 hover:bg-[#E89D63] transition-colors"
        >
          Back
        </button>
        <button
          className="rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Section */}
      <main className="main flex justify-center py-6 flex-grow">
        <div className="content w-4/5 rounded-lg shadow-lg p-6">
          <Routes>
            <Route
              path="/"
              element={<TournamentsList tournaments={tournaments} />}
            />
            <Route
              path="/player/:playername"
              element={<PlayerProfilePage />}
            />
          </Routes>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer text-center bg-[#424769] py-4">
        <p> TAS-32 &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}

export default OldApp;


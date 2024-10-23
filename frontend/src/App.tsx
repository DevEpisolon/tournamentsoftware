import React, { useState, useEffect } from "react";
import "./App.css";
import TournamentForm from "./components/TournamentForm";
import axios from "axios";
import SearchPlayerForm from "./components/searchPlayerForm";
import PlayerProfilePage from "./components/PlayerProfilePage";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter import
import { auth } from "./utils/FirbaseConfig";

function App(): JSX.Element {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Dropdown state for profile
  const [tournamentDropdownOpen, setTournamentDropdownOpen] = useState<boolean>(false); // Dropdown state for tournament
  const [user, setUser] = useState<any>(null); // User state to store the logged-in user's info
  const [featuredTournaments, setFeaturedTournaments] = useState<any[]>([]);
  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [friendsTournaments, setFriendsTournaments] = useState<any[]>([]); // Friends Tournaments
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    // Listen for the current logged-in user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user's details
      } else {
        setUser(null); // If not logged in, reset user state
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    // Fetch featured, recent, upcoming, and friends tournaments data
    axios
      .get("http://localhost:8000/api/tournaments/featured")
      .then((response) => setFeaturedTournaments(response.data))
      .catch((error) => console.error("Error fetching featured tournaments:", error));

    axios
      .get("http://localhost:8000/api/tournaments/recent")
      .then((response) => setRecentTournaments(response.data))
      .catch((error) => console.error("Error fetching recent tournaments:", error));

    axios
      .get("http://localhost:8000/api/tournaments/upcoming")
      .then((response) => setUpcomingTournaments(response.data))
      .catch((error) => console.error("Error fetching upcoming tournaments:", error));

    axios
      .get("http://localhost:8000/api/tournaments/friends")
      .then((response) => setFriendsTournaments(response.data))
      .catch((error) => console.error("Error fetching friends tournaments:", error));
  }, []);

  const handleFormSubmit = (data: any): void => {
    console.log("Tournament Data:", data);
    setShowForm(false);
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/player/${user.uid}`); // Use the user's UID or username
    }
    setDropdownOpen(false); // Close dropdown
  };

  const handleSettings = () => {
    navigate("/settings"); // Navigate to settings page
    setDropdownOpen(false); // Close dropdown
  };

  const handleSignOut = () => {
    auth.signOut();
    setDropdownOpen(false); // Close dropdown after sign out
  };

  const handleTournamentDropdown = (action: string) => {
    setTournamentDropdownOpen(false); // Close dropdown after selection
    if (action === "create") {
      setShowForm(true); // Show the create tournament form
    } else if (action === "view") {
      console.log("View Tournament clicked"); // Add your logic to view tournaments
    } else if (action === "join") {
      console.log("Join Tournament clicked"); // Add your logic to join tournaments
    }
  };

  return (
    <div className="app">
      <div className="flex flex-row w-full">
        <header
          className="header relative flex justify-between items-center w-full"
          style={{ height: "60px", padding: "0 20px" }}
        >
          {/* Profile Dropdown with Circular Button and Display Name */}
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              {/* Profile Picture Circle */}
              <button
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7077A1] focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div> // Placeholder if no image
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-[140px] bg-white shadow-md rounded-md z-50">
                  <ul className="text-gray-700">
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleProfile}
                    >
                      Profile
                    </li>
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleSettings}
                    >
                      Settings
                    </li>
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Display User's Name next to the profile circle with color #F6B17A */}
            {user && (
              <span className="font-semibold" style={{ color: "#F6B17A" }}>
                {user.displayName || "User"}
              </span>
            )}
          </div>

          {/* Tournament Dropdown */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setTournamentDropdownOpen(!tournamentDropdownOpen)}
                className="rounded-md bg-[#7077A1] text-white px-4 py-2"
              >
                Tournament
              </button>
              {tournamentDropdownOpen && (
                <div className="absolute left-0 mt-2 w-[160px] bg-white shadow-md rounded-md z-50">
                  <ul className="text-gray-700">
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleTournamentDropdown("create")}
                    >
                      Create Tournament
                    </li>
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleTournamentDropdown("view")}
                    >
                      View Tournaments
                    </li>
                    <li
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleTournamentDropdown("join")}
                    >
                      Join Tournament
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Search Players Textbox */}
            <div className="ml-4">
              <input
                type="text"
                placeholder="Search players"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>
        </header>
      </div>

      <div className="main flex flex-col items-center w-full mt-4">
        {/* Featured Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Featured Tournaments</h3>
          <ul>
            {featuredTournaments.map((tournament) => (
              <li key={tournament.id} className="mb-2">
                {tournament.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Recent Tournaments</h3>
          <ul>
            {recentTournaments.map((tournament) => (
              <li key={tournament.id} className="mb-2">
                {tournament.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Upcoming Tournaments</h3>
          <ul>
            {upcomingTournaments.map((tournament) => (
              <li key={tournament.id} className="mb-2">
                {tournament.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Friends Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Friends Tournaments</h3>
          <ul>
            {friendsTournaments.map((tournament) => (
              <li key={tournament.id} className="mb-2">
                {tournament.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

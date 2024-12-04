import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PlayerProfilePage from './routes/PlayerProfilePage';
import SearchPlayerForm from "./components/searchPlayerForm";
import { Routes, Route, useNavigate, Link } from "react-router-dom"; // Corrected import for useNavigate
import { auth } from "./utils/FirbaseConfig";

function App(): JSX.Element {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Dropdown state for profile
  const [tournamentDropdownOpen, setTournamentDropdownOpen] = useState<boolean>(false); // Dropdown state for tournament
  const [user, setUser] = useState<any>(null); // User state to store the logged-in user's info
  const [featuredTournaments, setFeaturedTournaments] = useState<any[]>([]);
  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [friendsTournaments, setFriendsTournaments] = useState<any[]>([]);
  const [lastTournament, setLastTournament] = useState<any>(null); // Last tournament player participated in
  const [friendsOnline, setFriendsOnline] = useState<any[]>([]); // Online friends
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    // Fetch tournament data and friends data
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

    axios
      .get("http://localhost:8000/api/tournaments/last")
      .then((response) => setLastTournament(response.data))
      .catch((error) => console.error("Error fetching last tournament:", error));

    axios
      .get("http://localhost:8000/api/friends/online")
      .then((response) => setFriendsOnline(response.data))
      .catch((error) => console.error("Error fetching online friends:", error));
  }, []);

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    if (query.trim() !== "") {
      try {
        const response = await axios.get(`http://localhost:8000/api/players/search?query=${query}`);
        const players = response.data;

        // Debug: Log the players array to the console
        console.log("Players array:", players);
        console.log("Test 1")

        players.forEach((player: { displayname: string }) => {
          console.log(player.displayname);
        });        

        // Filter players to show only those whose displayName starts with the search query
        const filteredPlayers = players.filter((player: { displayname: string }) =>
        player.displayname && player.displayname.toLowerCase().startsWith(query.toLowerCase())); // Case-insensitive match for display names starting with query

        // Debug: Log the players array to the console
        console.log("Players array:", filteredPlayers);
        console.log("Test 2")

        setSearchResults(filteredPlayers.slice(0, 10)); // Limit to 10 results
      } catch (error) {
        console.error("Error searching players:", error);
      }
    } else {
      setSearchResults([]); // Clear results if search query is empty
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/players/search?query=${searchQuery}`
        );
        setSearchResults(response.data); // Set search results
        console.log(response.data); // Display the results in console
      } catch (error) {
        console.error("Error searching players:", error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(); // Trigger search when Enter is pressed
    }
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
      <header className="header relative flex justify-between items-center w-full" style={{ height: "60px", padding: "0 20px" }}>
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
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-[140px] bg-white shadow-md rounded-md z-50">
                <ul className="text-gray-700">
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleProfile}>
                    Profile
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleSettings}>
                    Settings
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleSignOut}>
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
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleTournamentDropdown("create")}>
                    Create Tournament
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleTournamentDropdown("view")}>
                    View Tournaments
                  </li>
                  <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleTournamentDropdown("join")}>
                    Join Tournament
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Define Routes */}
        <Routes>
        <Route path="/player/:playername" element={<PlayerProfilePage />} />
        </Routes>

          {/* Search Players Textbox */}
          <div className="ml-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search players"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
            />

            {/* Display Player Search Results */}
            {searchResults.length > 0 && (
              <ul className="absolute bg-gray-800 text-white mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-600">
                {searchResults.map((player) => (
                  <li
                    key={player.displayname}
                    className="py-2 px-4 hover:bg-gray-700 cursor-pointer"
                  >
                    {/*player.displayname*/}
                    <Link to={`/player/${player.displayname}`}>{player.displayname}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="main flex flex-col items-center w-full mt-4">
        {/* Last Tournament and Friends Online */}
        <div className="flex w-4/5 mb-4 space-x-4">
          {/* Last Tournament */}
          <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Last Tournament</h3>
            {lastTournament ? (
              <div>{lastTournament.name}</div>
            ) : (
              <div>No tournament history available.</div>
            )}
          </div>

          {/* Friends Online */}
          <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Friends Online</h3>
            {friendsOnline.length > 0 ? (
              <ul>
                {friendsOnline.map((friend) => (
                  <li key={friend.id}>{friend.name}</li>
                ))}
              </ul>
            ) : (
              <div>No friends online.</div>
            )}
          </div>
        </div>

        {/* Featured Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Featured Tournaments</h3>
          {featuredTournaments.length > 0 ? (
            <ul>
              {featuredTournaments.map((tournament) => (
                <li key={tournament.id} className="mb-2">
                  {tournament.name}
                </li>
              ))}
            </ul>
          ) : (
            <div>None available.</div>
          )}
        </div>

        {/* Recent Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Recent Tournaments</h3>
          {recentTournaments.length > 0 ? (
            <ul>
              {recentTournaments.map((tournament) => (
                <li key={tournament.id} className="mb-2">
                  {tournament.name}
                </li>
              ))}
            </ul>
          ) : (
            <div>None available.</div>
          )}
        </div>

        {/* Upcoming Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Upcoming Tournaments</h3>
          {upcomingTournaments.length > 0 ? (
            <ul>
              {upcomingTournaments.map((tournament) => (
                <li key={tournament.id} className="mb-2">
                  {tournament.name}
                </li>
              ))}
            </ul>
          ) : (
            <div>None available.</div>
          )}
        </div>

        {/* Friends' Tournaments Section */}
        <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Friends' Tournaments</h3>
          {friendsTournaments.length > 0 ? (
            <ul>
              {friendsTournaments.map((tournament) => (
                <li key={tournament.id} className="mb-2">
                  {tournament.name}
                </li>
              ))}
            </ul>
          ) : (
            <div>None available.</div>
          )}
        </div>

        {/* Display search results if available */}
        {searchResults.length > 0 && (
          <div className="w-4/5 p-4 mb-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            <ul>
              {searchResults.map((player) => (
                <li key={player.id} className="mb-2">
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
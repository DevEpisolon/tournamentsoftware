import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PlayerProfilePage from './routes/PlayerProfilePage';
import SearchPlayerForm from "./components/searchPlayerForm";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { auth } from "./utils/FirbaseConfig";
import Settings from "./routes/Settings";
import { useAuth } from "./utils/AuthContext.tsx";

function App(): JSX.Element {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [tournamentDropdownOpen, setTournamentDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [featuredTournaments, setFeaturedTournaments] = useState<any[]>([]);
  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<any[]>([]);
  const [friendsTournaments, setFriendsTournaments] = useState<any[]>([]);
  const [lastTournament, setLastTournament] = useState<any>(null);
  const [friendsOnline, setFriendsOnline] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playerImage, setPlayerImage] = useState<string | null>(null);

  const fetchPlayerData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/players/search?query=${currentUser.displayName}`);
      const playerData = response.data; // Assuming the API returns player data in the response
  
      console.log("Player Data after fetch:", playerData);
  
      // Access the avatar URL from playerData
      setPlayerImage(playerData[0]?.avatar);
      
      console.log("avatar url from playerData: ", playerImage)
      console.log("avatar url from playerImage: ", playerImage)
  
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };
  
  useEffect(() => {
    fetchPlayerData();
  }, [currentUser]);

  /*useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const [featured, recent, upcoming, friends, last, onlineFriends] = await Promise.all([
          axios.get("http://localhost:8000/api/tournaments/featured"),
          axios.get("http://localhost:8000/api/tournaments/recent"),
          axios.get("http://localhost:8000/api/tournaments/upcoming"),
          axios.get("http://localhost:8000/api/tournaments/friends"),
          axios.get("http://localhost:8000/api/tournaments/last"),
          axios.get("http://localhost:8000/api/friends/online"),
        ]);
        setFeaturedTournaments(featured.data);
        setRecentTournaments(recent.data);
        setUpcomingTournaments(upcoming.data);
        setFriendsTournaments(friends.data);
        setLastTournament(last.data);
        setFriendsOnline(onlineFriends.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTournaments();
  }, []);*/

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    if (query.trim() !== "") {
      try {
        const response = await axios.get(`http://localhost:8000/api/players/search?query=${query}`);
        const players = response.data;

        players.forEach((player: { displayname: string }) => {
          console.log(player.displayname);
        });        

        // Filter players to show only those whose displayName starts with the search query
        const filteredPlayers = players.filter((player: { displayname: string }) =>
        player.displayname && player.displayname.toLowerCase().startsWith(query.toLowerCase())); // Case-insensitive match for display names starting with query

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
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching players:", error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleProfile = () => {
    if (currentUser) {
      navigate(`/player/${currentUser.displayName}`);
    }
    setDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setDropdownOpen(false);
    navigate("/signin");
  };

  const handleTournamentDropdown = (action: string) => {
    setTournamentDropdownOpen(false);
    if (action === "create") {
      navigate("/createTournament")
    } else if (action === "view") {
      console.log("View Tournament clicked");
      navigate("/viewTournaments");
    } else if (action === "join") {
      setShowJoinModal(true); // Show the join modal
    }
  };

  const handleJoinTournament = async () => {
  if (joinCode.length === 6) {
    try {
      const response = await axios.get(`http://localhost:8000/api/tournaments/join/${joinCode}`);
      if (response.data.success) {
        const tournamentId = response.data.tournament._id; // Extract the tournament ID
        navigate(`/tournament/${tournamentId}`); // Navigate to the desired URL
        alert("Successfully joined the tournament!");
        setShowJoinModal(false);
      } else {
        setErrorMessage("Invalid tournament code.");
      }
    } catch (error) {
      console.error("Error joining tournament:", error);
      setErrorMessage("An error occurred while joining the tournament.");
    }
  } else {
    setErrorMessage("Please enter a valid 6-digit code.");
  }
};


  console.log("Player Image before:", playerImage)

  return (
    <div className="app" style={{ backgroundColor: "#2D3250" }}>
      <header
        className="header relative flex justify-between items-center w-full"
        style={{ height: "60px", padding: "0 20px", backgroundColor: "#424769" }}
      >
        <div className="relative flex items-center space-x-2">
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7077A1] focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {currentUser? (
                <img
                  src={playerImage}
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
                  {currentUser == null ? (
                    <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/signin")}>
                      Sign In
                    </li>
                  ) : (
                    <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleSignOut}>
                      Sign Out
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {currentUser && (
            <span className="font-semibold" style={{ color: "#F6B17A" }}>
              {currentUser.displayName ? currentUser.displayName : "User"}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setTournamentDropdownOpen(!tournamentDropdownOpen)}
              className="rounded-md bg-[#F6B17A] text-white px-4 py-2"
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
                    <Link to={`/player/${player.displayname}`}>{player.displayname}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Join Tournament Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Enter Tournament Code</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleJoinTournament}
              >
                Join
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/*<div className="main flex flex-col items-center w-full mt-4 space-y-4" style={{ color: "white" }}>
        <div className="w-4/5 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Last Tournament</h3>
          {lastTournament ? <div>{lastTournament.name}</div> : <div>No tournament history available.</div>}
        </div>

        <div className="w-4/5 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Friends Online</h3>
          {friendsOnline.length > 0 ? (
            friendsOnline.map((friend) => <div key={friend.id}>{friend.username}</div>)
          ) : (
            <div>No friends online.</div>
          )}
        </div>

        <div className="w-4/5 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Featured Tournaments</h3>
          {featuredTournaments.length > 0 ? (
            featuredTournaments.map((tournament) => <div key={tournament.id}>{tournament.name}</div>)
          ) : (
            <div>No featured tournaments available.</div>
          )}
        </div>

        <div className="w-4/5 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Upcoming Tournaments</h3>
          {upcomingTournaments.length > 0 ? (
            upcomingTournaments.map((tournament) => <div key={tournament.id}>{tournament.name}</div>)
          ) : (
            <div>No upcoming tournaments available.</div>
          )}
        </div>

        <div className="w-4/5 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Recent Tournaments</h3>
          {recentTournaments.length > 0 ? (
            recentTournaments.map((tournament) => <div key={tournament.id}>{tournament.name}</div>)
          ) : (
            <div>No recent tournaments available.</div>
          )}
        </div>

        {showForm && <SearchPlayerForm />}
      </div>*/}
    </div>
  );
}

export default App;

// App.tsx

import React, { useState } from 'react';
import './App.css'; // Importing CSS file for styling
import TournamentForm from './components/TournamentForm'; // Importing TournamentForm component
import TournamentList from './components/TournamentList'; // Importing TournamentList component
import PlayerList, { Player } from './components/PlayerList'; // Importing PlayerList component
import SingleElimination from './components/single-elimination';
import SearchPlayerForm from './components/searchPlayerForm'; // Importing SearchPlayerForm component
import axios from 'axios'
function App(): JSX.Element {
  const [playerCount, setPlayerCount] = useState(0); // Initialize playerCount state
  const [tournyName, setTournyName] = useState(''); // Initialize tournament name state
  const [player, setPlayer] = useState<Player[]>([]); // Initialize player state
  const [searchValue, setSearchValue] = useState(''); // Initialize search value state
  const [showForm, setShowForm] = useState<boolean>(false); // Initialize state for form visibility

  // Function to update playerCount
  const updatePlayerCount = (newCount: number) => {
    setPlayerCount(newCount);
  };

  // Function to update player list
  const updatePlayer = (newPlayerList: Player[]) => {
    setPlayer(newPlayerList);
  };

  // Function to update tournament name
  const updateTournyName = (newName: string) => {
    setTournyName(newName);
  };

  // Function to create player list
  const createPlayerList = (playerCount: number) => {
    let playerList: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      playerList.push({ id: 'i', name: `Player ${i}`, email: '' });
    }
    updatePlayer(playerList);
  };

  // Function to handle form submission
  const handleFormSubmit = (data: any): void => {
    // Send data to backend to create tournament
    console.log('Tournament Data:', data);
    const tournament_data = data;
    // Set tournament size to the value of the tournament form
    let tournament_size: number = parseInt(tournament_data.tournamentSize);
    console.log(tournament_size);
    // Reset form state to hide the form after submission
    setShowForm(false);
    updatePlayerCount(tournament_size);
    updateTournyName(tournament_data.tournamentName);
    createPlayerList(tournament_size);
  };

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Function to handle search submit
  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Do something with the search value, for now just log it
      console.log('Search Value:', searchValue);
    }
  };

  return (
    <div className="app"> {/* Container for the entire application */}
      {/* Header */}
      <header className="header relative flex justify-between items-center" style={{ height: '80px' }}> {/* Header section */}
        {/* Wrapper for the form and create tournament button */}
        <div className="flex items-center"> {/* Flex container for aligning items */}
          {/* Button to toggle Tournament Form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-blue-500 text-white px-4 py-2 mt-4 ml-4 absolute top-0 left-0 z-10"
          >
            {showForm ? 'Close Form' : 'Create Tournament'} {/* Conditional rendering of button text */}
          </button>

          {/* Tournament Form */}
          {showForm && <TournamentForm onSubmit={handleFormSubmit} />} {/* Render form when showForm is true */}
        </div>
        {/* Search Box */}
        {showForm || (
          <div className="relative">
            <input
              type="text"
              className="rounded-full bg-gray-300 text-gray-800 py-2 px-4 absolute top-1/2 right-4 transform -translate-y-1/2"
              placeholder="Search for player"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="main">
        {/* Main Content Area */}
        <div className="content"> {/* Content section */}
          <TournamentList /> {/* Render TournamentList component */}
          <h1>{tournyName}</h1> {/* Render tournament name */}
          <hr />
          {/* Conditionally render the brackets based on player count */}
          {playerCount > 0 && <SingleElimination playerCount={playerCount} players={player} />}
          {/* Add content for your main screen here */}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <h2>Players in tournament</h2>
          <PlayerList />
          {/* Add component of rounded names for players which, when clicked, takes you to their profile */}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p> A TAS-32 PRODUCTION &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}

export default App;


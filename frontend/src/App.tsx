import React, { useState } from 'react';
import './App.css'; // Importing CSS file for styling
import TournamentForm from './components/TournamentForm'; // Importing TournamentForm component
import TournamentList from './components/TournamentList'; // Importing TournamentList component
import PlayerList, {Player} from './components/PlayerList'; // Importing PlayerList component
import DoubleElimination from './components/double-elimination';
import LoadingBracket from './components/loading';
import SingleElimination from './components/single-elimination';

function App(): JSX.Element {
  const [playerCount, setPlayerCount] = React.useState(0); // Initialize playerCount state
  const [tournyName, setTournyName] = React.useState('') //Initialize tourny name state
  const [player, setPlayer] = React.useState<Player[]>([]) //Initialize player state
  
  // Function to update playerCount
  const updatePlayerCount = (newCount: number) => {
    setPlayerCount(newCount);
  };
  //Function to update the tournament name
  const updatePlayer = (newPlayerList: Player[]) => {
    setPlayer(newPlayerList)
  }
  //Function to update the tournament name
  const updateTournyName = (newName: string) => {
    setTournyName(newName)
  }
  // Function to create player list
  const createPlayerList = (playerCount: number) => {
    let playerList: Player[] = []
    for (let i = 0; i < playerCount; i++){
      playerList.push({id: 'i', name: `Player ${i}`, email: ''})
    }
    updatePlayer(playerList)
  }
  // Define state variable to control the visibility of the form
  const [showForm, setShowForm] = useState<boolean>(false);
  //initialize tournament data variable equal to tournament form
  // Function to handle form submission
  const handleFormSubmit = (data: any): void => {
    // Send data to backend to create tournament
    console.log('Tournament Data:', data);
    const tournament_data = data
    //set tournament size to the value of the tournament form
    let tournament_size:number = parseInt(tournament_data.tournamentSize);
    console.log(tournament_size)
    // Reset form state to hide the form after submission
    setShowForm(false);
    updatePlayerCount(tournament_size);
    updateTournyName(tournament_data.tournamentName);
    createPlayerList(tournament_size);
    };
  
  return(
    <div className="app"> {/* Container for the entire application */}
      {/* Header */}
      <header className="header relative flex justify-between items-center"> {/* Header section */}
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
        
      {/* Header */}
      <header className="header relative pl-20">
        <h1 className="text-white">Header</h1>
        {/* Rounded input text field */}
        <input
          type="text"
          className="rounded-full bg-gray-300 text-gray-800 py-2 px-4 absolute top-1/2 right-4 transform -translate-y-1/2"
          placeholder="Search for player"
        />
      </header>

      {/* Main Content */}
      <div className="main">
        {/* Main Content Area */}
        <div className="content"> {/* Content section */}
          <TournamentList /> {/* Render TournamentList component */}
          <h1>{tournyName}</h1> {/* Render tournament name */}
          <hr />
          {/*Conditionally renders the brackets based on player count*/}
          {playerCount > 0 ? <SingleElimination playerCount={playerCount} players={player}/> : null}
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
        <p>&copy; {new Date().getFullYear()} Your Website Footer</p>
      </footer>

      {/* Tournament Form */}
      {showForm && <TournamentForm onSubmit={handleFormSubmit} />}
    </div>
  );
}

export default App;


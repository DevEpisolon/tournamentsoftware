import React, { useState, useEffect } from 'react';
import './App.css';
import TournamentForm from './components/TournamentForm';
import PlayerList, { Player } from './components/PlayerList';
import axios from 'axios';
import Tournament from './components/Tournament'; // Import the Tournament component

function App(): JSX.Element {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/tournaments')
      .then(response => {
	console.log('Tournament Data: ' , response.data);
        setTournaments(response.data);
      })
      .catch(error => {
        console.error('Error fetching tournaments:', error);
      });
  }, []);

  const handleFormSubmit = (data: any): void => {
    console.log('Tournament Data:', data);
    setShowForm(false);
    // You may want to refresh the tournaments list here after adding a new tournament
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search input change logic here
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle search submit logic here
  };

  return (
    <div className="app">
      <header className="header relative flex justify-between items-center" style={{ height: '80px' }}>
        <div className="flex items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-blue-500 text-white px-4 py-2 mt-4 ml-4 absolute top-0 left-0 z-10"
          >
            {showForm ? 'Close Form' : 'Create Tournament'}
          </button>
          {showForm && <TournamentForm onSubmit={handleFormSubmit} />}
        </div>
        {!showForm && (
          <div className="relative">
            <input
              type="text"
              className="rounded-full bg-gray-300 text-gray-800 py-2 px-4 absolute top-1/2 right-4 transform -translate-y-1/2"
              placeholder="Search for player"
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </div>
        )}
      </header>

      <div className="main">
        <div className="content">
          {tournaments.map(tournament => (
            <Tournament key={tournament._id} tournament={tournament} />
          ))}
        </div>
        <div className="sidebar">
          <h2>Players in tournament</h2>
          <PlayerList />
        </div>
      </div>

      <footer className="footer">
        <p> A TAS-32 PRODUCTION &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}

export default App;


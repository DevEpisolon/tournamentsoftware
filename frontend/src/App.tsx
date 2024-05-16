import React, { useState, useEffect } from 'react';
import './App.css';
import TournamentForm from './components/TournamentForm';
import PlayersList from './components/PlayersList';
import axios from 'axios';
import Tournament from './components/Tournament';
import TournamentsList from './components/TournamentsList';
import SearchPlayerForm from './components/searchPlayerForm';
import PlayerProfilePage from './components/PlayerProfilePage';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import

function App(): JSX.Element {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch tournaments data from FastAPI when component mounts
    axios.get('http://localhost:8000/api/tournaments')
      .then(response => {
        console.log('Tournament Data:', response.data);
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
            <SearchPlayerForm />
          </div>
        )}
      </header>

      <div className="main">
        <div className="content w-3/4">
          <div className="content-container w-4/5">
            <Routes> {/* Define routes for main content */}
              <Route path="/" element={<TournamentsList tournaments={tournaments} />} />
              <Route path="/player/:playername" element={<PlayerProfilePage />} /> {/* Route for player profile page */}
            </Routes>
          </div>
        </div>
        <div className="sidebar">
          <h2>Players in database</h2>
          <PlayersList />
        </div>
      </div>

      <footer className="footer">
        <p> TAS-32 &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}

export default App;


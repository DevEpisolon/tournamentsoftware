import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerProfilePage from './components/PlayerProfilePage';
import SingleElimination from './components/single-elimination';
import TournamentPage from './components/TournamentPage'; // Add this import

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/player/:playername" element={<PlayerProfilePage />} />
      <Route path="/tournament/:tournamentId" element={<TournamentPage />} /> 
    </Routes>
  </Router>,
  document.getElementById('root')
);


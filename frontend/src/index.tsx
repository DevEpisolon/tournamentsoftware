import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerProfilePage from './components/PlayerProfilePage';
import TournamentPage from './components/TournamentPage'; // Import TournamentPage component

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/player/:playername" element={<PlayerProfilePage />} />
      {/* Add :tournamentId parameter */}
    <Route path="/tournament/:tournamentId" element={<TournamentPage />}/>
   </Routes>
  </Router>,
  document.getElementById('root')
);


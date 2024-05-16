import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerProfilePage from './components/PlayerProfilePage';
import SingleElimination from './components/single-elimination';


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/player/:playername" element={<PlayerProfilePage />} />
      <Route path="/tournament/663ebbbddc53254338df8862" element={<SingleElimination />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);


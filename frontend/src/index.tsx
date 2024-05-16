import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerProfilePage from './components/PlayerProfilePage'; // Import the PlayerProfilePage component
import SingleElimination from './components/single-elimination';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/stats/:displayName" element={<PlayerProfilePage />} />
      <Route path="/tournament/663ebe3ec4a0dc08c9da61c6" element={<SingleElimination />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);


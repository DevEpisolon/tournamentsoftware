import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerProfilePage from './components/PlayerProfilePage'; // Import the PlayerProfilePage component

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/stats/:displayName" element={<PlayerProfilePage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);


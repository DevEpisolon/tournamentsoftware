import React from 'react';
import DoubleElimination from './components/double-elimination';
import LoadingBracket from './components/loading';
import SingleElimination from './components/single-elimination';
import './App.css'

const App = () => {
  return (
    <div className="app">
      <header className="header relative">
        <h1 className="text-white">Add buttons here maybe components</h1>
        <div className="rounded-full bg-gray-300 text-gray-800 py-2 px-4 absolute top-1/2 right-4 transform -translate-y-1/2">
          <p>Rounded Text Box</p>
        </div>
      </header>

      <div className="main">
        <div className="content">
          <h3>Single Elimination</h3>
          <hr />
          <SingleElimination player_count={8} />
          <h3>Double Elimination</h3>
          <hr />
          <DoubleElimination/>
      </div>

        <div className="sidebar">
          <h2>Players in tournament</h2>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Your Website Footer</p>
      </footer>
    </div>
  );
};

export default App;
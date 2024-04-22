// App.js

import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header relative">
        <h1 className="text-white">Add buttons here maybe components</h1>
        {/* Rounded text box */}
        <div className="rounded-full bg-gray-300 text-gray-800 py-2 px-4 absolute top-1/2 right-4 transform -translate-y-1/2">
          <p>Rounded Text Box</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="main">
        {/* Main Content Area */}
        <div className="content">
          <h2>Main Content</h2>
          {/* Add content for your main screen here */}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <h2>Players in tournament</h2>
          {/* Add component of rounded names for playres which clicked takes oyu to their profile*/}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Your Website Footer</p>
      </footer>
    </div>
  );
}

export default App;


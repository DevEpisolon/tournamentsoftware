import React, { useState } from 'react';
import './App.css';
import TournamentForm from './components/TournamentForm';
import TournamentList from './components/TournamentList';
import PlayerList from './components/PlayerList';

interface FormData {
  // Define the shape of your form data
}

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleFormSubmit = (data: FormData): void => {
    // Send data to backend to create tournament
    console.log('Tournament Data:', data);
    // Reset form
    setShowForm(false);
  };

  return (
    <div className="app">
      {/* Create Tournament Button */}
      <button
        onClick={() => setShowForm(true)}
        className="rounded-md bg-blue-500 text-white px-4 py-2 mt-4 ml-4 absolute top-0 left-0 z-10"
      >
        Create Tournament
      </button>

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
        <div className="content">
          <h2>Main Content</h2>
          {/* Add content for your main screen here */}
          <TournamentList />
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


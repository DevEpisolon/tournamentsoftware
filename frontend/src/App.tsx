//Added chat gpt comments so that we can follow along and not get lost this shit is confusing

import React, { useState } from 'react';
import './App.css'; // Importing CSS file for styling
import TournamentForm from './components/TournamentForm'; // Importing TournamentForm component
import TournamentList from './components/TournamentList'; // Importing TournamentList component
import PlayerList from './components/PlayerList'; // Importing PlayerList component

function App(): JSX.Element {
  // Define state variable to control the visibility of the form
  const [showForm, setShowForm] = useState<boolean>(false);

  // Function to handle form submission
  const handleFormSubmit = (data: any): void => {
    // Send data to backend to create tournament
    console.log('Tournament Data:', data);
    // Reset form state to hide the form after submission
    setShowForm(false);
  };

  return (
    <div className="app"> {/* Container for the entire application */}
      {/* Header */}
      <header className="header relative flex justify-between items-center"> {/* Header section */}
        {/* Wrapper for the form and create tournament button */}
        <div className="flex items-center"> {/* Flex container for aligning items */}
          {/* Button to toggle Tournament Form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 mr-2"
          >
            {showForm ? 'Close Form' : 'Create Tournament'} {/* Conditional rendering of button text */}
          </button>
          
          {/* Tournament Form */}
          {showForm && <TournamentForm onSubmit={handleFormSubmit} />} {/* Render form when showForm is true */}
        </div>

        {/* Wrapper for the rounded text box */}
        <div> {/* Container for rounded text box */}
          {/* Rounded input text field */}
          <input
            type="text"
            className="rounded-full bg-gray-300 text-gray-800 py-2 px-4"
            placeholder="Rounded Text Box"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="main"> {/* Main content area */}
        {/* Main Content Area */}
        <div className="content"> {/* Content section */}
          <h2>Main Content</h2>
          {/* Add content for your main screen here */}
          <TournamentList /> {/* Render TournamentList component */}
        </div>

        {/* Sidebar */}
        <div className="sidebar"> {/* Sidebar section */}
          <h2>Players in tournament</h2>
          <PlayerList /> {/* Render PlayerList component */}
          {/* Add component of rounded names for players which, when clicked, takes you to their profile */}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer"> {/* Footer section */}
        <p>&copy; {new Date().getFullYear()} Your Website Footer</p> {/* Render footer content */}
      </footer>
    </div>
  );
}

export default App; // Export App component as default


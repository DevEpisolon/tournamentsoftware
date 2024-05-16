import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SearchPlayerForm() {
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/api/players/get_player/${displayName}`);
      const playerData = response.data;
      console.log('Player data:', playerData); // Log playerData to check if it's retrieved successfully
      navigate(`/player/${displayName}`, { state: { playerData } });
    } catch (error) {
      console.error('Error fetching player data:', error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full" style={{ maxWidth: '300px' }}>
      <input
        type="text"
        value={displayName}
        onChange={handleChange}
        placeholder="Enter Display Name"
        className="rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2 w-full mr-2"
        style={{ color: 'black' }} // Set text color to black
      />
      {/* Remove the submit button */}
    </form>
  );
}

export default SearchPlayerForm;


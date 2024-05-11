import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPlayerForm() {
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Navigate to stats page with display name as parameter
    navigate(`/stats/${displayName}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={displayName}
        onChange={handleChange}
        placeholder="Enter Display Name"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SearchPlayerForm;


import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function searchPlayerForm() {
  const [displayName, setDisplayName] = useState('');
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Navigate to stats page with display name as parameter
    history.push(`/stats/${displayName}`);
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

export default searchPlayerForm;


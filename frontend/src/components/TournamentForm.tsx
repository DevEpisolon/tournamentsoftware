import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  tournamentName: string;
  tournamentSize: string;
}

interface Props {
  onSubmit: (formData: FormData) => void;
}

const TournamentForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<{
    tournamentName: string;
    tournamentSize: string;
  }>({
    tournamentName: '',
    tournamentSize: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="tournament-form">
      <input
        type="text"
        name="tournamentName"
        value={formData.tournamentName}
        onChange={handleChange}
        placeholder="Tournament Name"
        className="rounded-full bg-gray-300 text-black py-2 px-4 mr-2"
        style={{ marginRight: '1rem' }}
      />
      <select
        name="tournamentSize"
        value={formData.tournamentSize}
        onChange={handleChange}
        className="rounded-full bg-gray-300 text-black py-2 px-4 mr-2"
        style={{ marginRight: '1rem' }}
      >
        <option value="">Select Tournament Size</option>
        <option value="8">8 Players</option>
        <option value="16">16 Players</option>
        <option value="32">32 Players</option>
      </select>
      <button type="submit" className="rounded-md bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">
        Create Tournament
      </button>
    </form>
  );
};

export default TournamentForm;


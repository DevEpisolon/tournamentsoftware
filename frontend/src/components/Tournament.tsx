import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  tournament: any;
}

const Tournament: React.FC<Props> = ({ tournament }) => {
  const { tournamentName, maxSlots, players } = tournament;
  const numPlayers = players.length; // Get the number of players

  return (
    <Link to={`/tournament/${tournamentName}`} className="tournament-link">
      <div className="bg-gray-200 rounded-lg p-4 mb-4 relative cursor-pointer">
        <h3 className="text-xl font-semibold mb-2">{tournamentName}</h3>
        <p className="text-sm text-gray-600 absolute bottom-2 right-2">
          {`${numPlayers} / ${maxSlots}`}
        </p>
      </div>
    </Link>
  );
};

export default Tournament;


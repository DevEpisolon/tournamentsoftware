import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  tournament: any; // Replace 'any' with the actual type of your tournament data
}

const Tournament: React.FC<Props> = ({ tournament }) => {
  return (
    <Link to={`/tournament/${tournament._id}`} className="tournament-link">
      <div className="bg-gray-200 rounded-lg p-4 mb-4 relative cursor-pointer">
        <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
        <p className="text-sm text-gray-600 absolute bottom-2 right-2">
          {`${tournament.Players.length} / ${tournament.MaxSlotsCount}`}
        </p>
      </div>
    </Link>
  );
};

export default Tournament;


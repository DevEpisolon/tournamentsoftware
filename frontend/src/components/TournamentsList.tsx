import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  tournaments: any[];
}

const TournamentsList: React.FC<Props> = ({ tournaments }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '400px' }}>
      <h2 className="text-xl font-bold mb-4">Tournaments List</h2>
      <div className="space-y-4">
        {tournaments.map((tournament: any, index: number) => (
          <Link to={`/tournament/${tournament._id}`} key={index}>
            <div className="bg-gray-100 rounded-md shadow-md p-4">
              <div className="font-semibold">{tournament.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TournamentsList;


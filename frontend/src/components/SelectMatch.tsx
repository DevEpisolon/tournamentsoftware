import React, { useState, useEffect } from 'react';

interface Player {
    id: string; //Unique identifier for the player
    name: string; //Name of the player
    email: string; //Email of the player
  }

export interface Match {
  id: string; //Unique identifier for the player
  players: Player[]; //Name of the players
}

const MatchList: React.FC<Match> = ({id, players}) => {
const [match, setMatch] = useState<Match>({id: '', players: []});

return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Players List</h2>
        <ul>
            {match.players.map(player => (
                <li key={player.id} className="mb-2">
                    <span className="font-semibold">{player.name}</span>
                </li>
            ))}
        </ul>
    </div>
);
};

export default MatchList;



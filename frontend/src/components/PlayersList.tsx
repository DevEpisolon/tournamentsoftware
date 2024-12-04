import React, { useState, useCallback, useMemo } from 'react';
import { MdSearch } from 'react-icons/md';

interface Player {
  displayname: string;
  playername: string;
  uniqueid?: string;
  email?: string;
  wins: number;
  losses: number;
  ties: number;
  wlratio: number;
  winstreaks: number;
  match_history: any[];
  avatar?: string;
  join_date?: string;
  current_tournament_wins: number;
  current_tournament_losses: number;
  current_tournament_ties: number;
  aboutMe?: string;
}

interface PlayerListProps {
  players: Player[];
  onPlayerClick: (player: Player) => void | Promise<void>;
  title: string;
  maxPlayers?: number;
  emptyMessage?: string;
}

const PlayerList = ({
  players,
  onPlayerClick,
  title,
  maxPlayers,
  emptyMessage = "No players found"
}: PlayerListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(player =>
      player.displayname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  // Memoize player click handler
  const handlePlayerClick = useCallback((player: Player) => {
    onPlayerClick(player);
  }, [onPlayerClick]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title} {maxPlayers ? `(${players.length} / ${maxPlayers})` : `(${players.length})`}</h2>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players..."
          className="w-full px-4 py-2 bg-tourney-navy1 text-white rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-tourney-orange"
        />
        <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="border border-gray-700 rounded p-2 bg-tourney-navy2 overflow-auto h-96">
        {filteredPlayers.length > 0 ? (
          <ul>
            {filteredPlayers.map((player) => (
              <li
                key={player.uniqueid || player.displayname}
                onClick={() => handlePlayerClick(player)}
                className="cursor-pointer mb-2 p-2 bg-gray-800 rounded text-white hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span>{player.displayname}</span>
                  <div className="text-sm text-gray-400">
                    W: {player.current_tournament_wins} L: {player.current_tournament_losses}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 mt-4">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PlayerList);

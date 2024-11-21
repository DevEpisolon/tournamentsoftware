import React from 'react';
import { MdPerson, MdOutlineSchedule } from 'react-icons/md';

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
}

interface Tournament {
  _id: string;
  tournamentName: string;
  STATUS: string;
  STARTDATE: string;
  ENDDATE: string;
  createdAt: string;
  updatedAt: string;
  max_rounds: number;
  maxSlotsPerMatch: number;
  MaxSlotsCount: number;
  matches: any[];
  TournamentType?: any;
  TeamBoolean?: any;
  AllotedMatchTime?: any;
  Players: Player[];
  tournamentWinner?: any;
  droppedPlayers: any[];
  wins_dict: any;
  losses_dict: any;
  ties_dict: any;
}

interface MatchScheduleProps {
  tournament: Tournament | null;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ tournament }) => {
  // Helper function to get player names for a match
  const getMatchPlayers = (match: any) => {
    if (!match.players) return [];
    return match.players.map((Player: Player) => {
      return Player || 'TBD';
    });
  };


  // Helper function to get match status text and color
  const getMatchStatus = (status: number) => {
    switch (status) {
      case 0:
        return { text: 'In Progress', color: 'text-yellow-500' };
      case 1:
        return { text: 'Not Started', color: 'text-gray-500' };
      case 2:
        return { text: 'Finished', color: 'text-green-500' };
      default:
        return { text: 'Unknown', color: 'text-gray-500' };
    }
  };

  // Format date using your function
  const formatDate = (mongo_date: string | undefined) => {
    const safeDate = mongo_date ?? "";
    const date = new Date(safeDate);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDay();
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  if (!tournament) {
    return (
      <div className="bg-tourney-navy2 rounded-lg p-6">
        <p className="text-gray-400">Loading match schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-tourney-navy2 rounded-lg p-6">
      <div className="pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MdOutlineSchedule className="text-tourney-orange" />
          Match Schedule
        </h2>
      </div>

      <div className="pt-4">
        {tournament.matches && tournament.matches.length > 0 ? (
          <div className="space-y-4">
            {tournament.matches.map((match: any, index: number) => (
              <div
                key={match.matchid || index}
                className="bg-tourney-navy1 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">
                    Match #{match.matchid}
                  </span>
                  <span className={`text-sm font-medium ${getMatchStatus(match.match_status).color}`}>
                    {getMatchStatus(match.match_status).text}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineSchedule className="text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {formatDate(match.start_date)}
                  </span>
                </div>

                <div className="flex items-center justify-between ">
                  {getMatchPlayers(match).map((players: Player, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-5 text-gray-200 "
                    >
                      {idx === 1 && (
                        <span className='text-xl'>{players.displayname}</span>
                      )}
                      {players?.avatar === null &&
                        <MdPerson className="text-gray-400 size-20 border rounded-full border-white bg-white " />
                      }
                      {players?.avatar !== null &&
                        <img src={players.avatar} className='size-20 rounded-full' />
                      }
                      {idx === 0 && (
                        <span className='text-xl'>{players.displayname}</span>
                      )}
                      {idx === 0 && (
                        <div className='absolute right-1/2 text-3xl'>
                          <span>0</span>
                          <span className='pl-5 pr-5'>-</span>
                          <span>0</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {getMatchPlayers(match).length === 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-tourney-navy3'>
                        <MdPerson className="text-gray-400" />
                        <p className="text-gray-400 text-sm italic">TBD</p>
                      </div>
                      <div className='flex items-center gap-2 text-tourney-navy3'>
                        <MdPerson className="text-gray-400" />
                        <p className="text-gray-400 text-sm italic">TBD</p>
                      </div>
                    </div>
                  )}
                </div>

                {match.match_winner && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-green-500 text-sm font-medium">
                      Winner: {match.match_winner.displayname}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No matches scheduled yet.</p>
        )}
      </div>
    </div>
  );
};

export default MatchSchedule;

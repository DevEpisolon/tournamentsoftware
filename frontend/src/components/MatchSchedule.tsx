import axios from 'axios';
import { MdPerson, MdOutlineSchedule } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import React, { useState } from 'react'

// Interface definitions
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
  match_history: any[]; // Consider defining a specific type for match history
  avatar?: string | null;
  join_date?: string;
  current_tournament_wins: number;
  current_tournament_losses: number;
  current_tournament_ties: number;
}

interface Match {
  matchid: number;
  slots: number;
  match_status: number;
  round: number;
  start_date?: string;
  players: Player[];
  match_winner?: string | null;
  match_loser?: Player | null;
  winner_next_match_id?: number;
  previous_match_id?: number;
  round_number: number;
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
  matches: Match[];
  TournamentType?: string;
  TeamBoolean?: boolean;
  AllotedMatchTime?: number;
  Players: Player[];
  tournamentWinner?: Player | null;
  droppedPlayers: Player[];
  wins_dict: Record<string, number>;
  losses_dict: Record<string, number>;
  ties_dict: Record<string, number>;
}

interface MatchScheduleProps {
  tournament: Tournament | null;
  onTournamentUpdate?: () => Promise<void>;
}

interface MatchStatus {
  text: string;
  color: string;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ tournament: initialTournament, onTournamentUpdate }) => {
  const [tournament, setTournament] = useState<Tournament | null>(initialTournament);
  // Helper function to get player names for a match
  const getMatchPlayers = (match: Match): Player[] => {
    if (!match.players) return [];
    return match.players;
  };

  // Helper function to get match status text and color
  const getMatchStatus = (status: number): MatchStatus => {
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

  const formatDate = (mongo_date: string | undefined): string => {
    const safeDate = mongo_date ?? "";
    const date = new Date(safeDate);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDay();
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const promoteRound = async (): Promise<void> => {
    if (!tournament?._id) return;
    try {
      await axios.put(`http://localhost:8000/api/${tournament._id}/promote_round`);
    } catch (error) {
      console.error('Error promoting round:', error);
      alert('Failed to promote round');
    }
  };

  const declareWinner = async (matchId: number, playerName: string): Promise<void> => {
    if (!tournament) return;

    try {
      await axios.put(
        `http://localhost:8000/api/tournament/${tournament.tournamentName}/${matchId}/set_winner/${playerName}`
      );

      // Update local state after successful API call
      setTournament(prevTournament => {
        if (!prevTournament) return null;

        return {
          ...prevTournament,
          matches: prevTournament.matches.map(match => {
            if (match.matchid === matchId) {
              return {
                ...match,
                match_winner: playerName,
                match_status: 2 // Set to Finished
              };
            }
            return match;
          })
        };
      });
      if (onTournamentUpdate) {
        await onTournamentUpdate();
      }
    } catch (error) {
      console.error('Error declaring winner:', error);
      alert('Failed to declare winner');
    }
  };

  if (!tournament) {
    return (
      <div className="bg-tourney-navy2 rounded-lg p-6">
        <p className="text-gray-400">Loading match schedule...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-tourney-navy2 rounded-lg p-6 w-5/6">
      <div className="flex pb-4 border-b border-gray-700 justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MdOutlineSchedule className="text-tourney-orange" />
          Match Schedule
        </h2>
        <button
          className="bg-tourney-orange md:px-4 md:text-xl rounded-lg font-semibold hover:scale-105"
          onClick={promoteRound}
        >
          Promote Round
        </button>
      </div>

      <div className="pt-4">
        {tournament.matches && tournament.matches.length > 0 ? (
          <div className="space-y-4">
            {tournament.matches.map((match: Match) => (
              <div key={match.matchid} className="bg-tourney-navy1 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Match #{match.matchid}</span>
                  <span className="text-sm font-medium">Round {match.round}</span>
                  <span className={`text-sm font-medium ${getMatchStatus(match.match_status).color}`}>
                    {getMatchStatus(match.match_status).text}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineSchedule className="text-gray-400" />
                  <span className="text-sm text-gray-300">{formatDate(match.start_date)}</span>
                </div>

                <div className="flex items-center justify-between">
                  {getMatchPlayers(match).map((player: Player, idx: number) => (
                    <div key={player.displayname} className="flex relative items-center gap-5 text-gray-200">
                      {/* Winner Trophy Icon */}
                      {match.match_winner && match.match_winner === player.displayname && (
                        <FaTrophy className="absolute top-3 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xl animate-bounce" />
                      )}

                      {idx === 1 && <span className="text-xl">{player.displayname}</span>}

                      {player.avatar === null ? (
                        <MdPerson className="text-gray-400 size-20 border rounded-full border-white bg-white" />
                      ) : (
                        <img
                          src={player.avatar}
                          className="size-20 rounded-full"
                          alt={`${player.displayname}'s avatar`}
                        />
                      )}

                      {idx === 0 && <span className="text-xl">{player.displayname}</span>}

                      {/* Declare Winner buttons */}
                      {match.match_status !== 2 && (
                        <div className={`flex absolute text-3xl ${idx === 0 ? 'left-60' : 'right-60'}`}>
                          <button
                            className="bg-tourney-orange rounded-md md:px-6 hover:scale-105 md:text-base font-semibold"
                            onClick={() => declareWinner(match.matchid, player.displayname)}
                          >
                            Declare Winner
                          </button>
                        </div>
                      )}
                      {match.match_status === 2 && (
                        <div className={`flex absolute text-3xl ${idx === 0 ? 'left-60' : 'right-60'}`}>

                          {match.match_winner && match.match_winner === player.displayname && (
                            <span>Winner</span>
                          )}

                          {match.match_winner && match.match_winner !== player.displayname && (
                            <span>Loser</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {getMatchPlayers(match).length === 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-tourney-navy3">
                        <MdPerson className="text-gray-400" />
                        <p className="text-gray-400 text-sm italic">TBD</p>
                      </div>
                      <div className="flex items-center gap-2 text-tourney-navy3">
                        <MdPerson className="text-gray-400" />
                        <p className="text-gray-400 text-sm italic">TBD</p>
                      </div>
                    </div>
                  )}
                </div>
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


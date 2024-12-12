import React from "react";
import { Link } from "react-router-dom";

// Define TypeScript interfaces for Tournament and Player
interface Player {
  playername: string;
  displayname: string;
  uniqueid?: string;
  email?: string;
  wins: number;
  losses: number;
  ties: number;
  wlratio: number;
  winstreaks: number;
  match_history: any[]; // Assuming match_history is an array of match objects
  avatar?: string;
  join_date?: string; // Assuming join_date is a string
  current_tournament_wins: number;
  current_tournament_losses: number;
  current_tournament_ties: number;
}

interface Tournament {
  _id: string; // MongoDB ID
  tournamentName: string;
  STATUS: string;
  STARTDATE: string;
  ENDDATE: string;
  createdAt: string;
  updatedAt: string;
  max_rounds: number;
  maxSlotsPerMatch: number;
  MaxSlotsCount: number;
  matches: any[]; // Assuming matches is an array of match objects
  TournamentType?: any; // Change the type if it's not 'any'
  TeamBoolean?: any; // Change the type if it's not 'any'
  AllotedMatchTime?: any; // Change the type if it's not 'any'
  Players: Player[]; // Assuming Players is an array of Player objects
  tournamentWinner?: any; // Change the type if it's not 'any'
  droppedPlayers: any[]; // Assuming droppedPlayers is an array of player objects
  wins_dict: any; // Assuming wins_dict is a dictionary
  losses_dict: any; // Assuming losses_dict is a dictionary
  ties_dict: any; // Assuming ties_dict is a dictionary
  join_code: string;
}

// Props interface for the component
interface Props {
  tournaments: Tournament[];
}

// TournamentsList component
const TournamentsList: React.FC<Props> = ({ tournaments }) => {
  return (
    <div className="tournament-scroll-pane">
      {tournaments.map((tournament) => (
        <Link
          key={tournament._id}
          to={`/tournaments/${tournament._id}`}
          className="tournament-link"
        >
          <div className="bg-gray-150 w-1/2 rounded-lg p-6 mb-6 relative cursor-pointer shadow-lg hover:scale-105 transition-transform">
            {/* MongoDB ID */}
            <p className="text-lg text-[#2D3250] absolute top-2 right-2">
              {tournament.join_code}
            </p>
            <h3 className="text-2xl font-semibold mb-2 text-[#7077A1]">
              {tournament.tournamentName}
            </h3>
            {/* Player count and max slots */}
            <div className="flex items-center justify-center bg-[#7077A1] text-white text-sm font-bold rounded w-24 h-8 absolute bottom-2 right-2">
              {tournament.Players.length} / {tournament.MaxSlotsCount}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TournamentsList;


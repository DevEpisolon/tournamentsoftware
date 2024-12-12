import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import React, { useEffect } from 'react'


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
};

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
};

interface BracketProp {
  tournament: Tournament | null;
};

const SingleElimination: React.FC<BracketProp> = ({ tournament }) => {

  return (
    <SingleEliminationBracket
      matches={tournament.matches}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  )
};

export default SingleElimination;

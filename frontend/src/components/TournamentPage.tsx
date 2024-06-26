import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import { History } from 'history'; 
import { useNavigate } from 'react-router-dom';

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

const PlayerComponent: React.FC<{ player: Player; onClick: () => void }> = ({ player, onClick }) => (
  <li onClick={onClick} className="cursor-pointer mb-2 p-2 bg-gray-800 rounded text-white">
    {player.displayname}
  </li>
);

const TournamentPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [playersInTournament, setPlayersInTournament] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await axios.get<Tournament>(`http://localhost:8000/api/tournaments/${tournamentId}`);
        setTournament(response.data);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
      }
    };

    fetchTournamentData();
  }, [tournamentId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get<Player[]>('http://localhost:8000/api/players/all');
        setAvailablePlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const addPlayerToTournament = (player: Player) => {
    setPlayersInTournament([...playersInTournament, player]);
    setAvailablePlayers(availablePlayers.filter(p => p.displayname !== player.displayname));
  };

  const removePlayerFromTournament = (player: Player) => {
    setPlayersInTournament(playersInTournament.filter(p => p.displayname !== player.displayname));
    setAvailablePlayers([...availablePlayers, player]);
  };

const deleteTournament = async () => {
  try {
    await axios.put(`http://localhost:8000/api/tournament_remove/${tournamentId}`);
    console.log('Tournament deleted successfully.');
    window.history.back();
   } catch (error) {
    console.error('Error deleting tournament:', error);
    // Handle any errors that occur during deletion.
  }
};

  const startTournament = () => {
    if (playersInTournament.length === tournament?.MaxSlotsCount) {
      console.log('Starting tournament...');
      // Implement start functionality
      navigate(`/tournament/${tournamentId}/bracket`);
    } else {
      alert('The tournament lobby is not full. Please add more players before starting the tournament.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{tournament && tournament.tournamentName}</h1>
        </div>
        <div>
          <button className="bg-red-500 text-white px-4 py-2 mr-2" onClick={deleteTournament}>Delete Tournament</button>
          <button className="bg-green-500 text-white px-4 py-2" onClick={startTournament}>Start Tournament</button>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-lg font-semibold">Players in Tournament ({playersInTournament.length} / {tournament?.MaxSlotsCount})</h2>
          <ul className="border border-gray-700 rounded p-2">
            {playersInTournament.map(player => (
              <PlayerComponent key={player.displayname} player={player} onClick={() => removePlayerFromTournament(player)} />
            ))}
          </ul>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-lg font-semibold">Available Players</h2>
          <ul className="border border-gray-700 rounded p-2">
            {availablePlayers.map(player => (
              <PlayerComponent key={player.displayname} player={player} onClick={() => addPlayerToTournament(player)} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;


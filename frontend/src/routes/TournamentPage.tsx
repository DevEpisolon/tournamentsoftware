import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { History } from 'history';
import { useNavigate } from 'react-router-dom';
import SideBar, { SideBarItem } from '../components/SideBar';
import { LuLifeBuoy, LuReceipt, LuBoxes, LuPackage, LuUserCircle, LuBarChart3, LuLayoutDashboard, LuSettings } from 'react-icons/lu'
import { MdCasino } from 'react-icons/md';

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

  /*
useEffect(() => {
  const fetchTournamentData = async () => {
    try {
      const response = await axios.get<Tournament>(`http://localhost:8000/api/tournaments/${tournamentId}`);
      setTournament(response.data);
      setPlayersInTournament(response.data.Players);
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
}, []);*/

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournament data
        const tournamentResponse = await axios.get<Tournament>(`http://localhost:8000/api/tournaments/${tournamentId}`);
        const tournamentData = tournamentResponse.data;

        // Fetch all players
        const playersResponse = await axios.get<Player[]>('http://localhost:8000/api/players/all');
        const allPlayers = playersResponse.data;

        // Set tournament and players data
        setTournament(tournamentData);
        setPlayersInTournament(tournamentData.Players);

        // Filter available players to exclude those already in the tournament
        const tournamentPlayerNames = new Set(tournamentData.Players.map(player => player.displayname));
        const filteredAvailablePlayers = allPlayers.filter(player => !tournamentPlayerNames.has(player.displayname));
        setAvailablePlayers(filteredAvailablePlayers);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching data:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    fetchData();
  }, [tournamentId]);

  const addPlayerToTournament = async (player: Player) => {
    setPlayersInTournament([...playersInTournament, player]);
    await axios.put(`http://localhost:8000/api/add_player/${tournamentId}/${player.displayname}`);
    setAvailablePlayers(availablePlayers.filter(p => p.displayname !== player.displayname));
  };

  const removePlayerFromTournament = async (player: Player) => {
    setPlayersInTournament(playersInTournament.filter(p => p.displayname !== player.displayname));
    setAvailablePlayers([...availablePlayers, player]);
    await axios.put(`http://localhost:8000/api/remove_player/${tournamentId}/${player.displayname}`);
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
    <div className="bg-tourney-navy2 text-white p-8 pl-0 pt-0 pb-0">

      <div className="flex left-10">
        <SideBar>
          <SideBarItem icon={<LuLayoutDashboard size={20} />} text="Dashboard" link="/" alert />
          <SideBarItem icon={<MdCasino size={20} />} text="Tournaments" link="/" active />
          <hr className='my-3' />
          <SideBarItem icon={<LuSettings size={20} />} text="Settings" link="/" alert />
          <SideBarItem icon={<LuLifeBuoy size={20} />} text="Help" link='/' />
        </SideBar>
        <div className={`relative z-0 flex-1 pl-10 pt-5`}>
          <div className={`flex justify-between `}>
            <div>
              <h1 className="text-3xl font-bold">{tournament && tournament.tournamentName}</h1>
            </div>
            <div>
              <button className="bg-red-500 text-white px-4 py-2 mr-2" onClick={deleteTournament}>Delete Tournament</button>
              <button className="bg-green-500 text-white px-4 py-2" onClick={startTournament}>Start Tournament</button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold pb-4">Status: {tournament?.STATUS}</h2>
          </div>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <h2 className="text-lg font-semibold">Players in Tournament ({playersInTournament.length} / {tournament?.MaxSlotsCount})</h2>
              <ul className="border border-gray-700 rounded p-2 bg-tourney-navy2">
                {playersInTournament.map(player => (
                  <PlayerComponent key={player.displayname} player={player} onClick={() => removePlayerFromTournament(player)} />
                ))}
              </ul>
            </div>
            <div className="w-1/2 pl-4">
              <h2 className="text-lg font-semibold">Available Players</h2>
              <ul className="border border-gray-700 rounded p-2 bg-tourney-navy2">
                {availablePlayers.map(player => (
                  <PlayerComponent key={player.displayname} player={player} onClick={() => addPlayerToTournament(player)} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;


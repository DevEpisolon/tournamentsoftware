import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar, { SideBarItem } from '../components/SideBar';
import { LuLayoutDashboard } from 'react-icons/lu'
import { MdCasino, MdArrowDropDown, MdOutlineModeEdit, MdOutlineArrowDropDown, MdPerson, MdFeed } from 'react-icons/md';
import TournamentInfo from '../components/TournamentInfo';

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

const tabIdentifiers = {
  'manage-players': 'manage-players',
  'tournaments': 'tournaments',
  'dashboard': 'dashboard',
  'none': 'none',
  // Add more mappings as needed
};

type TabKey = keyof typeof tabIdentifiers;

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
  const [status, setStatus] = useState<Number>(1)
  const [editStatus, setEditStatus] = useState(false)
  const [selectedPage, setSelectedPage] = useState<TabKey>('manage-players')
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
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

        // Set tournament status
        let currentStatus: number = Number(tournamentData.STATUS)
        setStatus(currentStatus)
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

  // Closes status dropdown menu if clicked outside of the menu
  useEffect(() => {
    const closeDropDown = (e: MouseEvent) => {
      if (buttonRef && !buttonRef.current?.contains(e.target as Node)) {
        setEditStatus(false)
      };
    };
    document.body.addEventListener("click", closeDropDown);
    return () => document.body.removeEventListener("click", closeDropDown);
  },);

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

  // Converts Enum into Status Options
  const enumToStatus = () => {
    if (status == 0) {
      return "In Progress"
    }
    if (status == 1) {
      return "Not Started"
    }
    if (status == 2) {
      return "Finished"
    }
  }

  // This updates the status in frontend so far
  const handleStatus = async (newStatus: number) => {
    setStatus(newStatus);
    setEditStatus((curr) => !curr);
    const statusString: string = String(newStatus);
    await axios.put(`http://localhost:8000/api/update_status/${tournamentId}/${statusString}`);
  }


  const handleTabClick = (tab: TabKey) => {
    setSelectedPage(tab)
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

  // Formats MongoDb's date into a readable date
  const formatDate = (mongo_date: string | undefined) => {
    const safeDate = mongo_date ?? ""
    const date = new Date(safeDate);

    // Get the month day and year
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDay();
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`
  }

  return (
    <div className="bg-tourney-navy1 text-white p-8 pl-0 pt-0 pb-0">

      <div className="flex left-10">
        <SideBar>
          <SideBarItem icon={<LuLayoutDashboard size={20} />} text="Dashboard" link="/" alert onClick={() => handleTabClick('none')} />
          <SideBarItem icon={<MdCasino size={20} />} text="Tournaments" onClick={() => handleTabClick('none')} />
          <hr className='my-3' />
          <SideBarItem icon={<MdFeed size={25} />} text="Info" active={selectedPage === 'tournaments'} onClick={() => handleTabClick('tournaments')} />
          <SideBarItem icon={<MdPerson size={25} />} text="Manage Players" active={selectedPage === 'manage-players'} onClick={() => handleTabClick('manage-players')} />
        </SideBar>
        <div className={`relative z-0 flex-1 pl-10 pt-5`}>
          <div className={`flex justify-between pb-10`}>
            <div>
              <h1 className="text-5xl font-bold">{tournament && tournament.tournamentName}</h1>
            </div>
            <div>
              <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md" onClick={deleteTournament}>Delete Tournament</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={startTournament}>Start Tournament</button>
            </div>
          </div>
          <div id='header2' className='flex'>
            <div id='StatusMenu' className='flex relative align-middle h-8 '>
              <h2 className='font-semibold '>Status:</h2>
              <div className='pl-2'>
                <div id='Status' className={`${editStatus ? "flex shadow-lg rounded-md mb-1 mr-1 bg-gray-800 pl-1" : "flex rounded-sm mb-3"}`}>
                  <span className={``}>{enumToStatus()}</span>
                  <div id='DropdownArrow' className={`relative mt-1 ml-1 button`}>
                    {editStatus && <MdOutlineArrowDropDown></MdOutlineArrowDropDown>}
                  </div>
                </div>
                {editStatus &&
                  <ul id='StatusOptions' className={`${editStatus ? "absolute w-32 transistion ease-in-out delay-150 duration-300 bg-gray-800 translate-x--2 rounded-md" : "hidden"}`}>
                    <li className={`flex justify-center py-2 rounded-sm`}>
                      <button className='relative items-center hover:bg-tourney-navy2 w-4/5 rounded-sm' onClick={() => handleStatus(1)}>Not Started</button>
                    </li>
                    <li className='flex justify-center py-2'>
                      <button className='relative items-center hover:bg-tourney-navy2 w-4/5 rounded-sm' onClick={() => handleStatus(0)}>In Progress</button>
                    </li>
                    <li className='flex justify-center py-2'>
                      <button className='relative item-center hover:bg-tourney-navy2 w-4/5 rounded-sm' onClick={() => handleStatus(2)}>Finished</button>
                    </li>
                  </ul>
                }
              </div>
              <button ref={buttonRef} className={`hover:text-tourney-orange left-full py-0 h-6`} onClick={() => setEditStatus((curr) => !curr)}>
                <MdOutlineModeEdit></MdOutlineModeEdit>
              </button>
            </div>
            <h2 className='mb-6 ml-5 '>Start Date: {formatDate(tournament?.STARTDATE)}</h2>
            <h2 className='ml-5 '>Location: </h2>
          </div>
          {selectedPage === 'manage-players' && (
            <div className="flex justify-center">
              <div className="w-1/3 pr-4">
                <h2 className="text-lg font-semibold">Players in Tournament ({playersInTournament.length} / {tournament?.MaxSlotsCount})</h2>
                <ul className="border border-gray-700 rounded p-2 bg-tourney-navy2 overflow-auto h-96">
                  {playersInTournament.map(player => (
                    <PlayerComponent key={player.displayname} player={player} onClick={() => removePlayerFromTournament(player)} />
                  ))}
                </ul>
              </div>
              <div className="w-1/3 pl-4 ">
                <h2 className="text-lg font-semibold">Available Players</h2>
                <ul className="border border-gray-700 rounded p-2 bg-tourney-navy2 overflow-auto h-96">
                  {availablePlayers.map(player => (
                    <PlayerComponent key={player.displayname} player={player} onClick={() => addPlayerToTournament(player)} />
                  ))}
                </ul>
              </div>
            </div>
          )}
          {selectedPage === 'tournaments' && (
            <div>
              <TournamentInfo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;


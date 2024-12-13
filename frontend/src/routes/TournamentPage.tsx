import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar, { SideBarItem } from '../components/SideBar';
import { LuLayoutDashboard } from 'react-icons/lu'
import { MdCasino, MdOutlineModeEdit, MdOutlineArrowDropDown, MdPerson, MdFeed } from 'react-icons/md';
import { FaListAlt } from 'react-icons/fa';
import TournamentInfo from '../components/TournamentInfo';
import PlayersList from '../components/PlayersList';
import { TournamentPageProvider } from '../context/TournamentPageProvider';
import MatchSchedule from '../components/MatchSchedule';

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
  'info': 'info',
  'tournaments': 'tournaments',
  'dashboard': 'dashboard',
  'matches': 'matches',
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
  const [status, setStatus] = useState<Number>()
  const [editStatus, setEditStatus] = useState(false)
  const [selectedPage, setSelectedPage] = useState<TabKey>('manage-players')
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  //Make a context to share values with other components
  const contextValue = {
    status
  };

  const fetchTournamentData = async () => {
    try {
      const response = await axios.get<Tournament>(`http://localhost:8000/api/tournaments/${tournamentId}`);
      setTournament(response.data);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
    }
  };

  /*
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
    if (playersInTournament.length === tournament?.MaxSlotsCount) {
      alert("Cannot add anymore")
    }
    else {
      setPlayersInTournament([...playersInTournament, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.displayname !== player.displayname));
      await axios.put(`http://localhost:8000/api/add_player/${tournamentId}/${player.displayname}`);
    }
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
    // setEditStatus((curr) => !curr);
    const statusString: string = String(newStatus);
    await axios.put(`http://localhost:8000/api/update_status/${tournamentId}/${statusString}`);
  }


  const handleTabClick = (tab: TabKey) => {
    setSelectedPage(tab)
  };

  const startTournament = async () => {
    if (playersInTournament.length === tournament?.MaxSlotsCount) {
      console.log('Starting tournament...');
      await axios.put(`http://localhost:8000/api/create_matches/${tournamentId}`)
      handleStatus(0)
      alert('Tournament has started')
      fetchTournamentData()
      // Implement start functionality
      // navigate(`/tournament/${tournamentId}/bracket`);
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

  // Creates QR-Code 
  // TODO: Need to change the data variable to an actual link to register
  const generateQR = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=google.com`;
  };

  return (

    <TournamentPageProvider value={contextValue}>
      <div className="bg-tourney-navy1 text-white p-8 pl-0 pt-0 pb-0 ">
        <div className="flex left-10 ">
          <SideBar>
            <SideBarItem icon={<LuLayoutDashboard size={25} />} text="Dashboard" link="/" alert onClick={() => handleTabClick('none')} />
            <SideBarItem icon={<MdCasino size={25} />} text="Tournaments" active={selectedPage === 'tournaments'} onClick={() => handleTabClick('tournaments')} />
            <hr className='my-3' />
            <SideBarItem icon={<MdFeed size={25} />} text="Information" active={selectedPage === 'info'} onClick={() => handleTabClick('info')} />
            <SideBarItem icon={<MdPerson size={25} />} text="Players" active={selectedPage === 'manage-players'} onClick={() => handleTabClick('manage-players')} />
            <SideBarItem icon={<FaListAlt size={25} />} text='Matches' active={selectedPage === 'matches'} onClick={() => handleTabClick('matches')} />
          </SideBar>
          <div className={`relative z-0 flex-1 pl-10 pt-5`}>
            <div className={`flex justify-between pb-10`}>
              <div>
                <h1 className="text-5xl font-bold">{tournament && tournament.tournamentName}</h1>
              </div>
              <div>
                <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md font-semibold" onClick={deleteTournament}>Delete Tournament</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold" onClick={startTournament}>Start Tournament</button>
              </div>
            </div>
            <div className='flex justify-between'>
              <div id='header2' className='flex items-center'>
                <div id='StatusMenu' className='flex relative items-center '>
                  <h2 className='font-semibold '>Status:</h2>
                  <div className='pl-2'>
                    <div id='Status' className={`${editStatus ? "flex shadow-lg rounded-md mb-1 mr-1 bg-gray-800 py-2 px-2" : "flex rounded-sm "}`}>
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
                <h2 className='ml-5 '>Start Date: {formatDate(tournament?.STARTDATE)}</h2>
                <h2 className='ml-5 '>Location: </h2>
              </div>
              {status === 1 && (
                <button className='bg-tourney-orange rounded-md px-4 py-2 font-semibold'> Register</button>
              )}
            </div>

            {selectedPage === 'manage-players' && (
              <div className='flex justify-evenly mt-20'>
                <div className="flex justify-start w-1/2">
                  <div className="w-full pr-4">
                    <PlayersList
                      players={playersInTournament}
                      onPlayerClick={removePlayerFromTournament}
                      title="Players in Tournament"
                      maxPlayers={tournament?.MaxSlotsCount}
                      emptyMessage="No players in tournament"
                    />
                  </div>
                  {status === 1 && (
                    <div className="w-full pl-4">
                      <PlayersList
                        players={availablePlayers}
                        onPlayerClick={addPlayerToTournament}
                        title="Available Players"
                        emptyMessage="No available players"
                      />
                    </div>
                  )}
                </div>
                {status === 1 &&
                  <div className='self-center'>
                    <h2 className='text-lg font-semibold mb-3 '>QR-Code</h2>
                    <div id='img-box'>
                      <img src={generateQR()} id='QR-Code' />
                    </div>
                  </div>
                }
              </div>
            )}
            {selectedPage === 'info' && (
              <div className='mt-20 shrink '>
                <TournamentInfo />
              </div>
            )}
            {selectedPage === 'matches' && (
              <div className='flex'>
                <MatchSchedule tournament={tournament} onUpdate={fetchTournamentData} />
              </div>
            )
            }
          </div>
        </div>
      </div >
    </TournamentPageProvider>
  );
};

export default TournamentPage;


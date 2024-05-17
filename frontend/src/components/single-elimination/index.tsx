//Makes a bracket for Single elimination and assumes each round has 2 players/teams
import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime, IRoundProps, IRenderSeedProps, ISeedProps } from 'react-brackets';
import './index.css'; // Importing tailwin CSS file for styling
import {AiOutlineCaretUp, AiOutlineCaretDown} from 'react-icons/ai';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GeneratedRounds = (player_count: number): IRoundProps[] => {
  //Generates the rounds based on the number of players
  const rounds: IRoundProps[] = [];
  let round_amount = Math.log(player_count)/Math.log(2);
  let player_per_round = player_count/2

  for (let i = 1; i <= round_amount; i++){
    const round: IRoundProps = {
      title: `Round ${i}`,
      seeds: [],
    };
    
    for (let j = 1; j <= player_per_round; j++){
      const seed: ISeedProps = {
        id: j,
        teams: [],
        date: new Date().toDateString()
      }
      round.seeds.push(seed)
    }
    player_per_round = player_per_round/2
    rounds.push(round);
  }
  return rounds;
};

const GeneratePlayers = (rounds: IRoundProps[], players: string[]) => {
  let player_index = 0;
  rounds.forEach((round) => {
    if (round && round.seeds) { // Check if round and round.seeds are not undefined
      round.seeds.forEach((seed) => {
        for (let j = 0; j < 2; j++){
          if (player_index < players.length) {
            let player_to_add = { name: players[player_index], id: player_index + 1 };
            seed.teams.push(player_to_add);
            player_index++;
          }
        }
      });
    }
  });
  return rounds;
};

const RenderSeed = ({ breakpoint, seed, selectedSeed, setSelectedSeed, roundIndex, seedIndex, promotePlayerCallback}: IExtendedRenderSeedProps) => {

  const promotePlayer = (winner: { [key: string]: any; name?: string | undefined; } | undefined) => {
    promotePlayerCallback(winner, roundIndex, seedIndex);
  };

  return (
    <Seed mobileBreakpoint={breakpoint} className='relative flex items-center'>
      <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
        {seed.date}
      </SeedTime>

      <div className='relative flex w-full top-5'>
        <button className={'w-full relative'} onClick={() => {
            let previousValue = selectedSeed;
            setSelectedSeed(!previousValue);
          }
        }>
          <SeedItem>
            <div>
              <SeedTeam>
                {seed.teams?.[0]?.name || '-----------'}
              </SeedTeam>
              <div style={{ height: 1, backgroundColor: '#707070' }}>
                {selectedSeed ? <AiOutlineCaretUp className='absolute inset-y-12 inset-x-20'/> 
                : 
                <AiOutlineCaretDown className='absolute inset-y-12 inset-x-20'/>}
              </div>
              <SeedTeam>{seed.teams?.[1]?.name || '-----------'}</SeedTeam>
            </div>
          </SeedItem>
        </button>
      </div>
      
      {!selectedSeed ? (
          <div className='relative top-10'>
          <div className='invisible'>
            <p>Promote: {seed.teams?.[0]?.name}</p>
            <p>Promote: {seed.teams?.[1]?.name}</p>
          </div>
        </div>
        ) : (
          <div className='relative top-5'>
            <div className='visible flex flex-col items-center'>
              <button className='outline outline-2 outline-offset-2 w-[160px] mb-2 mx-2 hover:bg-lime-400' onClick={() => promotePlayer(seed.teams?.[0])}>
                Promote: {seed.teams?.[0]?.name}</button>
              <button className='outline outline-2 outline-offset-2 w-[160px] mb-2 mx-2 hover:bg-lime-400' onClick={() => promotePlayer(seed.teams?.[1])}>
                Promote: {seed.teams?.[1]?.name}</button>
            </div>
          </div>
        )}
    </Seed>
  );
};

interface IExtendedRenderSeedProps extends IRenderSeedProps {
  selectedSeed: boolean;
  setSelectedSeed: (value: boolean) => void;
  promotePlayerCallback: (winner: { [key: string]: any; name?: string | undefined; } | undefined, roundIndex: number, seedIndex: number) => void;
}

const SingleElimination: React.FC = () => {
  //const { tournamentId } = useParams<{ tournamentId: string }>();
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedSeed, setSelectedSeed] = useState(false);
  const [rounds, setRounds] = useState<IRoundProps[]>([]);

  //Function to update rounds
  const updateRounds = (rounds: IRoundProps[]) => {
    setRounds(rounds);
  };

  //Fetches players from the backend. Right now it is hardcoded to grab all the players in the database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/players/all`);
        const playerData = response.data as any[]; // Assuming the response data is an array of player objects
        const playerNames = playerData.map((player: any) => player.displayname); // Extract display names
        setPlayers(playerNames);
        console.log(playerNames);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  //This is use to start generating rounds and to add players to the bracket
  useEffect(() => {
    let update_rounds = GeneratedRounds(players.length);
    update_rounds = GeneratePlayers(update_rounds, players);
    updateRounds(update_rounds);
  }, [players]);

  //This is for promoting players to the next round
  const promotePlayerCallback = (winner: { [key: string]: any; name?: string | undefined; } | undefined, roundIndex: number, seedIndex: number) => {
    // Get next round
    const nextRound = rounds[roundIndex + 1];
    if (!nextRound) {
      return;
    }
    // Get next seed index
    const nextSeedIndex = Math.floor(seedIndex / 2);
    const nextSeed = nextRound.seeds[nextSeedIndex];
    if (!nextSeed) {
      return;
    }
    // Add the winner to the next seed
    nextSeed.teams.push(winner!);
    // Make a copy of rounds
    const updatedRounds = [...rounds];
    // Update the next round
    updatedRounds[roundIndex + 1] = nextRound;
    setRounds(updatedRounds);
  };
  
  return (
    <div>
      <Bracket
      mobileBreakpoint={767}
      rounds={rounds} //Makes rounds bracket based on player size
      //props for rendering the seed and it is built in the react-brackets library
      //any other paramater is passed to the RenderSeed function
      renderSeedComponent={(props) => (
        <RenderSeed
          seed={props.seed}
          breakpoint={props.breakpoint}
          roundIndex={props.roundIndex}
          seedIndex={props.seedIndex}
          selectedSeed={selectedSeed}
          setSelectedSeed={(value) => setSelectedSeed(value) }
          promotePlayerCallback={promotePlayerCallback}
        />
      )}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
      />
    </div>
  );
};

export default SingleElimination;

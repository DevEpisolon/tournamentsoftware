//Makes a bracket for Single elimination and assumes each round has 2 players/teams
//Need 

import React, { useState } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime, IRoundProps, IRenderSeedProps, ISeedProps } from 'react-brackets';
import {Player} from '../PlayerList';
import './index.css'; // Importing tailwin CSS file for styling
import {AiOutlineCaretRight, AiOutlineCaretLeft} from 'react-icons/ai';

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
        id: 1,
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

//Function to generate player names in the bracket seeds
const GeneratePlayers = (rounds: IRoundProps[], players: Player[]) => {
  let player_index = 0;
  let round = rounds[0]; //Grabs first round

  //Calculate the next power of 2
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log(players.length) / Math.log(2)));

  // Calculate the number of byes
  const byes = nextPowerOf2 - players.length;

  for (let i = 0; i < round.seeds.length; i++){
    for (let j = 0; j < 2; j++){
      if (player_index < players.length) {
        // Assign a player
        round.seeds[i].teams.push(players[player_index]);
        player_index++;
      } else {
        // Assign a bye
        round.seeds[i].teams.push({ name: 'Bye', id: 0 });
      }
    }
  }

  rounds[0] = round;
  
  return rounds;
}

//Function to promote a player to the next round
const PromotePlayer = (rounds: IRoundProps[], player: Player, round_index: number, seed_index: number) => {
  let next_round = rounds[round_index + 1];
  let next_seed_index = Math.floor(seed_index/2);

  next_round.seeds[next_seed_index].teams.push(player);
  rounds[round_index + 1] = next_round;

  return rounds;
}

const RenderSeed = ({ breakpoint, seed}: IRenderSeedProps) => {
  const [selectedSeed, setSelectedSeed] = useState(false);
  return (
    <Seed mobileBreakpoint={breakpoint} className='relative flex items-center rounded-lg'>
      <div className='relative flex w-full'>
        <button className={'w-full relative'} onClick={() => {
            setSelectedSeed((prev) => !prev);
          }
        }>
          <SeedItem>
            <div>
              <SeedTeam>
                {seed.teams?.[0]?.name || '-----------'}
              </SeedTeam>
              <div style={{ height: 1, backgroundColor: '#707070' }}>
                {selectedSeed ? <AiOutlineCaretRight className='absolute inset-y-6 right-0'/> 
                : 
                <AiOutlineCaretLeft className='absolute inset-y-6 right-0'/>}
              </div>
              <SeedTeam>{seed.teams?.[1]?.name || '-----------'}</SeedTeam>
            </div>
          </SeedItem>
        </button>
      </div>
      {!selectedSeed && <div className='relative top-0'>
          <div className=''>
            <p>Promote: {seed.teams?.[0]?.name}</p>
            <p>Promote: {seed.teams?.[1]?.name}</p>
          </div>
          </div>
        }
      <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
        {seed.date}
      </SeedTime>
    </Seed>
  );
};

interface tourny_props{
  playerCount: number
  players: Player[]
}

interface NewInterfaceProps {
  children?: React.ReactNode;
  className?: string;
}

const NewInterface: React.FC<NewInterfaceProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const SingleElimination: React.FC<tourny_props> = ({playerCount, players}) => {
  let rounds = GeneratedRounds(playerCount)
  rounds = GeneratePlayers(rounds, players)

  const handleWin = (player: Player, roundIndex: number, seedIndex: number) => {
    rounds = PromotePlayer(rounds, player, roundIndex, seedIndex);
  };
  
  return (
    <div>
      <Bracket
      mobileBreakpoint={767}
      rounds={rounds} //Makes rounds bracket based on player size
      renderSeedComponent={RenderSeed}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
      />
    </div>
  );
};

export default SingleElimination;

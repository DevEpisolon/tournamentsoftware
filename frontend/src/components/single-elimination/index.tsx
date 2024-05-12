
//I commented it out as it was giving me errors i think you need to grab a fastapi call to grab all the players in a certain tournament id which is sent to you 



/*
//Makes a bracket for Single elimination and assumes each round has 2 players/teams
//Need 

import React, { useState } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime, IRoundProps, IRenderSeedProps, ISeedProps } from 'react-brackets';
import {Player} from '../PlayersList';

const GeneratedRounds = (player_count: number): IRoundProps[] => {
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

const RenderSeed = ({ breakpoint, seed }: IRenderSeedProps) => {
  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem style={{ width: '100%' }}>
        <div>
          <SeedTeam>{seed.teams?.[0]?.name || '-----------'}</SeedTeam>
          <div style={{ height: 1, backgroundColor: '#707070' }}></div>
          <SeedTeam>{seed.teams?.[1]?.name || '-----------'}</SeedTeam>
        </div>
      </SeedItem>
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

const SingleElimination: React.FC<tourny_props> = ({playerCount, players}) => {
  let rounds = GeneratedRounds(playerCount)
  rounds = GeneratePlayers(rounds, players)
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
*/

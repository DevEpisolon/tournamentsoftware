//Makes a bracket for Single elimination and assumes each round has 2 players/teams
//Need 

import React, { useState } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime, IRoundProps, IRenderSeedProps, ISeedProps } from 'react-brackets';

const generated_rounds = (player_count: number): IRoundProps[] => {
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

interface player_count_type{
  player_count: number
  key: number
}

const SingleElimination: React.FC<player_count_type> = ({player_count, key}) => {

  const [player_amount, set_player_amount] = useState(player_count);

  React.useEffect(() => {
    set_player_amount(player_count);
  }, [player_count]);

  return (
    <div>
      <Bracket
      mobileBreakpoint={767}
      rounds={generated_rounds(player_amount)} //Makes rounds bracket based on player size
      renderSeedComponent={RenderSeed}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
      />
    </div>
  );
};

export default SingleElimination;

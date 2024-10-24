// TournamentInfo.tsx
import React, { useState, useEffect } from 'react';
import TipTapEditor from './TipTapEditor';

const TournamentInfo = () => {
  return (
    <div className="relative w-full h-full">
      <h2 className="text-xl font-semibold mb-4">Tournament Info</h2>
      <div className="blank-page relative w-full h-full">
        <TipTapEditor />
      </div>
    </div>
  );
};

export default TournamentInfo;

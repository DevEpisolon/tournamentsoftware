// TournamentInfo.tsx
import React, { useState, useEffect } from 'react';
import TextBox from './TextBox';

const TournamentInfo = () => {
  return (
    <div className="relative w-full h-full">
      <h2 className="text-xl font-semibold mb-4">Tournament Info</h2>
      <div className="blank-page relative w-full h-full">
        <TextBox />
      </div>
    </div>
  );
};

export default TournamentInfo;

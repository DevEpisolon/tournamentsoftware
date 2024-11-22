// TournamentInfo.tsx
import React, { useState, useEffect } from 'react';
import TipTapEditor from './tiptap/TipTapEditor';

const TournamentInfo = () => {
  return (
    <div className='flex'>
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Tournament Info</h2>
        <div id='GeneralInfo' className="w-[535px]">
          <TipTapEditor />
        </div>
      </div>
      <div className='ml-24 '>
        <h2 className='text-xl font-semibold mb-4'>Rules</h2>
        <div id='Rules' className='w-[535px]'>
          <TipTapEditor />
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;

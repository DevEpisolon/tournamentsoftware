import React, { createContext, useContext } from "react"

// Define which values we want to share
interface TournamentPageContextType {
  status?: Number;
};

// Create context
const tournamentContext = createContext<TournamentPageContextType | undefined>(undefined);

// Interface for provider props
interface TournamentPageProviderProps {
  children: React.ReactNode,
  value: TournamentPageContextType,
};

export const TournamentPageProvider = ({ children, value }: TournamentPageProviderProps) => {
  return (
    <tournamentContext.Provider value={value}>
      {children}
    </tournamentContext.Provider>
  );
};

// Create a custom hook to get the page information
export const useTournamentPage = () => {
  const context = useContext(tournamentContext);
  if (context == undefined) {
    throw new Error('Cannot get the context from Tournament Page')
  }
  return context;
};

import React from "react";
import { Link } from "react-router-dom";

interface Player {
    playername: string;
    displayname: string;
    uniqueid?: string;
    email?: string;
    wins: number;
    losses: number;
    ties: number;
    wlratio: number;
    winstreaks: number;
    match_history: { key: string }[]; // Assuming match_history is an array of objects with key-value pairs
    avatar?: string;
    join_date?: string; // Assuming join_date is a string
    current_tournament_wins: number;
    current_tournament_losses: number;
    current_tournament_ties: number;
}

interface MatchHistoryProps {
    player: Player;
}

// MatchHistory component
const MatchHistory: React.FC<MatchHistoryProps> = ({ player }) => {
    return (
        <div className="match-history">
            <ul className="list-disc pl-5">
                {player.match_history.map((match, index) => (
                    <li key={index} className="mb-2">
                        {Object.values(match)[0] === 'winner' ? (
                            <div className="bg-green-100 p-4 rounded-lg shadow-md">
                                <p className="text-lg text-black">{Object.keys(match)[0]}</p>
                                <p className="text-md text-black">Result: {Object.values(match)[0]}</p>
                            </div>
                        ) : (
                            <div className="bg-red-100 p-4 rounded-lg shadow-md">
                                <p className="text-lg text-black">{Object.keys(match)[0]}</p>
                                <p className="text-md text-black">Result: {Object.values(match)[0]}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchHistory;
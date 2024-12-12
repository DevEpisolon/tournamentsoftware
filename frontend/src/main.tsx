import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import PlayerProfilePage from "./routes/PlayerProfilePage";
//import SingleElimination from "./components/single-elimination";
import TournamentPage from "./routes/TournamentPage"; // Add this import
import { AuthProvider } from "./utils/AuthContext";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import RegisterPlayer from "./routes/RegisterPlayer";
import ViewTournaments from "./routes/ViewTournaments.tsx"
import "./App.css"
import Settings from "./routes/Settings.tsx";
import { DialogProvider } from "./utils/DialogProvider.tsx";
import CreateTournament from "./components/CreateTournament.tsx";
import SingleElimination from "./routes/SingleElimination.tsx";

const Index = () => {
  return (
    <AuthProvider>
      <DialogProvider>
        <Router>
          <Routes>
            <Route path="*" element={<App />} />
            <Route path="/player/:playername" element={<PlayerProfilePage />} />
            <Route
              path="/tournament/:tournamentId"
              element={<TournamentPage />}
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/registerPlayer" element={<RegisterPlayer />} />
            <Route path="/viewTournaments/*" element={<ViewTournaments />} />
            <Route path="/featured" element={<div>Featured Tournaments</div>} />
            <Route path="/recent" element={<div>Recent Tournaments</div>} />
            <Route path="/upcoming" element={<div>Upcoming Tournaments</div>} />
            <Route path="/friends" element={<div>Friends Tournaments</div>} />
            <Route path="/player/:id" element={<div>Player Profile</div>} />
            <Route path="/settings" element={<Settings />} /> {/* Add this line */}
            <Route path="/createTournament" element={<CreateTournament />} /> {/* Add this line */}
            <Route path="tournament/:tournamentId/bracket" element={<SingleElimination />} />
          </Routes>
        </Router>
      </DialogProvider>
    </AuthProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

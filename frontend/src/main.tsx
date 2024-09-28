import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PlayerProfilePage from "./components/PlayerProfilePage";
//import SingleElimination from "./components/single-elimination";
import TournamentPage from "./components/TournamentPage"; // Add this import
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRouter from "./utils/ProtectedRoute";
import SignIn from "./components/SignIn";
import SignUp from "./SignUp";
import RegisterPlayer from "./components/RegisterPlayer";

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRouter />}>
          <Route path="/" element={<App />} />
          <Route path="/player/:playername" element={<PlayerProfilePage />} />
          <Route
            path="/tournament/:tournamentId"
            element={<TournamentPage />}
          />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/registerPlayer" element={<RegisterPlayer />} />

        {/* <Route
          //path="/tournament/:tournamentId/bracket"
          //element={<SingleElimination />}
        /> */}

      </Routes>
    </Router>
  </AuthProvider>
)

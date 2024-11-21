import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PlayerProfilePage from "./routes/PlayerProfilePage";
//import SingleElimination from "./components/single-elimination";
import TournamentPage from "./routes/TournamentPage"; // Add this import
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRouter from "./utils/ProtectedRoute";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import RegisterPlayer from "./routes/RegisterPlayer";
import "./App.css"

const Index = () => {
  return (
    <AuthProvider>
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

          {/* <Route
            //path="/tournament/:tournamentId/bracket"
            //element={<SingleElimination />}
          /> */}

        </Routes>
      </Router>
    </AuthProvider>
  )
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
)

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PlayerProfilePage from "./components/PlayerProfilePage";
import SingleElimination from "./components/single-elimination";
import TournamentPage from "./components/TournamentPage"; // Add this import
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRouter from "./utils/ProtectedRoute";
import SignIn from "./components/SignIn";
import SignUp from "./SignUp";

const Index = () => {
  return (
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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

ReactDOM.render(Index(), document.getElementById("root"));

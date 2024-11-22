import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import PlayerProfilePage from "./routes/PlayerProfilePage";
import TournamentPage from "./routes/TournamentPage";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import ProtectedRouter from "./utils/ProtectedRoute";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import RegisterPlayer from "./routes/RegisterPlayer";
import Settings from "./routes/Settings";

const Index = () => {
  const { currentUser } = useAuth();

  console.log("Current User:", currentUser); // Debugging authentication state

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              currentUser ? <ProtectedRouter /> : <Navigate to="/signin" />
            }
          >
            <Route path="/" element={<App />} />
            <Route path="/player/:playername" element={<PlayerProfilePage />} />
            <Route path="/tournament/:tournamentId" element={<TournamentPage />} />
          </Route>

          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registerPlayer" element={<RegisterPlayer />} />
          <Route path="/settings" element={<Settings />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

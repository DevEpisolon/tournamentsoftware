import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouter = () => {
  let { currentUser } = useAuth();
  return currentUser !== null ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRouter;

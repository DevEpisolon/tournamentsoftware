import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRouter = () => {
  // alert("ProtectedRouter");
  let { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(true);

  const checkIfPlayerExists = async (email: string) => {
    try {
      const result = await axios.get(
        `http://localhost:8000/api/player/email/${email}`
      );
      if (result.status === 200) {
        setLoading(false);
        return;
      }
      navigate("/registerPlayer");
    } catch (error) {
      console.error("Error checking if player exists:", error);
      navigate("/registerPlayer");
    }
  };

  React.useEffect(() => {
    if (currentUser != null && isLoggedIn == true) {
      checkIfPlayerExists(currentUser.email!);
    } else {
      // alert("You need to be logged in to access this page");
      setLoading(false);
    }
  }, [currentUser]);

  if (isLoading) return <p>Loading...</p>;

  return currentUser !== null && isLoggedIn == true ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default ProtectedRouter;

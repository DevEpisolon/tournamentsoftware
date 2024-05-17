import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirbaseConfig"; // Adjust the import path as necessary

type AuthContextType = {
  currentUser: User | null;
  isLoggedIn: boolean | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode; // Using ReactNode for children type
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Correct typing for user in onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);

      if (user) {
        if (isLoggedIn === false) {
          setIsLoggedIn(true);
        }
      } else {
        if (isLoggedIn === true) {
          setIsLoggedIn(false);
        }
      }
    });

    return unsubscribe; // Detach the listener when the component is unmounted
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

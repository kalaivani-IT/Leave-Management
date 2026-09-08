// src/context/AuthContext.js
// A simple global store (using React Context) that holds the logged-in user's
// info so any component can read it without passing props everywhere.

import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage on first render so a page refresh keeps you logged in
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can do: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

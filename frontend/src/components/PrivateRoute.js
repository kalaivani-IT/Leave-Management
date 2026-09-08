// src/components/PrivateRoute.js
// Wraps a page so it can only be viewed if the user is logged in.
// If not logged in, it redirects to the /login page.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

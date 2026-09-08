// src/api/axios.js
// A pre-configured axios instance so we don't repeat the base URL and
// authorization header logic in every component.

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend server URL
});

// Before every request, attach the JWT token (if the user is logged in)
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

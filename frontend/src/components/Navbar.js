// src/components/Navbar.js
// Top navigation bar shown on every page once the user is logged in

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // don't show navbar on login/register pages

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Leave Management System</h3>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/apply-leave" style={styles.link}>Apply Leave</Link>
        <Link to="/leave-history" style={styles.link}>Leave History</Link>
        <span style={styles.userInfo}>
          {user.name} ({user.role})
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#1e3a8a",
    color: "#fff",
  },
  logo: { margin: 0 },
  links: { display: "flex", alignItems: "center", gap: "18px" },
  link: { color: "#fff", textDecoration: "none", fontWeight: 500 },
  userInfo: { fontSize: "14px", opacity: 0.85 },
  logoutBtn: {
    padding: "6px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;

// src/pages/ApplyLeave.js
// Form where an employee applies for casual or medical leave

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/leaves/apply", formData);
      setSuccess("Leave application submitted successfully!");
      setTimeout(() => navigate("/leave-history"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Apply for Leave</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <label>Leave Type</label>
        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="casual">Casual Leave</option>
          <option value="medical">Medical Leave</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label>Reason</label>
        <textarea
          name="reason"
          placeholder="Reason for leave"
          value={formData.reason}
          onChange={handleChange}
          style={{ ...styles.input, height: "80px" }}
          required
        />

        <button type="submit" style={styles.button}>Submit Application</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", marginTop: "40px" },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "380px",
    padding: "24px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: { padding: "10px", marginBottom: "14px", borderRadius: "6px", border: "1px solid #ccc" },
  button: {
    padding: "10px",
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: { color: "red", fontSize: "14px" },
  success: { color: "green", fontSize: "14px" },
};

export default ApplyLeave;

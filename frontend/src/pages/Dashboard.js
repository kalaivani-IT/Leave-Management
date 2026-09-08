// src/pages/Dashboard.js
// Shows the logged-in employee's available leave balance.
// If the logged-in user is an admin, it also shows all pending requests to approve/reject.

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [allLeaves, setAllLeaves] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch the employee's own leave balance
  const fetchBalance = async () => {
    const res = await api.get("/leaves/balance");
    setBalance(res.data.leaveBalance);
  };

  // Admin only: fetch every leave request from every employee
  const fetchAllLeaves = async () => {
    const res = await api.get("/leaves/all");
    setAllLeaves(res.data);
  };

  useEffect(() => {
    fetchBalance();
    if (user.role === "admin") {
      fetchAllLeaves();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
      setMessage(`Request ${status.toLowerCase()} successfully`);
      fetchAllLeaves(); // refresh the list
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.name} 👋</h2>

      {/* Leave balance cards */}
      {balance && (
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Casual Leave</h3>
            <p style={styles.count}>{balance.casual}</p>
            <span>days remaining</span>
          </div>
          <div style={styles.card}>
            <h3>Medical Leave</h3>
            <p style={styles.count}>{balance.medical}</p>
            <span>days remaining</span>
          </div>
        </div>
      )}

      {/* Admin-only section: approve / reject pending requests */}
      {user.role === "admin" && (
        <div style={{ marginTop: "40px" }}>
          <h3>All Leave Requests (Admin)</h3>
          {message && <p style={{ color: "green" }}>{message}</p>}
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.user?.name}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.numberOfDays}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleDecision(leave._id, "Approved")}
                          style={styles.approveBtn}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(leave._id, "Rejected")}
                          style={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "24px" },
  cards: { display: "flex", gap: "20px" },
  card: {
    background: "#fff",
    padding: "20px 30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  count: { fontSize: "36px", fontWeight: "bold", color: "#1e3a8a", margin: "8px 0" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  approveBtn: {
    marginRight: "6px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;

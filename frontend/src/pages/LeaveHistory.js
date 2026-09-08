// src/pages/LeaveHistory.js
// Shows the logged-in employee's own past leave applications and their status

import React, { useEffect, useState } from "react";
import api from "../api/axios";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    };
    fetchLeaves();
  }, []);

  const statusColor = (status) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    return "#b45309"; // pending -> amber
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>My Leave History</h2>
      {leaves.length === 0 ? (
        <p>No leave applications yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={{ textTransform: "capitalize" }}>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.numberOfDays}</td>
                <td>{leave.reason}</td>
                <td style={{ color: statusColor(leave.status), fontWeight: "bold" }}>
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
};

export default LeaveHistory;

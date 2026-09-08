// server.js
// Entry point of the backend application

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());          // allows the React frontend (different port) to call this API
app.use(express.json());  // allows the server to read JSON from request bodies

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));

// Simple health check route
app.get("/", (req, res) => {
  res.send("Leave Management System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

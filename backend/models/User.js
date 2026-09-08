// models/User.js
// Represents an employee (or admin) who can log in and apply for leave

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, // stored as a bcrypt hash, never plain text
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    // Leave balances -- every new employee starts with these default days.
    // Feel free to change the default numbers to match your organization's policy.
    leaveBalance: {
      casual: { type: Number, default: 12 },
      medical: { type: Number, default: 10 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

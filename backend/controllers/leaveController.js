// controllers/leaveController.js
// Handles applying for leave, viewing history/balance, and admin approve/reject

const Leave = require("../models/Leave");
const User = require("../models/User");

// Helper: calculates the number of days between two dates (inclusive)
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// @route  POST /api/leaves/apply
// @desc   Employee applies for a leave
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const numberOfDays = calculateDays(startDate, endDate);
    if (numberOfDays <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const user = await User.findById(req.user._id);

    // Check if the employee has enough leave balance left
    const availableBalance = user.leaveBalance[leaveType];
    if (availableBalance === undefined) {
      return res.status(400).json({ message: "Invalid leave type" });
    }
    if (numberOfDays > availableBalance) {
      return res.status(400).json({
        message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} day(s)`,
      });
    }

    // Create the leave request (status defaults to "Pending")
    const leave = await Leave.create({
      user: user._id,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
    });

    // Deduct the days from the balance immediately when applying.
    // If the request is later rejected, the days are refunded (see updateLeaveStatus below).
    user.leaveBalance[leaveType] -= numberOfDays;
    await user.save();

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/leaves/my
// @desc   Get the logged-in employee's own leave history
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/leaves/balance
// @desc   Get the logged-in employee's current leave balance
const getMyBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("leaveBalance name email role");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/leaves/all
// @desc   Admin: view every leave request from every employee
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/leaves/:id/status
// @desc   Admin: approve or reject a pending leave request
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    // If admin rejects, refund the days back to the employee's balance
    if (status === "Rejected") {
      const user = await User.findById(leave.user);
      user.leaveBalance[leave.leaveType] += leave.numberOfDays;
      await user.save();
    }

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getAllLeaves,
  updateLeaveStatus,
};

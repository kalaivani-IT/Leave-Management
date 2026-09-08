// routes/leaveRoutes.js
const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Employee routes (must be logged in)
router.post("/apply", protect, applyLeave);
router.get("/my", protect, getMyLeaves);
router.get("/balance", protect, getMyBalance);

// Admin routes (must be logged in AND be an admin)
router.get("/all", protect, adminOnly, getAllLeaves);
router.put("/:id/status", protect, adminOnly, updateLeaveStatus);

module.exports = router;

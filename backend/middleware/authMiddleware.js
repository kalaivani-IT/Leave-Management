// middleware/authMiddleware.js
// Protects routes by verifying the JWT token sent in the request header

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Checks that the user is logged in (valid token)
const protect = async (req, res, next) => {
  let token;

  // We expect the header to look like: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user (without password) to the request object
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move on to the actual route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// 2. Checks that the logged-in user is an admin (used for approve/reject routes)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };

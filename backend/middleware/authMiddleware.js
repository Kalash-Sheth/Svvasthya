const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
require('dotenv').config();

exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Add user to request object
    req.user = customer;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Optional: Add role-based authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

// Optional: Add rate limiting
exports.rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}; 
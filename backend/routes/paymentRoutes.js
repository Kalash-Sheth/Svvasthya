const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// const { authenticateToken } = require("../middlewares/authMiddleware");
// // All routes should be protected with authentication
// router.use(authenticateToken);

// Create payment order
router.post("/order", paymentController.createOrder);

// Verify payment
router.post("/verify", paymentController.verifyPayment);

// Get payment status
router.get("/status/:appointmentId", paymentController.getPaymentStatus);

// Initiate refund
router.post("/refund", paymentController.initiateRefund);

module.exports = router;

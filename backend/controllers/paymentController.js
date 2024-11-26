const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const Appointment = require("../models/Appointment");
const notificationController = require("./notificationController");
require("dotenv").config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", appointmentId } = req.body;

    if (!amount || !appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Amount and appointment ID are required",
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate(
      "requestByCustomer"
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Create a shorter receipt ID
    const shortReceiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: shortReceiptId,
      notes: {
        appointmentId: appointmentId,
      },
    });

    // Create initial transaction record
    const transaction = new Transaction({
      transactionID: order.id,
      appointmentID: appointmentId,
      customerID: appointment.requestByCustomer._id,
      totalAmountReceived: amount,
      status: "Pending",
      paymentMode: "Online",
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Update the transaction with attendant details when assigned
exports.updateTransactionAttendant = async (appointmentId, attendantId) => {
  try {
    const transaction = await Transaction.findOne({
      appointmentID: appointmentId,
      status: "Pending",
    });

    if (transaction) {
      transaction.attendantID = attendantId;
      transaction.amountReceivedByAttendant =
        transaction.totalAmountReceived * 0.8;
      await transaction.save();
    }
  } catch (error) {
    console.error("Error updating transaction attendant:", error);
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Transaction.findOneAndUpdate(
        { transactionID: razorpay_order_id },
        { status: "Failed" }
      );
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId).populate(
      "requestByCustomer"
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update transaction status
    const transaction = await Transaction.findOneAndUpdate(
      { transactionID: razorpay_order_id },
      {
        status: "Success",
        paymentMode: payment.method,
      },
      { new: true }
    );

    // Send payment confirmation notification with correct parameters
    try {
      await notificationController.sendPaymentConfirmation(
        appointment.requestByCustomer.mobileNumber, // mobileNumber
        appointmentId, // appointmentId
        payment.amount / 100 // amount in rupees
      );
    } catch (notificationError) {
      console.error("Error sending payment notification:", notificationError);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        transactionId: transaction.transactionID,
        appointmentId: appointmentId,
        paymentId: razorpay_payment_id,
        amount: payment.amount / 100,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const transaction = await Transaction.findOne({
      appointmentID: appointmentId,
    }).sort({ timestamp: -1 }); // Get the latest transaction

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "No transaction found for this appointment",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        transactionId: transaction.transactionID,
        status: transaction.status,
        amount: transaction.totalAmountReceived,
        paymentMode: transaction.paymentMode,
        timestamp: transaction.timestamp,
      },
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: error.message,
    });
  }
};

// Handle Refund
exports.initiateRefund = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body;

    const transaction = await Transaction.findOne({
      appointmentID: appointmentId,
      status: "Success",
    }).populate({
      path: "appointmentID",
      populate: { path: "requestByCustomer" },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "No successful transaction found for this appointment",
      });
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(transaction.transactionID, {
      notes: {
        reason: reason,
        appointmentId: appointmentId,
      },
    });

    // Create new transaction record for refund
    const refundTransaction = new Transaction({
      transactionID: refund.id,
      appointmentID: appointmentId,
      customerID: transaction.customerID,
      attendantID: transaction.attendantID,
      totalAmountReceived: -(refund.amount / 100),
      amountReceivedByAttendant: -((refund.amount / 100) * 0.8),
      status: "Refunded",
      paymentMode: "Refund",
    });

    await refundTransaction.save();

    // Send refund notification
    try {
      await notificationController.sendRefundNotification(
        transaction.appointmentID.requestByCustomer,
        transaction.appointmentID,
        refund.amount / 100
      );
    } catch (notificationError) {
      console.error("Error sending refund notification:", notificationError);
    }

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error("Error initiating refund:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate refund",
      error: error.message,
    });
  }
};

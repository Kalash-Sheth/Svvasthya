const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionID: {
    type: String,
    required: true,
    unique: true,
  },
  appointmentID: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Appointment model
    required: true,
    ref: 'Appointment',
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Patient model
    required: true,
    ref: 'Customer',
  },
  attendantID: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Attendant model
    ref: 'Attendant',
    required: false,
  },
  totalAmountReceived: {
    type: Number, // Total amount paid by the patient
    required: true,
    min: 0,
  },
  amountReceivedByAttendant: {
    type: Number, // Amount credited to the attendant after platform deductions
    required: false,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded'], // Status of the transaction
    required: true,
  },
  paymentMode: {
    type: String, // E.g., "Card", "UPI", "NetBanking", "Wallet"
    required: true,
  },
  timestamp: {
    type: Date, // Date and time of the transaction
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);

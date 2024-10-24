const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "backend/config/config.env" });

const CustomerSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
    },
    dob: {
        type: Date
    },
    passwordHash: String,
    rating: {
        type: Number,
        default: 3
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    profilePicture: {
        type: String // URL or path to the profile picture
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ], // References the Appointment model
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,          // transaction ids
            default: [],
            ref: "Payment"             // foreign key
        }
    ],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    CurrentLocation: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 }
    },
    selectedCurrentService: { type: String },
    assignedCurrentAttendant: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Attendant model
        ref: 'Attendant'
    } // New field to track the currently assigned attendant

});

CustomerSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


module.exports = mongoose.model('Customer', CustomerSchema);

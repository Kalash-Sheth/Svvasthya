const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating unique appointment IDs

const AppointmentSchema = new mongoose.Schema({
    appointmentID: {
        type: String,
        unique: true,
        default: uuidv4, // Generates a unique ID
    },
    mainService: {
        type: String,
        enum: ['Nursing', 'Caregiver', 'Baby Care'], // Main service options
        required: true
    },
    subService: {
        type: String,
        enum: [
            // Nursing subservices
            'ECG', 'Wound Care', 'IV Infusion', 'Catheterization', 'Injections',
            // Caregiver subservices
            'Elderly Care', 'Disabled Care', 'Post-surgery Care',
            // Babycare subservices
            'Newborn Care', 'Infant Feeding', 'Baby Massage'
        ], // Subservice options categorized by mainService
        required: true
    },
    duration: {
        type: Number, // Duration in hours
        required: true
    },
    startTime: {
        type: Date, // Starting time of the appointment
        required: true
    },
    endTime: {
        type: Date, // Ending time of the appointment
        required: true
    },
    address: {
        fullAddress: {
            type: String,
            required: true
        },
        houseNumber: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    assignedAttendant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendant',
        default: null // Initially null until an attendant is assigned
    },
    requestByCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'assigned', 'accepted', 'ongoing', 'finished', 'rejected', 'cancelled'],
        default: 'requested' // Default status
    }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;

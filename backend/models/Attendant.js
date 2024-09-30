const mongoose = require('mongoose');

const attendantSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
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
    availability: [
        {
            startTime: {
                type: Date,
                required: true
            },
            endTime: {
                type: Date,
                required: true
            },
            fullAddress: {
                type: String,
                required: true
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
            }
        }
    ],
    assignedAppointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    rating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Attendant = mongoose.model('Attendant', attendantSchema);

module.exports = Attendant;

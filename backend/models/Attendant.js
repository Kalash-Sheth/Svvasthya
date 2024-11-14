const mongoose = require('mongoose');

const attendantSchema = new mongoose.Schema({

    // Tracks the last completed onboarding step
    currentStep: { type: String, default: 'personalInfo' },

    // Personal Information Section
    personalInfo: {
        profilePhoto: { type: String },
        firstName: { type: String},
        middleName: { type: String },
        lastName: { type: String},
        dob: { type: Date},
        gender: { type: String, enum: ['Male', 'Female', 'Other']},
        email: { type: String, unique: true },
        permanentAddress: {
            houseNumberName: { type: String },
            street: { type: String},
            landmark: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String }
        }
    },

    // Document Information Section
    documentInfo: {
        aadhaarNumber: { type: String},
        aadhaarPhoto: { type: String},
        panNumber: { type: String},
        panPhoto: { type: String},
        drivingLicenseNumber: { type: String },
        drivingLicensePhoto: { type: String },
        passportPhoto: { type: String }
    },

    // Professional Information Section
    professionalInfo: {
        title: { type: String},
        specialization: { type: String},
        yearsOfExperience: { type: Number},
        previousEmployment: {
            employerName: { type: String},
            companyDuration: { type: String},
            referenceContact: { type: String }
        },
        skills: [{ type: String }],
        certifications: [{ type: String }],
        languagesKnown: [{ type: String }]
    },

    // Work Preferences Section
    workPreferences: {
        workType: { type: String, enum: ['Full Time', 'Part Time']},
        preferredDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
        shiftPreferences: [{ type: String, enum: ['Morning', 'Afternoon', 'Night'] }],
        locationPreferences: { type: String}
    },

    // Health Information Section
    healthInfo: {
        medicalConditions: { type: String },
        allergies: { type: String }
    },

    // Emergency Contact Section
    emergencyContact: {
        contactName: { type: String},
        relationship: { type: String},
        mobileNumber: { type: String},
        alternativeNumber: { type: String }
    },

    // Banking Information Section
    bankingInfo: {
        accountHolderName: { type: String},
        bankName: { type: String},
        accountNumber: { type: String},
        ifscCode: { type: String},
        upiId: { type: String },
        cancelledChequePhoto: { type: String }
    },

    // Agreements & Consent Section
    agreements: {
        termsAndConditions: { type: Boolean},
        privacyPolicy: { type: Boolean},
        backgroundCheckAuthorization: { type: Boolean}
    },

    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
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
    },
    availability: [
        {
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            location: {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true }
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
    },
    CurrentAvailability: { type: Boolean, default: false },
    CurrentLocation: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 }
    },
    realtimeAssignments: [
        {
            customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer',
                required: true
            },
            service: {
                type: String,
                required: true
            },
            assignedAt: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['pending', 'ongoing', 'completed'],
                default: 'pending'
            }
        }
    ]
});

const Attendant = mongoose.model('Attendant', attendantSchema);

module.exports = Attendant;

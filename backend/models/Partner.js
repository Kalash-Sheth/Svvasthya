const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "backend/config/config.env" });

const PartnerSchema = new mongoose.Schema({
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
    aadharNumber: {
        type: String,
        unique: true,
        default: 0
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
    categories: [
        {
            type: String,
            required: true
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
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
    education: {
        highestQualification: {
            degree: String,
            institute: String,
            yearOfCompletion: String
        }
    },
    certifications: [{
        certificationName: String,
        issuingOrganization: String,
        yearOfCertification: String
    }],
    experience: [{
        OrganizationName: String,
        role: String,
        duration: String,
        type: String, // Description of medical experience, e.g., "5+ years in elderly care"
    }],
    skills: {
        coreCompetencies: [String],
        specialSkills: [String], // Medical skills relevant to caregiving
        additionalTraining: String
    },
    languagesKnown: [String],
    backgroundCheck_status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: "Pending"
    },
    references: [{
        name: String,
        contactNumber: String,
        relationship: String
    }],
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
            type: mongoose.Schema.Types.ObjectId,         // appointment id
            default: [],
            ref: "Appointment"         // foreign key
        }
    ],
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
    }
});


PartnerSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


module.exports = mongoose.model('Partner', PartnerSchema);

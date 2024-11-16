// controllers/attendantController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Attendant = require('../models/Attendant');
const Appointment = require('../models/Appointment');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config({ path: "backend/config/config.env" });
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// function to send otp
exports.send_otp = async (req, res) => {
    const { mobileNumber } = req.body;
    console.log(mobileNumber);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    try {
        let attendant = await Attendant.findOne({ mobileNumber });
        if (!attendant) {
            attendant = new Attendant({
                mobileNumber
            });
        }
        console.log(attendant);
        attendant.otp = otp;
        attendant.otpExpires = otpExpires;

        await attendant.save();

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            to: mobileNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
};


exports.verify_otp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        let attendant = await Attendant.findOne({ mobileNumber });

        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Mobile number not found. Please register first.' });
        }

        // Verify OTP and expiration
        if (attendant.otp !== otp || attendant.otpExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Clear OTP fields after successful verification
        attendant.otp = null;
        attendant.otpExpires = null;

        // Save changes to the attendant
        await attendant.save();

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: attendant._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'Login successful',
            user: attendant,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error verifying OTP and logging in', error });
    }
};

// Function to log in an attendant
exports.loginAttendant = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        // Check if attendant exists
        const attendant = await Attendant.findOne({ email });
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        // Check password
        // const isMatch = await bcrypt.compare(password, attendant.password);
        const isMatch = (password === attendant.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: attendant._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to update availability
exports.getAvailability = async (req, res) => {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Find the attendant by ID
        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        // Respond with the attendant's availability data
        res.status(200).json(attendant.availability);

    } catch (err) {
        console.error("Error fetching availability: ", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// Function to update availability slots
exports.updateAvailability = async (req, res) => {
    const { startTime, endTime, location } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Fetch the attendant's record
        let attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        attendant.availability.push({
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            location: location, // Store the attendant's current location (optional)
        });

        // Save the updated attendant data
        await attendant.save();

        return res.status(200).json({ message: 'Availability updated successfully', availability: attendant.availability });
    } catch (error) {
        console.error('Error updating availability:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get accepted appointments for the logged-in attendant
exports.getAcceptedAppointments = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Fetch the attendant's record
        let attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        // Find all appointments where the attendant is assigned and the status is 'accepted'
        const acceptedAppointments = await Appointment.find({
            assignedAttendant: attendantId, // Adjust based on your Appointment model
            status: 'accepted'
        });

        // Return the accepted appointments
        res.status(200).json({
            message: 'Accepted appointments fetched successfully',
            acceptedAppointments,
        });
    } catch (error) {
        console.error('Error fetching accepted appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Function to get assigned appointments for the logged-in attendant
exports.getAssignedAppointments = async (req, res) => {
    try {
        // Validate token and get attendantId
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded.id;

        // Fetch the attendant document by ID
        const attendant = await Attendant.findById(attendantId).populate(
          "assignedAppointments"
        );

        if (!attendant) {
          return res.status(404).json({ message: "Attendant not found" });
        }

        console.log("attendant: " + attendant.assignedAppointments);

        // Filter the assigned appointments into two arrays
        const upcomingAppointments = attendant.assignedAppointments.filter(
          (appointment) => appointment.status === "accepted"
        );

        const ongoingAppointments = attendant.assignedAppointments.filter(appointment =>
            appointment.status === 'ongoing'
        );

        // Respond with the filtered arrays
        res.status(200).json({
            upcomingAppointments,
            ongoingAppointments,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Handle accepting an appointment
exports.acceptAppointment = async (req, res) => {
    try {

        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = 'accepted';
        await appointment.save();

        res.status(200).json({ message: 'Appointment accepted successfully', appointment });
    } catch (error) {
        console.error('Error accepting appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Handle rejecting an appointment
exports.rejectAppointment = async (req, res) => {
    try {

        const { appointmentId } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = 'requested';
        await appointment.save();

        res.status(200).json({ message: 'Appointment rejected successfully', appointment });
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to get attendant profile based on the token
exports.getProfile = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Find attendant by ID
        const attendant = await Attendant.findById(attendantId);

        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        // Respond with the attendant's profile data
        res.json({
            firstName: attendant.firstName,
            lastName: attendant.lastName,
            mobileNumber: attendant.mobileNumber,
            email: attendant.email,
            address: attendant.address,
            availability: attendant.availability,
            rating: attendant.rating,
            role: attendant.role,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};




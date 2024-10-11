// realtimeController.js
const jwt = require('jsonwebtoken');
const Attendant = require('../models/Attendant');
const Appointment = require('../models/Appointment');
const { v4: uuidv4 } = require('uuid');


// Update availability and location for the attendant
exports.updateAvailability = async (req, res) => {
    const { currentAvailability, currentLocation } = req.body;

    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Update the attendant's availability and location in the database
        const updatedAttendant = await Attendant.findByIdAndUpdate(
            attendantId,
            {
                CurrentAvailability: currentAvailability,
                CurrentLocation: currentLocation,
            },
            { new: true } // Return the updated document
        );

        if (!updatedAttendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        res.status(200).json({ success: true, message: 'Availability updated successfully', attendant: updatedAttendant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update availability', error: error.message });
    }
};

// Update only the location for the attendant
exports.updateLocation = async (req, res) => {
    const { currentLocation } = req.body;

    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // e.g., 'Bearer <token>'

        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded._id; // Assuming _id is part of the token payload

        // Update the attendant's current location in the database
        const updatedAttendant = await Attendant.findByIdAndUpdate(
            attendantId,
            { CurrentLocation: currentLocation },
            { new: true } // Return the updated document
        );

        if (!updatedAttendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        res.status(200).json({ success: true, message: 'Location updated successfully', attendant: updatedAttendant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update location', error: error.message });
    }
};

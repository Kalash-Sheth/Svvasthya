// realtimeController.js
const jwt = require('jsonwebtoken');
const Attendant = require('../models/Attendant');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: './config/config.env' });
const axios = require('axios');


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
        const attendantId = decoded._id;

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

// Controller function
exports.searchAttendants = async (req, res) => {
    const { location, selectedService } = req.body;
    console.log(location, selectedService);
    const requestId = uuidv4(); // Generate a unique request ID

    try {

        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decoded.id;

        // Step 1: Store customer's location and selected service in the database
        const [latitude, longitude] = location.split(',').map(coord => parseFloat(coord.trim())); // Ensure latitude and longitude are parsed
        const customer = await Customer.findByIdAndUpdate(customerId, {
            CurrentLocation: { latitude, longitude }, // Update the CurrentLocation field
            selectedCurrentService: selectedService // Update the selectedCurrentService field
        }, { new: true });

        // Step 2: Fetch attendants who provide the selected service
        const attendants = await Attendant.find({
            role: selectedService,
            CurrentAvailability: true // Only fetch available attendants
        });

        if (!attendants || attendants.length === 0) {
            return res.status(404).json({ message: 'No attendants found for the selected service' });
        }

        // Step 3: Prepare origins (attendants' locations) and destination (customer location)
        const origins = attendants
            .map(attendant => `${attendant.CurrentLocation.latitude},${attendant.CurrentLocation.longitude}`)
            .join('|'); // Join locations with '|'

        const destination = `${customer.CurrentLocation.latitude},${customer.CurrentLocation.longitude}`; // Customer's lat/long


        console.log(origins, destination);
        // Step 4: Call OLA Maps Distance Matrix API
        const distanceMatrixResponse = await axios.get(`https://api.olamaps.io/routing/v1/distanceMatrix`, {
            params: {
                origins, // Customer's location
                destinations: destination, // Attendants' locations
                api_key: process.env.OLA_MAPS_API_KEY // Store the API key in env variables
            },
            headers: {
                'X-Request-Id': requestId
            }
        });


        // Step 5: Check if distances exist in the response
        if (!distanceMatrixResponse.data || !distanceMatrixResponse.data.rows || !distanceMatrixResponse.data.rows[0].elements) {
            return res.status(500).json({ message: 'Error fetching distance matrix', error: 'No distances found in the response' });
        }

        console.log('Distance Matrix Response:', distanceMatrixResponse.data);

        // Step 6: Process the distances and find the nearest attendant
        const distances = distanceMatrixResponse.data.rows[0].elements;
        // Extract only the distances that have a status of 'OK'
        const validDistances = distances
            .filter(element => element.status === "OK") // Filter for elements with OK status
            .map(element => element.distance); // Extract only distance values

        console.log('Valid Distances:', validDistances);

        let nearestAttendant = null;
        let shortestDistance = Infinity;

        // Find the nearest attendant based on the valid distances
        validDistances.forEach((distance, index) => {
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestAttendant = attendants[index]; // Find the corresponding attendant
            }
        });

        console.log(nearestAttendant);
        if (!nearestAttendant) {
            return res.status(404).json({ message: 'No attendant found within a reasonable distance' });
        }

        // Step 7: Assign the nearest attendant to the customer
        nearestAttendant.realtimeAssignments.push({ // Add to realtimeAssignments
            customerId: customerId,
            service: selectedService,
            assignedAt: new Date(),
            status: 'ongoing' // Set initial status
        });
        customer.assignedCurrentAttendant = nearestAttendant._id; // Assign the nearest attendant to the customer
        await Promise.all([nearestAttendant.save(), customer.save()]); // Save the updates in the database

        // Return assigned attendant details
        return res.status(200).json({ message: 'Attendant assigned successfully', attendant: nearestAttendant });
    } catch (error) {
        console.error("Error in searching attendants:", error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
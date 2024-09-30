// controllers/adminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Appointment = require('../models/Appointment');
const Attendant = require('../models/Attendant');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: './config/config.env' });
const axios = require('axios');


// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const validPassword = await bcrypt.compare(password, admin.password);
        // const isvalidPassword = (password === attendant.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ _id: admin._id, role: admin.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find(); // Adjust query if needed
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Fetch available attendants for a given time slot and sort by proximity
exports.fetchAvailableAttendants = async (req, res) => {
    const { startTime, endTime, role, appointmentLocation } = req.body;

    try {
        // Step 1: Filter attendants by role-subService
        const roleBasedAttendants = await Attendant.find({
            role: role // Only fetch attendants that offer the requested subService
        });

        console.log(roleBasedAttendants);

        // Convert incoming startTime and endTime to Date objects
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        // Step 2: Filter attendants based on availability and store their matching time slots
        const availableAttendants = roleBasedAttendants
            .map(attendant => {
                // Filter the availability slots that overlap with the requested time slot
                const matchingSlots = attendant.availability.filter(slot => {
                    const slotStartTime = new Date(slot.startTime);
                    const slotEndTime = new Date(slot.endTime);
                    return slotStartTime <= endDate && slotEndTime >= startDate;
                });

                // If there are matching time slots, return both the attendant and the relevant slots
                if (matchingSlots.length > 0) {
                    return {
                        attendant,
                        matchingSlots // Return only the matching slots for distance calculation
                    };
                }
                return null; // Return null for attendants with no matching time slots
            })
            .filter(item => item !== null); // Remove null entries

        console.log(availableAttendants);

        // Step 3: If there are no available attendants, return early
        if (availableAttendants.length === 0) {
            return res.status(404).json({ message: 'No attendants available for the selected subService and time slot' });
        }

        // Step 4: Get origins (attendants' locations) from their matching time slots and destination (appointment location) for distance matrix API
        const origins = availableAttendants
            .map(item => `${item.matchingSlots[0].location.latitude},${item.matchingSlots[0].location.longitude}`) // Use location of the first matching time slot
            .join('|');
        const destination = `${appointmentLocation.latitude},${appointmentLocation.longitude}`;

        const requestId = uuidv4();

        // Step 5: Call OLA Maps distance matrix API
        const distanceMatrixResponse = await axios.get(`https://api.olamaps.io/routing/v1/distanceMatrix`, {
            params: {
                origins: origins,
                destinations: destination,
                api_key: process.env.OLA_MAPS_API_KEY
            },
            headers: {
                'X-Request-Id': requestId
            }
        });

        // Check if distances exist in the response
        if (!distanceMatrixResponse.data || !distanceMatrixResponse.data.rows || !distanceMatrixResponse.data.rows[0].elements) {
            return res.status(500).json({ message: 'Error fetching distance matrix', error: 'No distances found in the response' });
        }

        // Step 6: Extract all elements from rows
        const elements = distanceMatrixResponse.data.rows.flatMap(row => row.elements);

        // Step 7: Map the distances to the attendants and sort them by distance (ascending order)
        const sortedAttendants = availableAttendants
            .map((item, index) => {
                const distanceValue = elements[index].distance; // Get the distance value
                return {
                    attendant: item.attendant,
                    distance: distanceValue // Use distance from the distance matrix response
                };
            })
            .sort((a, b) => a.distance - b.distance); // Sort by distance (closer attendants first)

        // Step 8: Return sorted attendants
        res.json({
            availableAttendants: sortedAttendants.map(item => ({
                attendant: item.attendant,
                distance: item.distance
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Assign an attendant to an appointment and update availability
exports.assignAttendant = async (req, res) => {
    const { appointmentId, attendantId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        const attendant = await Attendant.findById(attendantId);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (!attendant) return res.status(404).json({ message: 'Attendant not found' });

        const appointmentStart = new Date(appointment.startTime);
        const appointmentEnd = new Date(appointment.endTime);

        // Step 1: Update the appointment details
        appointment.assignedAttendant = attendant._id;
        appointment.status = "assigned";

        // Step 2: Add the appointment to the attendant's assignedAppointments array if not already there
        if (!attendant.assignedAppointments.includes(appointment._id)) {
            attendant.assignedAppointments.push(appointment._id);
        }

        // Step 3: Adjust the attendant's availability, recursively splitting the slots as needed
        let updatedAvailability = [];

        attendant.availability.forEach(slot => {
            const slotStart = new Date(slot.startTime);
            const slotEnd = new Date(slot.endTime);

            // Case 1: Appointment overlaps the entire slot, remove it
            if (appointmentStart <= slotStart && appointmentEnd >= slotEnd) {
                // The entire slot is covered by the appointment, so skip it (no need to push it to updatedAvailability)
            }
            // Case 2: Appointment overlaps at the start of the slot
            else if (appointmentStart <= slotStart && appointmentEnd < slotEnd) {
                updatedAvailability.push({
                    startTime: appointmentEnd,  // Adjust slot to start after appointment
                    endTime: slotEnd,
                    fullAddress: slot.fullAddress,
                    location: slot.location
                });
            }
            // Case 3: Appointment overlaps at the end of the slot
            else if (appointmentStart > slotStart && appointmentEnd >= slotEnd) {
                updatedAvailability.push({
                    startTime: slotStart,
                    endTime: appointmentStart,  // Adjust slot to end before appointment
                    fullAddress: slot.fullAddress,
                    location: slot.location
                });
            }
            // Case 4: Appointment is in the middle of the slot, split into two
            else if (appointmentStart > slotStart && appointmentEnd < slotEnd) {
                updatedAvailability.push({
                    startTime: slotStart,
                    endTime: appointmentStart,  // First part of the split
                    fullAddress: slot.fullAddress,
                    location: slot.location
                });
                updatedAvailability.push({
                    startTime: appointmentEnd,
                    endTime: slotEnd,  // Second part of the split
                    fullAddress: slot.fullAddress,
                    location: slot.location
                });
            }
            // Case 5: No overlap, retain the original slot
            else {
                updatedAvailability.push(slot);
            }
        });

        // Step 4: Recursively split the availability slots in case of overlapping slots
        const recursivelySplitAvailability = (slots, newStart, newEnd) => {
            const finalAvailability = [];

            slots.forEach(slot => {
                const slotStart = new Date(slot.startTime);
                const slotEnd = new Date(slot.endTime);

                // Split the slot recursively if necessary
                if (newStart <= slotEnd && newEnd >= slotStart) {
                    if (newStart > slotStart) {
                        finalAvailability.push({
                            startTime: slotStart,
                            endTime: newStart,  // Adjust to end before new appointment
                            fullAddress: slot.fullAddress,
                            location: slot.location
                        });
                    }
                    if (newEnd < slotEnd) {
                        finalAvailability.push({
                            startTime: newEnd,
                            endTime: slotEnd,  // Adjust to start after new appointment
                            fullAddress: slot.fullAddress,
                            location: slot.location
                        });
                    }
                } else {
                    finalAvailability.push(slot);  // Retain slot if no conflict
                }
            });

            return finalAvailability;
        };

        updatedAvailability = recursivelySplitAvailability(updatedAvailability, appointmentStart, appointmentEnd);

        // Step 5: Update the attendant's availability with the new set of available slots
        attendant.availability = updatedAvailability;

        // Step 6: Save both the appointment and the attendant
        await appointment.save();
        await attendant.save();

        res.json({ message: 'Attendant assigned and availability updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


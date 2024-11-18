// controllers/adminController.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Appointment = require("../models/Appointment");
const Attendant = require("../models/Attendant");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "./config/config.env" });
const axios = require("axios");
const Customer = require("../models/Customer");

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const validPassword = password === admin.password;
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Adjust query if needed
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch available attendants for a given time slot and sort by proximity
exports.fetchAvailableAttendants = async (req, res) => {
  const { startTime, endTime, role, appointmentLocation } = req.body;

  try {
    // Validate incoming data
    if (!startTime || !endTime || !role || !appointmentLocation) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 1: Filter attendants by role-subService
    const roleBasedAttendants = await Attendant.find({ role });
    console.log(roleBasedAttendants);

    // Convert incoming startTime and endTime to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Step 2: Filter attendants based on availability
    const availableAttendants = roleBasedAttendants
      .map((attendant) => {
        // Find a matching availability slot
        const matchingSlot = attendant.availability.find((slot) => {
          const slotStartTime = new Date(slot.startTime);
          const slotEndTime = new Date(slot.endTime);
          return slotStartTime <= startDate && slotEndTime >= endDate; // Superset condition
        });

        return matchingSlot ? { attendant, matchingSlot } : null;
      })
      .filter((item) => item !== null); // Remove null entries

    console.log(availableAttendants);

    // Step 3: If there are no available attendants, return early
    if (availableAttendants.length === 0) {
      return res.status(404).json({
        message:
          "No attendants available for the selected subService and time slot",
      });
    }

    // Step 4: Get origins (attendants' locations) from their matching time slots
    const origins = availableAttendants
      .map(
        (item) =>
          `${item.matchingSlot.location.latitude},${item.matchingSlot.location.longitude}`
      )
      .join("|");
    const destination = `${appointmentLocation.latitude},${appointmentLocation.longitude}`;

    const requestId = uuidv4();

    // Step 5: Call OLA Maps distance matrix API
    const distanceMatrixResponse = await axios.get(
      `https://api.olamaps.io/routing/v1/distanceMatrix`,
      {
        params: {
          origins,
          destinations: destination,
          api_key: process.env.OLA_MAPS_API_KEY,
        },
        headers: {
          "X-Request-Id": requestId,
        },
      }
    );

    // Check if distances exist in the response
    if (
      !distanceMatrixResponse.data ||
      !distanceMatrixResponse.data.rows ||
      !distanceMatrixResponse.data.rows[0].elements
    ) {
      return res.status(500).json({
        message: "Error fetching distance matrix",
        error: "No distances found in the response",
      });
    }

    // Step 6: Extract all elements from rows
    const elements = distanceMatrixResponse.data.rows.flatMap(
      (row) => row.elements
    );

    // Step 7: Map the distances to the attendants and sort them by distance
    const sortedAttendants = availableAttendants
      .map((item, index) => {
        const distanceValue = elements[index].distance.value; // Get the distance value
        return {
          attendant: item.attendant,
          distance: distanceValue, // Use distance from the distance matrix response
        };
      })
      .sort((a, b) => a.distance - b.distance); // Sort by distance (closer attendants first)

    // Step 8: Return sorted attendants
    res.json({
      availableAttendants: sortedAttendants.map((item) => ({
        attendant: item.attendant,
        distance: item.distance,
      })),
    });
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Assign an attendant to an appointment and update availability
exports.assignAttendant = async (req, res) => {
  const { attendantId } = req.body;
  const appointmentId = req.params.appointmentId;

  try {
    const appointment = await Appointment.findById(appointmentId);
    const attendant = await Attendant.findById(attendantId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    if (!attendant)
      return res.status(404).json({ message: "Attendant not found" });

    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);

    // Step 1: Update the appointment details
    appointment.assignedAttendant = attendant._id;
    appointment.status = "assigned";

    // Step 2: Add the appointment to the attendant's assignedAppointments array
    if (!attendant.assignedAppointments.includes(appointment._id)) {
      attendant.assignedAppointments.push(appointment._id);
    }

    // Step 3: Update the attendant's availability by splitting or removing overlapping slots
    const updatedAvailability = [];
    for (const slot of attendant.availability) {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);

      // Case 1: Appointment overlaps the entire slot, remove it
      if (appointmentStart <= slotStart && appointmentEnd >= slotEnd) {
        continue; // Skip this slot
      }

      // Case 2: Appointment overlaps at the start of the slot
      if (appointmentStart == slotStart && appointmentEnd < slotEnd) {
        updatedAvailability.push({
          startTime: appointmentEnd.toISOString(), // Adjust slot to start after the appointment
          endTime: slotEnd.toISOString(),
          location: slot.location,
        });
      }
      // Case 3: Appointment overlaps at the end of the slot
      else if (appointmentStart > slotStart && appointmentEnd == slotEnd) {
        updatedAvailability.push({
          startTime: slotStart.toISOString(),
          endTime: appointmentStart.toISOString(), // Adjust slot to end before the appointment
          location: slot.location,
        });
      }
      // Case 4: Appointment is in the middle of the slot, split into two
      else if (appointmentStart > slotStart && appointmentEnd < slotEnd) {
        updatedAvailability.push({
          startTime: slotStart.toISOString(),
          endTime: appointmentStart.toISOString(), // First part of the split
          location: slot.location,
        });
        updatedAvailability.push({
          startTime: appointmentEnd.toISOString(),
          endTime: slotEnd.toISOString(), // Second part of the split
          location: slot.location,
        });
      }
      // Case 5: No overlap, retain the original slot
      else {
        updatedAvailability.push(slot);
      }
    }

    // Step 4: Update the attendant's availability with the new set of available slots
    attendant.availability = updatedAvailability;

    // Step 5: Save both the appointment and the attendant
    await appointment.save();
    await attendant.save();

    res.json({
      message: "Attendant assigned and availability updated successfully",
    });
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add this new function to adminController.js
exports.getOngoingAppointments = async (req, res) => {
  try {
    const ongoingAppointments = await Appointment.find({ status: "ongoing" })
      .populate("requestByCustomer")
      .populate("assignedAttendant");

    res.json(ongoingAppointments);
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Add this new function to get finished appointments
exports.getFinishedAppointments = async (req, res) => {
  try {
    const finishedAppointments = await Appointment.find({ status: "finished" })
      .populate("requestByCustomer")
      .populate("assignedAttendant");

    res.json(finishedAppointments);
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Add this new function to get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    console.log("Fetching all customers..."); // Debug log

    // Check if Customer model is properly imported
    if (!Customer) {
      throw new Error("Customer model not found");
    }

    // Remove the populate and just fetch basic customer data
    const customers = await Customer.find().select("-password").lean().exec();

    console.log(`Found ${customers.length} customers`); // Debug log
    res.json(customers);
  } catch (error) {
    console.error("Error in getAllCustomers:", error); // Debug log
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// Add this new function to get all attendants
exports.getAllAttendants = async (req, res) => {
  try {
    console.log("Fetching all attendants..."); // Debug log

    // Check if Attendant model is properly imported
    if (!Attendant) {
      throw new Error("Attendant model not found");
    }

    // Remove the populate and just fetch basic attendant data
    const attendants = await Attendant.find().select("-password").lean().exec();

    console.log(`Found ${attendants.length} attendants`); // Debug log
    res.json(attendants);
  } catch (error) {
    console.error("Error in getAllAttendants:", error); // Debug log
    res.status(500).json({
      message: "Failed to fetch attendants",
      error: error.message,
    });
  }
};

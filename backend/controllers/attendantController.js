// controllers/attendantController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Attendant = require("../models/Attendant");
const Appointment = require("../models/Appointment");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "backend/config/config.env" });
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, token);

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
        mobileNumber,
      });
    }
    console.log(attendant);
    attendant.otp = otp;
    attendant.otpExpires = otpExpires;

    await attendant.save();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: mobileNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

exports.verify_otp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    let attendant = await Attendant.findOne({ mobileNumber });

    if (!attendant) {
      return res.status(404).json({
        success: false,
        message: "Mobile number not found. Please register first.",
      });
    }

    // Verify OTP and expiration
    if (attendant.otp !== otp || attendant.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP fields after successful verification
    attendant.otp = null;
    attendant.otpExpires = null;

    // Save changes to the attendant
    await attendant.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: attendant._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successful",
      user: attendant,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP and logging in",
      error,
    });
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
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Check password
    // const isMatch = await bcrypt.compare(password, attendant.password);
    const isMatch = password === attendant.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: attendant._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to update availability
exports.getAvailability = async (req, res) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // e.g., 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id; // Assuming _id is part of the token payload

    const now = new Date();
    
    // Remove past availabilities and get updated document
    const attendant = await Attendant.findByIdAndUpdate(
      attendantId,
      { 
        $pull: { 
          availability: { 
            endTime: { $lt: now } 
          } 
        } 
      },
      { new: true }
    );

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
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
  const token = req.headers.authorization?.split(" ")[1]; // e.g., 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id; // Assuming _id is part of the token payload

    // Fetch the attendant's record
    let attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    attendant.availability.push({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location: location, // Store the attendant's current location (optional)
    });

    // Save the updated attendant data
    await attendant.save();

    return res.status(200).json({
      message: "Availability updated successfully",
      availability: attendant.availability,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get accepted appointments for the logged-in attendant
exports.getAcceptedAppointments = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // e.g., 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded._id; // Assuming _id is part of the token payload

    // Fetch the attendant's record
    let attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Find all appointments where the attendant is assigned and the status is 'accepted'
    const acceptedAppointments = await Appointment.find({
      assignedAttendant: attendantId, // Adjust based on your Appointment model
      status: "accepted",
    });

    // Return the accepted appointments
    res.status(200).json({
      message: "Accepted appointments fetched successfully",
      acceptedAppointments,
    });
  } catch (error) {
    console.error("Error fetching accepted appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get assigned appointments for the logged-in attendant
exports.getAssignedAppointments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    // Fetch the attendant document by ID and populate assignedAppointments
    const attendant = await Attendant.findById(attendantId).populate(
      "assignedAppointments"
    );

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Filter appointments that are in 'assigned' status
    const assignedAppointments = attendant.assignedAppointments.filter(
      (appointment) => appointment.status === "assigned"
    );

    res.status(200).json({
      success: true,
      assignedAppointments,
    });
  } catch (error) {
    console.error("Error fetching assigned appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Handle accepting an appointment
exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status and assign attendant
    appointment.status = "accepted";
    appointment.assignedAttendant = attendantId;
    await appointment.save();

    // Add appointment to attendant's assigned appointments
    await Attendant.findByIdAndUpdate(attendantId, {
      $push: { assignedAppointments: appointmentId },
    });

    res.status(200).json({
      success: true,
      message: "Appointment accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle rejecting an appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Keep the appointment in requested status but remove this attendant
    appointment.assignedAttendant = null;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get upcoming and ongoing appointments
exports.getActiveAppointments = async (req, res) => {
  try {
    // Validate token and get attendantId
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
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

    // console.log("attendant: " + attendant.assignedAppointments);

    // Filter the assigned appointments into two arrays
    const upcomingAppointments = attendant.assignedAppointments.filter(
      (appointment) => appointment.status === "accepted"
    );

    const ongoingAppointments = attendant.assignedAppointments.filter(
      (appointment) => appointment.status === "ongoing"
    );

    // Respond with the filtered arrays
    res.status(200).json({
      upcomingAppointments,
      ongoingAppointments,
    });
  } catch (error) {
    console.error("Error fetching active appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Controller to get attendant profile based on the token
exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId).populate(
      "assignedAppointments"
    );

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Calculate total missions (completed appointments)
    const totalMissions =
      attendant.assignedAppointments?.filter((app) => app.status === "finished")
        .length || 0;

    // Calculate total earnings (assuming each appointment has a fixed rate of 500)
    const totalEarnings = totalMissions * 500;

    // Default skills data
    const defaultSkills = [
      "Patient Care",
      "Wound Dressing",
      "Vital Monitoring",
      "Emergency Response",
      "Medical Documentation",
      "Medication Administration",
      "Basic Life Support",
      "First Aid",
    ];

    // Default languages data
    const defaultLanguages = ["English", "Hindi", "Gujarati", "Marathi"];

    // Default work preferences
    const defaultWorkPreferences = {
      workType: "Full Time",
      preferredDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      shiftPreferences: ["Morning", "Afternoon", "Night"],
    };

    // Add dummy documents data
    const dummyDocuments = [
      {
        type: "ID Proof",
        items: [
          {
            name: "Aadhaar Card",
            url: "uploads/documents/aadhaar-1731665390585-494153894.png",
            uploadDate: "2024-03-01",
          },
          {
            name: "PAN Card",
            url: "uploads/certificates/certificate-1731667482147-18886423.pdf",
            uploadDate: "2024-03-01",
          },
          {
            name: "Driving License",
            url: "uploads/certificates/certificate-1731667482147-18886423.pdf",
            uploadDate: "2024-03-01",
          },
        ],
      },
      {
        type: "Professional",
        items: [
          {
            name: "Nursing Certificate",
            url: "uploads/certificates/certificate-1731667482147-18886423.pdf",
            uploadDate: "2024-03-01",
          },
          {
            name: "BLS Certification",
            url: "uploads/documents/aadhaar-1731665390585-494153894.png",
            uploadDate: "2024-03-01",
          },
        ],
      },
      {
        type: "Banking",
        items: [
          {
            name: "Cancelled Cheque",
            url: "uploads/banking/cancelledCheque-1731669138563-995145045.pdf",
            uploadDate: "2024-03-01",
          },
        ],
      },
    ];

    // Format the response data with dummy data for missing fields
    const profileData = {
      // Personal Info
      profilePhoto:
        attendant.profilePhoto ||
        "uploads/profile/profile-1731665207496-785299262.jpg",
      firstName: attendant.firstName || "John",
      lastName: attendant.lastName || "Doe",
      email: attendant.email || "john.doe@example.com",
      mobileNumber: attendant.mobileNumber || "+91 9909716609",
      address: attendant.address || "123 Main Street, City",

      // Professional Info
      role: attendant.role || "Wound Care",
      specialization:
        attendant.professionalInfo?.specialization || "Senior Nurse",
      yearsOfExperience: attendant.professionalInfo?.yearsOfExperience || 5,

      // Skills Info (use actual data or default)
      skills:
        attendant.skillsInfo?.skills?.length > 0
          ? attendant.skillsInfo.skills
          : defaultSkills,
      certifications: attendant.skillsInfo?.certifications || [],
      languagesKnown:
        attendant.skillsInfo?.languagesKnown?.length > 0
          ? attendant.skillsInfo.languagesKnown
          : defaultLanguages,

      // Stats
      totalMissions: totalMissions || 45,
      totalEarnings: totalEarnings || 22500,
      rating: attendant.rating || 4.5,
      level: calculateLevel(totalMissions) || "Silver",

      // Dates
      createdAt: attendant.createdAt || "2024-01-01T00:00:00.000Z",

      // Current Status
      currentAvailability: attendant.CurrentAvailability || false,
      currentLocation: attendant.CurrentLocation || null,

      // Work Preferences (use actual data or default)
      workType:
        attendant.workPreferences?.workType || defaultWorkPreferences.workType,
      preferredDays:
        attendant.workPreferences?.preferredDays?.length > 0
          ? attendant.workPreferences.preferredDays
          : defaultWorkPreferences.preferredDays,
      shiftPreferences:
        attendant.workPreferences?.shiftPreferences?.length > 0
          ? attendant.workPreferences.shiftPreferences
          : defaultWorkPreferences.shiftPreferences,
      locationPreferences:
        attendant.workPreferences?.locationPreferences || "Within 10km radius",

      // Add documents data
      documents: dummyDocuments,

      // Quick Actions Data
      quickActions: {
        totalDocuments: dummyDocuments.reduce(
          (sum, category) => sum + category.items.length,
          0
        ),
        totalEarnings: totalEarnings || 22500,
        settingsUpdated: "2024-03-15",
      },
    };

    console.log("Profile Data:", profileData);

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Helper function to calculate level based on total missions
const calculateLevel = (missions) => {
  if (missions >= 100) return "Platinum";
  if (missions >= 50) return "Gold";
  if (missions >= 25) return "Silver";
  return "Bronze";
};

// Add this function to handle finishing appointments
exports.finishAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify this appointment belongs to the attendant
    if (appointment.assignedAttendant.toString() !== attendantId) {
      return res
        .status(403)
        .json({ message: "Not authorized to finish this appointment" });
    }

    // Update appointment status to finished
    appointment.status = "finished";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment marked as finished successfully",
    });
  } catch (error) {
    console.error("Error finishing appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

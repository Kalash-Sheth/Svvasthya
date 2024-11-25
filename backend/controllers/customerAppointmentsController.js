const Customer = require("../models/Customer");
const Appointment = require("../models/Appointment");
const Attendant = require("../models/Attendant");
const jwt = require("jsonwebtoken");

// Helper function to get user ID from token in cookie
const getUserIdFromCookie = (req) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("No token found in cookies");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.id) {
        throw new Error("No id in token payload");
      }

      return decoded.id;
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      throw new Error(`JWT verification failed: ${jwtError.message}`);
    }
  } catch (error) {
    console.error("getUserIdFromCookie error:", error);
    throw error;
  }
};

exports.getCustomerProfile = async (req, res) => {
  try {
    const userId = getUserIdFromCookie(req);

    if (!userId) {
      console.log("No user ID found");
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer profile",
      error: error.message,
    });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    const userId = getUserIdFromCookie(req);
    const {
      firstname,
      lastname,
      email,
      dob,
      address,
      city,
      state,
      profilePicture,
    } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,
        dob,
        address,
        city,
        state,
        profilePicture,
        updated_at: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

exports.getCustomerAppointments = async (req, res) => {
  try {
    const userId = getUserIdFromCookie(req);

    console.log("User ID:", userId);

    const appointments = await Appointment.find({ requestByCustomer: userId })
      .populate("assignedAttendant")
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

exports.getUpcomingAppointments = async (req, res) => {
  try {
    const userId = getUserIdFromCookie(req);
    const appointments = await Appointment.find({
      requestByCustomer: userId,
      status: "accepted",
    })
      .populate("assignedAttendant")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching upcoming appointments",
      error: error.message,
    });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const userId = getUserIdFromCookie(req);
    const appointments = await Appointment.find({
      requestByCustomer: userId,
      status: "finished",
    })
      .populate("assignedAttendant")
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking history",
      error: error.message,
    });
  }
};

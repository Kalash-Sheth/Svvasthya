// controllers/appointmentController.js
const Customer = require('../models/Customer');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const notificationController = require("./notificationController");

// Function to create an appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      mobileNumber,
      mainService,
      subService,
      duration,
      startTime,
      endTime,
      address,
      location,
    } = req.body;

    if (
      !mobileNumber ||
      !mainService ||
      !subService ||
      !duration ||
      !startTime ||
      !endTime ||
      !address ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let customer = await Customer.findOne({ mobileNumber });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const newAppointment = new Appointment({
      mainService,
      subService,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      address,
      location,
      requestByCustomer: customer,
    });

    const savedAppointment = await newAppointment.save();

    // Initialize appointments array if it's undefined
    if (!customer.appointments) {
      customer.appointments = [];
    }
    customer.appointments.push(savedAppointment._id);
    await customer.save();

    // Send booking notification
    try {
      await notificationController.sendBookingNotifications(
        customer,
        savedAppointment
      );
      console.log("Booking notification sent successfully");
    } catch (notificationError) {
      console.error("Error sending booking notification:", notificationError);
      // Don't return error here, as the appointment was still created successfully
    }

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get all appointments for a customer
exports.getAppointments = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId).populate('appointments');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer.appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

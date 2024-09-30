// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to create a new appointment
router.post('/appointments', appointmentController.createAppointment);

// Route to get all appointments for a customer
router.get('/appointments/:customerId', appointmentController.getAppointments);

module.exports = router;

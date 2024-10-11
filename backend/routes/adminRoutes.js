// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.login);

// Get all appointments (authenticated admin only)
router.get('/appointments', adminController.getAllAppointments);

// Fetch available attendants for a given time slot
router.post('/available', adminController.fetchAvailableAttendants);

// Assign an attendant to an appointment
router.post('/:appointmentId/assign', adminController.assignAttendant);

module.exports = router;

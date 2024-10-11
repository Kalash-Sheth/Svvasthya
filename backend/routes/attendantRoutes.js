// routes/attendantRoutes.js
const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const authMiddleware = require('../middlewares/authMiddleware');

// Login Attendant
router.post('/login', attendantController.loginAttendant);

// Get Availability
router.get('/fetchavailability', attendantController.getAvailability);

// Update Availability
router.post('/updateavailability', attendantController.updateAvailability);

//get accepted appointments appointments
router.get('/acceptedAppointments', attendantController.getAcceptedAppointments);

// get assigned appointments
router.get('/assignedAppointments', attendantController.getAssignedAppointments);

// Route to accept an appointment
router.post('/acceptAppointment', attendantController.acceptAppointment);

// Route to reject an appointment
router.post('/rejectAppointment', attendantController.rejectAppointment);

// Route to get profile
router.get('/profile', authMiddleware, attendantController.getProfile);

module.exports = router;

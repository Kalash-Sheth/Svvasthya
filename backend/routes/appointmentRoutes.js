// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Customer appointment routes
router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments/:customerId', appointmentController.getAppointments);

module.exports = router;

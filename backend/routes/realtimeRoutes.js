// routes.js

const express = require('express');
const router = express.Router();
const realtimeController = require('../controllers/realtimeController');

// Route to update availability
router.put('/updateAvailability', realtimeController.updateAvailability);

// Route to update location
router.put('/updateLocation', realtimeController.updateLocation);

module.exports = router;

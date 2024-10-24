// routes.js

const express = require('express');
const router = express.Router();
const realtimeController = require('../controllers/realtimeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to update availability
router.put('/updateAvailability', realtimeController.updateAvailability);

// Route to update location
router.put('/updateLocation', realtimeController.updateLocation);

// Route to search attendant on real time
router.post('/search', realtimeController.searchAttendants);

module.exports = router;

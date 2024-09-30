const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const authService = require('../services/authService');
const { getAvailableAttendants } = require('../controllers/operationalController');

// fetch available attendants
router.route("/get_available_attendants").get(getAvailableAttendants);

// set the attendant's status for a specific time

// routes/attendantRoutes.js
const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const onBoardingController = require('../controllers/onBoardingController');

// send otp
router.post('/send-otp', attendantController.send_otp);

// verify otp
router.post('/verify-otp', attendantController.verify_otp);

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
router.get('/profile', attendantController.getProfile);

// Onboarding routes 
router.post('/onboarding/personal-info', onBoardingController.savePersonalInfo);
router.post("/onboarding/document-info", onBoardingController.saveDocumentInfo);
router.post(
  "/onboarding/professional-info",
  onBoardingController.saveProfessionalInfo
);
router.post(
  "/onboarding/work-preferences",
  onBoardingController.saveWorkPreferences
);
router.post("/onboarding/health-info", onBoardingController.saveHealthInfo);
router.post("/onboarding/banking-info", onBoardingController.saveBankingInfo);
router.post("/onboarding/agreements", onBoardingController.saveAgreements);
router.post("/onboarding/skills", onBoardingController.saveSkills);

module.exports = router;

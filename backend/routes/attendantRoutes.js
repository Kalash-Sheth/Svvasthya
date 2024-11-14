// routes/attendantRoutes.js
const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const onBoardingController = require('../controllers/onBoardingController');
const authMiddleware = require('../middlewares/authMiddleware');

// send otp
router.post('/send-otp', attendantController.send_otp);

// verify otp
router.post('/verify-otp', attendantController.verify_otp);

// onboarding
router.post('/complete-onboarding', attendantController.completeOnboarding);

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
router.post('/onboarding/document-info/:attendantId', onBoardingController.saveDocumentInfo);
router.post('/onboarding/professional-info/:attendantId', onBoardingController.saveProfessionalInfo);
router.post('/onboarding/work-preferences/:attendantId', onBoardingController.saveWorkPreferences);
router.post('/onboarding/health-info/:attendantId', onBoardingController.saveHealthInfo);
router.post('/onboarding/banking-info/:attendantId', onBoardingController.saveBankingInfo);
router.post('/onboarding/agreements/:attendantId', onBoardingController.saveAgreements);

module.exports = router;

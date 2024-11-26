// routes/attendantRoutes.js
const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const onBoardingController = require('../controllers/onBoardingController');
const { single } = require("../middlewares/upload");
// Authentication routes
router.post('/send-otp', attendantController.send_otp);
router.post('/verify-otp', attendantController.verify_otp);
router.post('/login', attendantController.loginAttendant);
 
// Profile and availability routes
router.get('/profile', attendantController.getProfile);
router.get('/fetchavailability', attendantController.getAvailability);
router.post('/updateavailability', attendantController.updateAvailability);

//healthrecord update
router.post("/upload-healthrecord", single("healthRecord"), attendantController.uploadHealthRecord);

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

// Appointment routes
router.get('/appointments/assigned', attendantController.getAssignedAppointments);
router.get('/appointments/active', attendantController.getActiveAppointments);
router.post('/appointments/accept', attendantController.acceptAppointment);
router.post('/appointments/reject', attendantController.rejectAppointment);
router.post('/appointments/finish', attendantController.finishAppointment);

module.exports = router;

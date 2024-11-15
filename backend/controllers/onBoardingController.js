const Attendant = require('../models/Attendant');
const upload = require('../middlewares/upload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "backend/config/config.env" });
const fs = require('fs').promises;
// Personal Information Screen

exports.savePersonalInfo = async (req, res) => {
  const uploadMiddleware = upload.single('profilePhoto');

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      // Validate token and get attendantId
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No authorization token provided'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const attendantId = decoded.id;

      const attendant = await Attendant.findById(attendantId);
      if (!attendant) {
        // Clean up uploaded file if attendant not found
        if (req.file) {
          await fs.unlink(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: 'Attendant not found'
        });
      }

      // Parse permanent address from form data
      const permanentAddress = JSON.parse(req.body.permanentAddress);

      // Update attendant information
      attendant.personalInfo = {
        profilePhoto: req.file ? req.file.path : null,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        dob: new Date(req.body.dob),
        gender: req.body.gender,
        email: req.body.email,
        permanentAddress
      };

      attendant.currentStep = 'documentInfo';
      await attendant.save();

      res.status(200).json({
        success: true,
        message: 'Personal information saved successfully',
        currentStep: attendant.currentStep
      });
    } catch (error) {
      // Clean up uploaded file in case of error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      
      console.error('Error saving personal info:', error);
      res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message
      });
    }
  });
};

// Document Information Screen
exports.saveDocumentInfo = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            aadhaarNumber,
            aadhaarPhoto,
            panNumber,
            panPhoto,
            drivingLicenseNumber,
            drivingLicensePhoto,
            passportPhoto
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.documentInfo = {
            aadhaarNumber,
            aadhaarPhoto,
            panNumber,
            panPhoto,
            drivingLicenseNumber,
            drivingLicensePhoto,
            passportPhoto
        };
        attendant.currentStep = 'professionalInfo';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Document information saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving document info:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Professional Information Screen
exports.saveProfessionalInfo = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            title,
            specialization,
            yearsOfExperience,
            previousEmployment,
            skills,
            certifications,
            languagesKnown
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.professionalInfo = {
            title,
            specialization,
            yearsOfExperience,
            previousEmployment,
            skills,
            certifications,
            languagesKnown
        };
        attendant.currentStep = 'workPreferences';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Professional information saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving professional info:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Work Preferences Screen
exports.saveWorkPreferences = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            workType,
            preferredDays,
            shiftPreferences,
            locationPreferences
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.workPreferences = {
            workType,
            preferredDays,
            shiftPreferences,
            locationPreferences
        };
        attendant.currentStep = 'healthInfo';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Work preferences saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving work preferences:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Health Information Screen
exports.saveHealthInfo = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            medicalConditions,
            allergies,
            emergencyContact
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.healthInfo = { medicalConditions, allergies };
        attendant.emergencyContact = emergencyContact;
        attendant.currentStep = 'bankingInfo';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Health information saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving health info:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Banking Information Screen
exports.saveBankingInfo = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
            upiId,
            cancelledChequePhoto
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.bankingInfo = {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
            upiId,
            cancelledChequePhoto
        };
        attendant.currentStep = 'agreements';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Banking information saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving banking info:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Agreements Screen
exports.saveAgreements = async (req, res) => {
    try {
        const { attendantId } = req.params;
        const {
            termsAndConditions,
            privacyPolicy,
            backgroundCheckAuthorization
        } = req.body;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        attendant.agreements = {
            termsAndConditions,
            privacyPolicy,
            backgroundCheckAuthorization
        };
        attendant.currentStep = 'completed';

        await attendant.save();

        res.status(200).json({
            success: true,
            message: 'Agreements saved successfully',
            currentStep: attendant.currentStep
        });
    } catch (error) {
        console.error('Error saving agreements:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

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
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res
        .status(404)
        .json({ success: false, message: "Attendant not found" });
    }

    // Create multer upload instance for multiple files
    const uploadFields = [
      { name: "aadhaarPhoto", maxCount: 1 },
      { name: "panPhoto", maxCount: 1 },
      { name: "drivingLicensePhoto", maxCount: 1 },
      { name: "passportPhoto", maxCount: 1 },
    ];

    const uploadMiddleware = upload.fields(uploadFields);

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          success: false,
          message: "File upload error: " + err.message,
        });
      }

      try {
        // Log received files for debugging
        console.log("Received files:", req.files);
        console.log("Received body:", req.body);

        // Update document information
        attendant.documentInfo = {
          aadhaarNumber: req.body.aadhaarNumber,
          aadhaarPhoto: req.files?.aadhaarPhoto?.[0]?.path,
          panNumber: req.body.panNumber,
          panPhoto: req.files?.panPhoto?.[0]?.path,
          drivingLicenseNumber: req.body.drivingLicenseNumber,
          drivingLicensePhoto: req.files?.drivingLicensePhoto?.[0]?.path,
          passportPhoto: req.files?.passportPhoto?.[0]?.path,
        };

        attendant.currentStep = "professionalInfo";
        await attendant.save();

        res.status(200).json({
          success: true,
          message: "Document information saved successfully",
          currentStep: attendant.currentStep,
        });
      } catch (error) {
        // Clean up uploaded files if there's an error
        if (req.files) {
          Object.values(req.files).forEach((files) => {
            files.forEach((file) => {
              fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
              });
            });
          });
        }
        console.error("Error saving document info:", error);
        res.status(500).json({
          success: false,
          message: "Server error: " + error.message,
        });
      }
    });
  } catch (error) {
    console.error("Error in document info controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Professional Information Screen
exports.saveProfessionalInfo = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res
        .status(404)
        .json({ success: false, message: "Attendant not found" });
    }

    const { title, specialization, yearsOfExperience, previousEmployment } =
      req.body;

    // Validate required fields
    if (
      !title ||
      !specialization ||
      !yearsOfExperience ||
      !previousEmployment
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate previous employment data
    if (
      !previousEmployment.employerName ||
      !previousEmployment.duration ||
      !previousEmployment.referenceContact
    ) {
      return res.status(400).json({
        success: false,
        message: "Previous employment details are incomplete",
      });
    }

    // Update professional information
    attendant.professionalInfo = {
      title,
      specialization,
      yearsOfExperience: Number(yearsOfExperience),
      previousEmployment: {
        employerName: previousEmployment.employerName,
        companyDuration: previousEmployment.duration,
        referenceContact: previousEmployment.referenceContact,
      },
      skills: [], // Will be updated in skills screen
      certifications: [], // Will be updated in skills screen
      languagesKnown: [], // Will be updated in skills screen
    };

    // Update current step
    attendant.currentStep = "workPreferences";

    // Save the updated attendant
    await attendant.save();

    res.status(200).json({
      success: true,
      message: "Professional information saved successfully",
      currentStep: attendant.currentStep,
    });
  } catch (error) {
    console.error("Error saving professional info:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save professional information",
    });
  }
};

// Skills Screen
exports.saveSkills = async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided'
            });
        }

        // Verify token and get attendantId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const attendantId = decoded.id;

        const attendant = await Attendant.findById(attendantId);
        if (!attendant) {
            return res.status(404).json({ success: false, message: 'Attendant not found' });
        }

        // Create multer upload instance for certificates
        const uploadFields = Array.from({ length: 5 }, (_, i) => ({
            name: `certificate[${i}]`,
            maxCount: 1
        }));

        const uploadMiddleware = upload.fields(uploadFields);

        uploadMiddleware(req, res, async (err) => {
            if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: 'File upload error: ' + err.message
                });
            }

            try {
                const {
                    selectedSkills,
                    customSkills,
                    certificateDetails,
                    selectedLanguages
                } = req.body;

                // Parse JSON strings if they are strings
                const parsedSkills = typeof selectedSkills === 'string' ? JSON.parse(selectedSkills) : selectedSkills;
                const parsedLanguages = typeof selectedLanguages === 'string' ? JSON.parse(selectedLanguages) : selectedLanguages;
                const parsedCertificateDetails = typeof certificateDetails === 'string' ? JSON.parse(certificateDetails) : certificateDetails;

                // Combine selected and custom skills
                const allSkills = [...parsedSkills];
                if (customSkills) {
                    const customSkillsArray = customSkills.split(',').map(skill => skill.trim());
                    allSkills.push(...customSkillsArray);
                }

                // Process certificates
                const certificates = [];
                if (req.files) {
                    Object.keys(req.files).forEach((fieldName, index) => {
                        const file = req.files[fieldName][0];
                        const details = parsedCertificateDetails[index] || {};
                        certificates.push({
                            name: details.name || 'Untitled Certificate',
                            authority: details.authority || 'Unknown Authority',
                            certificateUrl: file.path,
                            fileType: file.mimetype
                        });
                    });
                }

                // Update skills info
                attendant.skillsInfo = {
                    skills: allSkills,
                    certifications: certificates,
                    languagesKnown: parsedLanguages
                };

                // Update current step
                attendant.currentStep = 'workPreferences';

                await attendant.save();

                res.status(200).json({
                    success: true,
                    message: 'Skills information saved successfully',
                    currentStep: attendant.currentStep
                });
            } catch (error) {
                // Clean up uploaded files if there's an error
                if (req.files) {
                    Object.values(req.files).forEach(files => {
                        files.forEach(file => {
                            fs.unlink(file.path, err => {
                                if (err) console.error('Error deleting file:', err);
                            });
                        });
                    });
                }
                console.error('Error saving skills info:', error);
                res.status(500).json({ 
                    success: false, 
                    message: 'Server error: ' + error.message 
                });
            }
        });
    } catch (error) {
        console.error('Error in skills controller:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
};

// Work Preferences Screen
exports.saveWorkPreferences = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({
        success: false,
        message: 'Attendant not found',
      });
    }

    const {
      workType,
      preferredDays,
      shiftPreferences,
      locationPreferences,
      willingToTravel,
    } = req.body;

    // Validate required fields
    if (!workType || !preferredDays?.length || !shiftPreferences?.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required preferences',
      });
    }

    // Validate work type
    if (!['Full Time', 'Part Time'].includes(workType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid work type',
      });
    }

    // Validate days
    const validDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    if (!preferredDays.every(day => validDays.includes(day))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day selection',
      });
    }

    // Validate shifts
    const validShifts = ['Morning', 'Afternoon', 'Night'];
    if (!shiftPreferences.every(shift => validShifts.includes(shift))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shift selection',
      });
    }

    // Update work preferences
    attendant.workPreferences = {
      workType,
      preferredDays,
      shiftPreferences,
      locationPreferences,
      willingToTravel: willingToTravel || false,
    };

    // Update current step
    attendant.currentStep = 'healthInfo';

    await attendant.save();

    res.status(200).json({
      success: true,
      message: 'Work preferences saved successfully',
      currentStep: attendant.currentStep,
    });
  } catch (error) {
    console.error('Error saving work preferences:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save work preferences',
    });
  }
};

// Health Information Screen
exports.saveHealthInfo = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({
        success: false,
        message: 'Attendant not found',
      });
    }

    const {
      medicalConditions,
      allergies,
      emergencyContact
    } = req.body;

    // Validate emergency contact details
    if (!emergencyContact?.contactName || 
        !emergencyContact?.relationship || 
        !emergencyContact?.mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required emergency contact details'
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(emergencyContact.mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid emergency contact mobile number'
      });
    }

    if (emergencyContact.alternativeNumber && 
        !mobileRegex.test(emergencyContact.alternativeNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid alternative mobile number'
      });
    }

    // Update health information
    attendant.healthInfo = {
      medicalConditions: medicalConditions || 'None',
      allergies: allergies || 'None'
    };

    // Update emergency contact
    attendant.emergencyContact = {
      contactName: emergencyContact.contactName,
      relationship: emergencyContact.relationship,
      mobileNumber: emergencyContact.mobileNumber,
      alternativeNumber: emergencyContact.alternativeNumber || ''
    };

    // Update current step
    attendant.currentStep = 'bankingInfo';

    await attendant.save();

    res.status(200).json({
      success: true,
      message: 'Health information saved successfully',
      currentStep: attendant.currentStep
    });

  } catch (error) {
    console.error('Error saving health info:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save health information'
    });
  }
};

// Banking Information Screen
exports.saveBankingInfo = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({
        success: false,
        message: 'Attendant not found',
      });
    }

    // Create multer upload instance for cancelled cheque
    const uploadMiddleware = upload.single('cancelledCheque');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message,
        });
      }

      try {
        // Update banking information
        attendant.bankingInfo = {
          accountHolderName: req.body.accountHolderName,
          bankName: req.body.bankName,
          accountNumber: req.body.accountNumber,
          ifscCode: req.body.ifscCode,
          upiId: req.body.upiId || '',
          cancelledChequePhoto: req.file ? req.file.path : null,
        };

        // Update current step
        attendant.currentStep = 'agreements';

        await attendant.save();

        res.status(200).json({
          success: true,
          message: 'Banking information saved successfully',
          currentStep: attendant.currentStep,
        });
      } catch (error) {
        // Clean up uploaded file if there's an error
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        
        console.error('Error saving banking info:', error);
        res.status(500).json({
          success: false,
          message: 'Server error: ' + error.message,
        });
      }
    });
  } catch (error) {
    console.error('Error in banking info controller:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// Agreements Screen
exports.saveAgreements = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    // Verify token and get attendantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendantId = decoded.id;

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({
        success: false,
        message: 'Attendant not found',
      });
    }

    const {
      termsAndConditions,
      privacyPolicy,
      backgroundCheckAuthorization,
    } = req.body;

    // Validate that all agreements are accepted
    if (!termsAndConditions || !privacyPolicy || !backgroundCheckAuthorization) {
      return res.status(400).json({
        success: false,
        message: 'All agreements must be accepted to proceed',
      });
    }

    // Update agreements
    attendant.agreements = {
      termsAndConditions,
      privacyPolicy,
      backgroundCheckAuthorization,
    };

    // Update current step to completed
    attendant.currentStep = 'completed';

    await attendant.save();

    res.status(200).json({
      success: true,
      message: 'Agreements saved successfully',
      currentStep: attendant.currentStep,
    });
  } catch (error) {
    console.error('Error saving agreements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save agreements',
    });
  }
};


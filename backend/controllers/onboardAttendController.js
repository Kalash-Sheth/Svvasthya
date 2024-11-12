const jwt = require('jsonwebtoken');
const Attendant = require('../models/Attendant'); // Assuming Mongoose model is in models folder

const onboardAttendController = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is properly set in env

    const attendantId = decoded.attendantId;
    console.log(attendantId)
    if (!attendantId) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Fetch attendant from database
    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({ success: false, message: 'Attendant not found' });
    }

    // Check currentStep
    const { currentStep } = attendant;
    const dataToUpdate = req.body;

    if (currentStep === 1) {
      // Store personal information
      attendant.personalInfo = dataToUpdate;
      attendant.currentStep = 2; // Move to next step after saving
    } else if (currentStep === 2) {
      // Store document information or other steps
      attendant.documentInfo = dataToUpdate; // Example for step 2
      attendant.currentStep = 3; // Move to next step after saving
    } else {
      return res.status(400).json({ success: false, message: 'Invalid step or process completed' });
    }

    // Save updated attendant data
    await attendant.save();

    res.status(200).json({ success: true, message: 'Information saved successfully', attendantId });
  } catch (error) {
    console.error('Error in onboarding process:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = onboardAttendController;

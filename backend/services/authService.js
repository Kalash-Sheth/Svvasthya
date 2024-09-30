const Partner = require('../models/Partner');
const Otp = require('../models/Otp');
const otpService = require('./otpService');
const bcrypt = require('bcrypt');

exports.signup = async (mobileNumber) => {
    let partner = await Partner.findOne({ mobileNumber });

    if (!partner) {
        partner = new Partner({ mobileNumber });
        await partner.save();
    }

    const otp = otpService.generateOtp();
    await otpService.saveOtp(mobileNumber, otp);
    await otpService.sendOtp(mobileNumber, otp);

    return { message: 'OTP sent successfully' };
};

exports.verifyOtp = async (mobileNumber, otp) => {
    const validOtp = await Otp.findOne({ mobileNumber, otp });

    if (!validOtp) {
        throw new Error('Invalid OTP');
    }

    await Partner.updateOne({ mobileNumber }, { isVerified: true });
    await Otp.deleteOne({ mobileNumber, otp });

    return { message: 'Mobile number verified successfully' };
};

// Signup with password
exports.signupWithPassword = async (mobileNumber, hashedPassword) => {
    let Partner = await Partner.findOne({ mobileNumber });

    if (!Partner) {
        partner = new Partner({ mobileNumber });
    }

    partner.passwordHash = hashedPassword;
    await partner.save();

    return { message: 'Signup successful' };
};
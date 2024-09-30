const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

exports.generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
};

exports.saveOtp = async (mobileNumber, otp) => {
    const newOtp = new Otp({ mobileNumber, otp });
    await newOtp.save();
};

exports.sendOtp = async (mobileNumber, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: mobileNumber + '@sms_gateway.com', // Replace with actual SMS gateway email-to-SMS format
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

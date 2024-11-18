const Partner = require('../models/Partner');
const Customer = require('../models/Customer');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
require('dotenv').config({ path: './config/config.env' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, token);

exports.send_otp = async (req, res) => {
    const { mobileNumber } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    try {
        let customer = await Customer.findOne({ mobileNumber });

        if (!customer) {
            customer = new Customer({ mobileNumber });
        }

        customer.otp = otp;
        customer.otpExpires = otpExpires;

        await customer.save();

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            to: mobileNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
};

// Verify OTP and Sign Up/Login
exports.verify_otp_and_signup_login = async (req, res) => {
    const { mobileNumber, otp, firstname, lastname } = req.body;

    try {

        let customer = await Customer.findOne({ mobileNumber });

        // Verify OTP and expiration
        if (customer && (customer.otp !== otp || customer.otpExpires < new Date())) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        if (!customer) {
            // New user - sign them up
            customer = new Customer({
                mobileNumber,
                firstname,
                lastname,
                // Add any other fields if needed
            });

            await customer.save();

            const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httponly: true,
            };

            return res.status(201).cookie("token", token, options).json({
                success: true,
                user: customer,
                token,
            });
        } else {
            // Clear OTP fields
            customer.otp = null;
            customer.otpExpires = null;
            if (!customer.firstname) customer.firstname = firstname;
            if (!customer.lastname) customer.lastname = lastname;

            await customer.save();

            // Existing user - log them in
            const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httponly: true,
            };

            return res.status(200).cookie("token", token, options).json({
                success: true,
                user: customer,
                token,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying OTP and signing up/logging in' });
    }
};

// Verify OTP and Sign Up/Login (without firstname and lastname)
exports.verify_otp_and_signup_login_basic = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        let customer = await Customer.findOne({ mobileNumber });

        // Verify OTP and expiration
        if (customer && (customer.otp !== otp || customer.otpExpires < new Date())) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        if (!customer) {
            // New user - sign them up
            customer = new Customer({
                mobileNumber,
                // Add any other fields if needed
            });

            await customer.save();

            const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httponly: true,
                secure: ture,
                path: '/', // Accessible in all paths
            };

            return res.status(201).cookie("token", token, options).json({
                success: true,
                user: customer,
                token,
            });
        } else {
            // Clear OTP fields
            customer.otp = null;
            customer.otpExpires = null;

            await customer.save();

            // Existing user - log them in
            const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: false,  // Remove httpOnly if you need access from JavaScript
                secure: false,
                path: '/', // Accessible in all paths
            };

            return res.status(200).cookie("token", token, options).json({
                success: true,
                user: customer,
                token,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying OTP and signing up/logging in' });
    }
};







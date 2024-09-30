const express = require('express');
const router = express.Router();
const { send_otp, login, verify_otp_and_signup_login, verify_otp_and_signup_login_basic} = require('../controllers/authController');


// Generate and send OTP
router.route("/send-otp").post(send_otp);

// verify and signup customer
router.route("/verify_otp_and_signup_login").post(verify_otp_and_signup_login);

// verify and signup customer
router.route("/verify_otp_and_signup_login_basic").post(verify_otp_and_signup_login_basic);

module.exports = router;


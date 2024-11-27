import React, { useState } from "react";
import { useCookies } from 'react-cookie';
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPhoneAlt, FaLock } from "react-icons/fa";

const LoginModal = ({ onClose, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: `+91${phone}` }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("OTP sent:", data.message);
        setStep(2);
      } else {
        setError(data.error || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/verify_otp_and_signup_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: `+91${phone}`, otp }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setCookie('token', data.token, {
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        onLogin(data.user);
        onClose();
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 md:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#282261]">
              {step === 1 ? "Welcome Back!" : "Verify OTP"}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? "Please enter your phone number to continue" 
                : "Enter the OTP sent to your phone"}
            </p>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center border-2 rounded-lg focus-within:border-[#EF5A2A] transition-colors">
                    <span className="pl-4 pr-2 text-gray-500">+91</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={handleInputChange(setPhone)}
                      placeholder="Enter phone number"
                      className="w-full py-3 px-2 focus:outline-none"
                      maxLength="10"
                      disabled={loading}
                    />
                    <FaPhoneAlt className="text-gray-400 mr-4" />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3 bg-[#EF5A2A] text-white rounded-lg font-medium
                    transform transition-all duration-200 hover:bg-[#282261] hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center border-2 rounded-lg focus-within:border-[#EF5A2A] transition-colors">
                    <input
                      type="text"
                      value={otp}
                      onChange={handleInputChange(setOtp)}
                      placeholder="Enter OTP"
                      className="w-full py-3 px-4 focus:outline-none"
                      maxLength="6"
                      disabled={loading}
                    />
                    <FaLock className="text-gray-400 mr-4" />
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 bg-[#EF5A2A] text-white rounded-lg font-medium
                    transform transition-all duration-200 hover:bg-[#282261] hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;

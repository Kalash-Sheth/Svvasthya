import React, { useState } from "react";
import { useCookies } from 'react-cookie';

const LoginModal = ({ onClose, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone); // Validates a 10-digit phone number
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
        console.log("Login successful:", data);

        // Store token in a cookie with react-cookie
        setCookie('token', data.token, {
          path: '/', // Cookie accessible across the app
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
          secure: process.env.NODE_ENV === 'production', // Secure in production
          sameSite: 'lax', // Prevent CSRF
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
    setError(""); // Clear error on new input
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {step === 1 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <div className="flex items-center border p-2 rounded mb-4">
              <span className="mr-2">+91</span>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={handleInputChange(setPhone)}
                className="w-full focus:outline-none"
                maxLength="10"
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleInputChange(setOtp)}
              className="w-full border p-2 rounded mb-4 focus:outline-green-500"
              maxLength="6"
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

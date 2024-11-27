import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { FaUser, FaPhone, FaLock } from "react-icons/fa";

const InputField = ({ icon: Icon, error, touched, ...props }) => (
  <div className="flex flex-col space-y-1">
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
          error && touched
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-purple-500"
        } focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all`}
      />
    </div>
    {error && touched && (
      <span className="text-red-500 text-sm ml-1">{error}</span>
    )}
  </div>
);

export default function ContactDetails() {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      otp: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .required("First Name is required"),
      lastName: Yup.string()
        .min(2, "Last Name must be at least 2 characters")
        .required("Last Name is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile Number must be exactly 10 digits")
        .required("Mobile Number is required"),
      otp: Yup.string()
        .min(4, "OTP must be at least 4 digits")
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/verify_otp_and_signup_login",
          {
            mobileNumber: `+91${values.mobileNumber}`,
            otp: values.otp,
            firstname: values.firstName,
            lastname: values.lastName,
          }
        );

        if (response.data.success) {
          Cookies.set("token", response.data.token, { expires: 7, path: "/" });
          navigate("/CustomDatePicker");
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    },
  });

  const handleSendOtp = async () => {
    if (formik.values.mobileNumber && !formik.errors.mobileNumber) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/send-otp",
          { mobileNumber: `+91${formik.values.mobileNumber}` }
        );

        if (response.status === 200) {
          setOtpSent(true);
          alert("OTP sent successfully");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP. Please try again.");
      }
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(
        78.83deg,
        rgba(239, 91, 42, 0.151),
        rgba(250, 174, 66, 0.151) 33%,
        rgba(139, 197, 65, 0.151) 66%,
        rgba(3, 147, 71, 0.151)
      )`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#282261]">
              Contact Details
            </h2>
            <p className="text-gray-600 mt-2">
              Please enter your details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                icon={FaUser}
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.firstName}
                touched={formik.touched.firstName}
              />

              <InputField
                icon={FaUser}
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.lastName}
                touched={formik.touched.lastName}
              />
            </div>

            <div className="relative">
              <InputField
                icon={FaPhone}
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.mobileNumber}
                touched={formik.touched.mobileNumber}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>

            <InputField
              icon={FaLock}
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.otp}
              touched={formik.touched.otp}
            />

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#282261] text-white rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

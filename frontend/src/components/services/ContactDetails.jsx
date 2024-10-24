import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Header from "../Header";
import axios from "axios";
import Cookies from 'js-cookie';

export default function ContactDetails({ onSubmit }) {
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
        const response = await axios.post("http://localhost:5000/api/auth/verify_otp_and_signup_login", {
          mobileNumber: `+91${values.mobileNumber}`,
          otp: values.otp,
          firstname: values.firstName,
          lastname: values.lastName,
        });
        const token = response.data.token;


        Cookies.set('token', token, { expires: 7, path: '/' });

        if (response.data.success) {
          navigate("/CustomDatePicker");
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error("Error during OTP verification and signup/login:", error);
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
        } else {
          alert("Failed to send OTP. Please try again.");
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#ef5b2a1a] to-[#03a3491a]">
        <div className="container mx-auto px-4 flex justify-center items-center h-screen">
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-5xl">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-left mb-4 sm:mb-6"
              style={{ color: "#282261" }}
            >
              Enter Contact Details
            </h2>

            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="border border-gray-300 rounded-3xl px-3 py-2 h-16 w-full md:w-[468px]"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-3xl px-3 py-2 h-16 w-full md:w-[468px]"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>

              <div className="relative flex flex-col">
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  className="border border-gray-300 rounded-3xl px-3 py-2 h-16 w-full md:w-[468px]"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.mobileNumber}
                  </div>
                ) : null}
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm sm:text-base text-[#282261] font-semibold hover:underline"
                  type="button"
                  onClick={handleSendOtp}
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              <div className="relative flex flex-col">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="border border-gray-300 rounded-3xl px-3 py-2 h-16 w-full md:w-[468px]"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.otp && formik.errors.otp ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.otp}
                  </div>
                ) : null}
                <div className="flex justify-end mt-2">
                  <a
                    href="/"
                    className="text-blue-500 text-sm sm:text-base hover:underline"
                  >
                    Resend OTP
                  </a>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-center">
                <button
                  className="bg-[#EF5A2A] text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-3xl transition-all w-full"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Header from "../Header";

export default function ContactDetails({ onSubmit }) {
  const navigate = useNavigate();

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
        .matches(/^[0-9]+$/, "Mobile Number must be digits only")
        .min(10, "Mobile Number must be at least 10 digits")
        .required("Mobile Number is required"),
      otp: Yup.string()
        .min(4, "OTP must be at least 4 digits")
        .required("OTP is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      navigate("/CustomDatePicker");
    },
  });

  return (
    <>
      <Header />
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
              >
                Send OTP
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
    </>
  );
}

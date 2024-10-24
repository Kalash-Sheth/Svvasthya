import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useBookingContext } from "./BookingContext";

const BookingConfirmation = () => {
  const { bookingData } = useBookingContext();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointment/appointments",
        {
          mobileNumber: "+919510822738", // Ensure this data is part of bookingData
          mainService: bookingData.mainService,
          subService: bookingData.subService,
          duration: bookingData.duration,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          address: bookingData.address,
          location: bookingData.location,
        }
      );

      // If the appointment is successfully created, navigate to the success page
      alert("successfully created appointment");
      // navigate("/success");
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "There was an error creating your appointment. Please try again.";
      alert(errorMessage); // Display the error message to the user
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#282261] mb-4">
          Booking Confirmation
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Service Details</h3>
          <p>
            <strong>Service:</strong>
            {bookingData.mainService} - {bookingData.subService}
          </p>
          <p>
            <strong>Offer Duration:</strong>
            {bookingData.duration}
          </p>
          <p>
            <strong>Price:</strong>
            {bookingData.price}
          </p>
          <hr className="my-4" />

          <h3 className="text-xl font-semibold mb-2">Appointment Details</h3>
          <p>
            <strong>Start DateTime:</strong>
            {bookingData.startTime}
          </p>
          <p>
            <strong>End DateTime:</strong>
            {bookingData.endTime}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${bookingData.address.name}, ${bookingData.address.houseNumber}, ${bookingData.address.landmark},${bookingData.address.fullAddress}`}
          </p>

          <p>
            <strong>Location:</strong> Latitude:{" "}
            {bookingData.location?.latitude}, Longitude:{" "}
            {bookingData.location?.longitude}
          </p>

          <hr className="my-4" />
          <button
            onClick={handleConfirm}
            className="w-full bg-green-500 text-white py-2 rounded-3xl"
          >
            Confirm Booking
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmation;

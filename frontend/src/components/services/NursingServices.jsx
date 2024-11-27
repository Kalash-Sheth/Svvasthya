import React from "react";
import { useNavigate } from "react-router-dom";
import nursing1 from "../../assets/services_img/nursing1.png";
import Footer from "../Footer";
import { useBookingContext } from "./BookingContext";
import "./service_style.css";

const ServiceCard = ({ service, onBookNow }) => (
  <div className="container_nurse flex flex-col w-full max-w-3xl p-4 sm:p-6 bg-[#EF5A2A] text-white rounded-xl shadow-md transform transition-transform hover:-translate-y-1">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold px-4 mb-4">
      {service.title}
    </h2>

    <ul className="mt-4 space-y-2 text-lg sm:text-xl md:text-2xl font-normal flex-grow px-4 sm:px-8 mb-6">
      {service.description.map((desc, i) => (
        <li key={i} className="flex items-start">
          <span className="mr-2">•</span>
          <span>{desc}</span>
        </li>
      ))}
    </ul>

    <div className="relative mt-4 flex justify-center">
      <img
        src={service.imageUrl}
        alt={service.title}
        className="rounded-lg h-[300px] sm:h-[350px] md:h-[400px] w-[95%] object-cover"
      />
      <button
        className="absolute bottom-4 left-10 bg-white text-orange-500 text-xl sm:text-2xl md:text-3xl font-bold py-2 px-6 rounded-full transform transition-all hover:scale-105 hover:bg-orange-100"
        onClick={() => onBookNow(service.title)}
      >
        Book Now
      </button>
    </div>
  </div>
);

const NursingServices = () => {
  const navigate = useNavigate();
  const { setBookingData } = useBookingContext();

  const nursingServices = [
    {
      title: "Wound Care",
      description: [
        "Major dressing at home",
        "Minor dressing at home",
        "Procedure to protect a wound, prevent infection and enable healing",
        "Dressing for traction, bed sore dressing, big surgical wounds, ICD dressing, peg tube dressing",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity",
        "Regular monitoring for cardiac patients",
      ],
      imageUrl: nursing1,
    },
    // ... add more services as needed
  ];

  const handleBookNow = (subService) => {
    const mainService = "Nursing";
    setBookingData((prev) => ({
      ...prev,
      mainService,
      subService,
    }));
    navigate("/SelectOffer");
  };

  return (
    <>
      <div
        className="p-4 sm:p-6 md:p-8 min-h-screen"
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
        <h2 className="text-4xl sm:text-5xl md:text-7xl text-center font-bold text-[#282261] mb-8 sm:mb-12">
          HOW WE WORK
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {nursingServices.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NursingServices;

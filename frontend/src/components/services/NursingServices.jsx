import React from "react";
import { useNavigate } from "react-router-dom";
import nursing1 from "../../assets/services_img/nursing1.png";
import Footer from "../Footer";
import { useBookingContext } from "./BookingContext";
import "./service_style.css";

const NursingServices = () => {
  const navigate = useNavigate();

  const nurse = [
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
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
    {
      title: "ECG",
      description: [
        "ECG at home",
        "ECG monitoring and doctor assessment of ECG",
        "A simple test to check your heart's rhythm and electrical activity.",
        "A simple test to check your heart's rhythm and electrical activity.",
      ],
      imageUrl: nursing1,
    },
  ];

  const { setBookingData } = useBookingContext();
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
      {/* <Header /> */}
      <div className="p-6 bg-white">
        <h2 className="text-4xl md:text-7xl flex justify-center font-bold text-[#282261] m-0">
          HOW WE WORK
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {nurse.map((nurseservice, index) => (
            <div
              className="container_nurse flex flex-col w-full  max-w-3xl  p-4 bg-[#EF5A2A] text-white rounded-xl shadow-md"
              key={index}
            >
              <h2 className="text-6xl font-bold px-4">{nurseservice.title}</h2>
              <ul className="mt-4 space-y-2 text-2xl font-normal flex-grow px-8">
                {nurseservice.description.map((desc, i) => (
                  <li key={i}>• {desc}</li>
                ))}
              </ul>
              <div className="relative mt-20 flex justify-center">
                <img
                  src={nurseservice.imageUrl}
                  alt={nurseservice.title}
                  className="rounded-lg h-[400px] w-[95%] object-cover"
                />
                <button
                  className="absolute bottom-4 left-10 bg-white text-orange-500 text-3xl font-bold py-2 px-4 rounded-full"
                  onClick={() => handleBookNow(nurseservice.title)} // Pass subService title here
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NursingServices;

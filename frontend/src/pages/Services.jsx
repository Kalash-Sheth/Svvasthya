import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import nurse from "../assets/services_img/nurse_img.png";
import second_img from "../assets/services_img/second_img.png";
import third_img from "../assets/services_img/third_img.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../components/services/service_style.css";

const BannerComponent = ({
  title,
  points,
  imageUrl,
  bgColor,
  buttonColor,
  marginBottom,
}) => {
  return (
    <div
      className="wrap-container flex flex-col md:flex-row items-center p-8 rounded-3xl mb-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 text-white">
        <h2 className="text-3xl md:text-7xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {points.map((point, index) => (
            <div key={index} className="flex flex-col">
              <hr className="border-t-1 border-gray-200 w-11/12" />
              <div
                className="text-white bg-opacity-30 rounded-md p-2 overflow-hidden"
                style={{
                  maxWidth: "90%",
                  boxSizing: "border-box",
                  wordSpacing: "0.2rem",
                  wordBreak: "break-word",
                  maxHeight: "512px",
                  padding: "2%",
                }}
              >
                <h3 className="text-3xl font-bold">Point {index + 1}</h3>
                <p className="text-2xl overflow-auto font-normal text-justify">
                  {point}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 py-2 px-4 bg-white rounded-3xl h-12 w-44 font-bold text-xl"
          style={{ color: buttonColor }}
        >
          <Link to="/ContactDetails">Book Now</Link>
        </button>
      </div>
      <div className="flex mt-4 md:mt-0 md:ml-6 banner_img">
        <img
          src={imageUrl}
          alt={title}
          className=" rounded-lg w-full max-w-xs md:max-w-md mx-auto"
          style={{ marginBottom: marginBottom }}
        />
      </div>
    </div>
  );
};

function Explore() {
  const banners = [
    {
      title: "Nursing",
      points: [
        "Clear and effective communication with clients, families, and medical professionals.",
        "Understanding common health conditions, medications, and their side effects.",
        "Knowing how to handle emergencies and basic first aid procedures.",
        "Documenting daily activities, changes in health, and any incidents.",
      ],
      imageUrl: nurse,
      bgColor: "#EF5A2A",
      buttonColor: "#EF5A2A",
      marginBottom: "-8%",
    },
    {
      title: "Baby Care",
      points: [
        "Clear and effective communication with clients, families, and medical professionals.",
        "Understanding common health conditions, medications, and their side effects.",
        "Knowing how to handle emergencies and basic first aid procedures.",
        "Documenting daily activities, changes in health, and any incidents.",
      ],
      imageUrl: second_img,
      bgColor: "#039347",
      buttonColor: "#039347",
      marginBottom: "-7%",
    },
    {
      title: "Caregiver",
      points: [
        "Clear and effective communication with clients, families, and medical professionals.",
        "Understanding common health conditions, medications, and their side effects.",
        "Knowing how to handle emergencies and basic first aid procedures.",
        "Documenting daily activities, changes in health, and any incidents.",
      ],
      imageUrl: third_img,
      bgColor: "#262163",
      buttonColor: "#262163",
      marginBottom: "-7%",
    },
  ];

  return (
    <>
      <Header />
      <h1 className="text-5xl md:text-7xl mt-6 font-extrabold text-[#3C3B6E] mb-6">
        EXPLORE OUR SERVICES
      </h1>

      <div className="container mx-auto p-4">
        {banners.map((banner, index) => (
          <BannerComponent key={index} {...banner} />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default Explore;

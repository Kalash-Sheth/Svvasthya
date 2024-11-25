import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import nurse from "../assets/services_img/nurse_img.png";
import second_img from "../assets/services_img/second_img.png";
import third_img from "../assets/services_img/third_img.png";
import Footer from "../components/Footer";
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
      className="wrap-container flex flex-col lg:flex-row items-center p-4 sm:p-6 md:p-8 rounded-3xl mb-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 text-white">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-4 text-center lg:text-left">
          {title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {points.map((point, index) => (
            <div key={index} className="flex flex-col">
              <hr className="border-t-1 border-gray-200 w-11/12" />
              <div className="text-white bg-opacity-30 rounded-md p-2 overflow-hidden">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  Point {index + 1}
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-justify">
                  {point}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center lg:justify-start mt-6">
          <Link
            to="/nursingservices"
            className="py-2 px-6 bg-white rounded-full text-lg sm:text-xl font-bold transition-all hover:opacity-90"
            style={{ color: buttonColor }}
          >
            Book Now
          </Link>
        </div>
      </div>
      <div className="flex mt-6 lg:mt-0 lg:ml-6 banner_img">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto object-cover"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#3C3B6E] mb-6 text-center">
        EXPLORE OUR SERVICES
      </h1>

      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {banners.map((banner, index) => (
          <BannerComponent key={index} {...banner} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Explore;

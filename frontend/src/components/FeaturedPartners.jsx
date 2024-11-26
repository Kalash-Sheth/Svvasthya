import React from "react";
import Partner from "../assets/Partner.png";

const CaregiverCard = ({ name, degree, image, rating }) => (
  <div className="relative w-full sm:w-[280px] md:w-[300px] h-[350px] sm:h-[400px] group transform transition-transform duration-300 hover:scale-105">
    <img
      src={image}
      alt={name}
      className="w-full h-full object-cover rounded-lg shadow-lg"
    />

    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#282261] to-transparent text-white p-4 sm:p-6 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-lg sm:text-xl font-bold text-left mb-1">{name}</h3>
      <p className="text-sm sm:text-md text-left text-gray-200">({degree})</p>

      <div className="flex mt-2">
        {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <svg
            key={i}
            className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.5l2.39 7.1h7.1l-5.75 4.18L16.97 22 12 17.7 7.03 22l1.23-8.22L2.5 9.6h7.1L12 2.5z" />
          </svg>
        ))}
        {rating % 1 !== 0 && (
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.5l2.39 7.1h7.1l-5.75 4.18L16.97 22 12 17.7V2.5z" />
          </svg>
        )}
      </div>
    </div>
  </div>
);

const FeaturedPartners = () => {
  const caregivers = [
    { name: "Dr. Shivali Mistry", degree: "MBBS", image: Partner, rating: 4.5 },
    { name: "Dr. Anil Kapoor", degree: "MD", image: Partner, rating: 4 },
    { name: "Dr. Riya Patel", degree: "Ph.D.", image: Partner, rating: 5 },
    { name: "Dr. Sanjay Sharma", degree: "BDS", image: Partner, rating: 4.2 },
  ];

  return (
    <div className="text-center p-4 sm:p-5 mt-8 sm:mt-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3C3B6E] mb-4 sm:mb-6">
        OUR BEST HIGHLY PERFORM CAREGIVER
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-6 max-w-7xl mx-auto px-4">
        {caregivers.map((caregiver, index) => (
          <CaregiverCard
            key={index}
            name={caregiver.name}
            degree={caregiver.degree}
            image={caregiver.image}
            rating={caregiver.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedPartners;

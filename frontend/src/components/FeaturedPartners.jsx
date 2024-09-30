import React from "react";
import Partner from "../assets/Partner.png"; // Replace with actual image paths

const FeaturedPartners = () => {
  // Array of caregivers with different names and information
  const caregivers = [
    { name: "Dr. Shivali Mistry", degree: "MBBS", image: Partner, rating: 4.5 },
    { name: "Dr. Anil Kapoor", degree: "MD", image: Partner, rating: 4 },
    { name: "Dr. Riya Patel", degree: "Ph.D.", image: Partner, rating: 5 },
    { name: "Dr. Sanjay Sharma", degree: "BDS", image: Partner, rating: 4.2 },
  ];

  return (
    <div className="text-center p-5 mt-12">
      <h1 className="text-4xl font-bold text-[#3C3B6E] mb-6 md:text-5xl sm:text-2xl">
        OUR BEST HIGHLY PERFORM CAREGIVER
      </h1>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-around mt-6 items-center mb-4 gap-4">
        {caregivers.map((caregiver, index) => (
          <div key={index} className="relative w-[300px] h-[400px] group">
            <img
              src={caregiver.image}
              alt={`Caregiver ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#282261] to-transparent text-white p-6 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-xl font-bold text-left">{caregiver.name}</h3>
              <p className="text-md text-left">({caregiver.degree})</p>

              <div className="flex mt-2">
                {Array.from(
                  { length: Math.floor(caregiver.rating) },
                  (_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.5l2.39 7.1h7.1l-5.75 4.18L16.97 22 12 17.7 7.03 22l1.23-8.22L2.5 9.6h7.1L12 2.5z" />
                    </svg>
                  )
                )}

                {caregiver.rating % 1 !== 0 && (
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.5l2.39 7.1h7.1l-5.75 4.18L16.97 22 12 17.7V2.5z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPartners;

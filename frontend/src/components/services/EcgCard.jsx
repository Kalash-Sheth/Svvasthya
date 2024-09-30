import React from "react";

const EcgCard = () => {
  return (
    <div className="bg-orange-500 text-white rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">
        <span className="bg-red-600 text-black px-1   py-1 rounded">ECG</span>
      </h2>
      <ul className="mb-4 space-y-2">
        <li>ECG at home</li>
        <li>ECG monitoring and doctor assessment of ECG</li>
        <li>
          A simple test to check your heart's rhythm and electrical activity.
        </li>
        <li>
          A simple test to check your heart's rhythm and electrical activity.
        </li>
      </ul>
      <div className="bg-white rounded-lg p-4">
        <img
          src="path_to_your_image_here"
          alt="Doctor with ECG monitor"
          className="w-full rounded-md"
        />
      </div>
      <button className="bg-red-600 text-white rounded-full py-2 px-4 mt-4">
        Book Now
      </button>
    </div>
  );
};

export default EcgCard;

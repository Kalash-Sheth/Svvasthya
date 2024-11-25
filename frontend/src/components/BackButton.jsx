// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center px-4 py-2 text-[#282261] hover:bg-gray-100 rounded-lg transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span className="ml-2">Back</span>
    </button>
  );
};

export default BackButton;

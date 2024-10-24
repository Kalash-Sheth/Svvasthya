// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // Go back to the previous page
      className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded ${className}`}
    >
      Back
    </button>
  );
};

export default BackButton;

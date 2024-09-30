import React from "react";

const NumericalsComponent = () => {
  return (
    <div className="flex flex-col md:flex-row justify-around p-2 w-full h-auto mt-24 space-y-4 md:space-y-0 md:space-x-4">
      <div className="numerical-box relative flex flex-col items-center justify-center p-8 w-[full] md:w-1/4 border text-[#00A74A] border-[#00A74A] rounded-lg text-center transition-colors duration-300 hover:bg-[#00A74A] hover:text-white">
        <div className="text-7xl font-bold">500+</div>
        <div className="text-2xl">Recovered Patient</div>
      </div>
      <div className="numerical-box relative flex flex-col items-center justify-center p-8 w-full md:w-1/4 border text-[#00A74A] border-[#00A74A] rounded-lg text-center transition-colors duration-300 hover:bg-[#00A74A] hover:text-white">
        <div className="text-7xl font-bold">96%</div>
        <div className="text-2xl">Satisfaction Ratio</div>
      </div>
      <div className="numerical-box relative flex flex-col items-center justify-center p-8 w-full md:w-1/4 border text-[#00A74A] border-[#00A74A] rounded-lg text-center transition-colors duration-300 hover:bg-[#00A74A] hover:text-white">
        <div className="text-7xl font-bold">4.8/5</div>
        <div className="text-base">Service Rating</div>
      </div>
    </div>
  );
};

export default NumericalsComponent;

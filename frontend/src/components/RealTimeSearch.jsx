import React from "react";
import { GrLocationPin } from "react-icons/gr";
import { IoPerson } from "react-icons/io5";

const RealTimeSearch = () => {
  return (
    <div className="text-center w-[95%] p-5 bg-orange-600 text-white rounded-2xl relative mx-auto left-0 right-0 sm:mt-10 md:mt-15 lg:mt-20">
      <h1 className="text-[50px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[120px] text-white font-black -mt-10">
        MEET SPECIALIST
      </h1>
      <p className="text-2xl font-normal sm:text-lg md:text-xl mb-5">
        Discover comprehensive health care support services conveniently
        <br />
        tailored to meet all your needs in one place.
      </p>
      <div className="absolute flex flex-col sm:flex-row justify-center rounded-3xl items-center bg-white w-[85%] left-[7.5%] mt-20 sm:mt-18 md:mt-10 lg:mt-12 transform -translate-y-1/2 p-3 shadow-md">
        {/* Location Input and Icon */}
        <div className="flex items-center w-full sm:w-[40%] mb-4 sm:mb-0">
          <span className="text-gray-500 text-xl mr-2">
            <GrLocationPin />
          </span>
          <input
            type="text"
            placeholder="Location"
            className="border-none p-2 text-lg rounded-lg outline-none w-full text-black"
          />
        </div>

        {/* Divider if needed */}
        <div className="border-l border-gray-300 h-8 mx-2 sm:hidden"></div>

        {/* Service Input and Icon */}
        <div className="flex items-center w-full sm:w-[40%] mb-4 sm:mb-0">
          <span className="text-gray-500 text-xl mr-2">
            <IoPerson />
          </span>
          <input
            type="text"
            placeholder="Select your Service"
            className="border-none p-3 text-lg rounded-lg outline-none w-full text-black"
          />
        </div>

        {/* Search Button */}
        <button className="bg-[#282261] text-white border-none p-2 w-full sm:w-52 rounded-full cursor-pointer ml-2 sm:ml-4 text-3xl">
          Search
        </button>
      </div>
    </div>
  );
};

export default RealTimeSearch;

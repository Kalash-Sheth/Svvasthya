import React from "react";
import wcu_1 from "../assets/wcu_1.svg";
import wcu_2 from "../assets/wcu_2.svg";
import wcu_3 from "../assets/wcu_3.png";

const WhyChooseUs = () => {
  return (
    <div className="text-center p-5 mt-12">
      <h1 className="text-4xl font-bold text-[#3C3B6E] mb-6">WHY CHOOSE US</h1>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-around gap-8 mt-6">
        <div className="bg_container text-center w-full max-w-md h-80 border-2 border-orange-500 rounded-2xl p-5 hover:bg-[linear-gradient(#F2733C,#F9A54A)] group relative">
          <img
            src={wcu_1}
            alt="100% Safe"
            className="w-20 h-20 mx-auto mb-4 group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:sepia"
          />
          <h2 className="text-3xl font-bold text-[#EF5A2A] mb-2 group-hover:text-white">
            100% Safe
          </h2>
          <p className="text-xl text-[#252627] group-hover:text-white">
            Discover comprehensive health care support services conveniently
            tailored to meet all your needs in one place.
          </p>
        </div>
        <div className="bg_container text-center w-full max-w-md h-80 border-2 border-green-500 rounded-2xl p-5 hover:bg-[linear-gradient(#129946,#63B743)] group relative">
          <img
            src={wcu_2}
            alt="Experienced Doctor"
            className="w-20 h-20 mx-auto mb-4 group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:sepia"
          />
          <h2 className="text-3xl font-bold text-[#039347] mb-2 group-hover:text-white">
            Experienced Doctor
          </h2>
          <p className="text-xl text-[#252627] group-hover:text-white">
            Discover comprehensive health care support services conveniently
            tailored to meet all your needs in one place.
          </p>
        </div>
        <div className="bg_container text-center w-full max-w-md h-80 border-2 border-[#282261] rounded-2xl p-5 hover:bg-[linear-gradient(#45457E,#3F5EB0)]  group relative">
          <img
            src={wcu_3}
            alt="Premium Equipment"
            className="w-20 h-20 mx-auto mb-4 group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:sepia"
          />
          <h2 className="text-3xl font-bold text-[#282261] mb-2 group-hover:text-white">
            Premium Equipment
          </h2>
          <p className="text-xl text-[#252627] group-hover:text-white">
            Discover comprehensive health care support services conveniently
            tailored to meet all your needs in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;

import React from "react";

const AboutUs = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-[#FAF2F2] rounded-[30px_0_0_0] border-2 border-[#E2E2E2] mt-8 sm:mt-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#2F234E] mb-4 sm:mb-6 md:mb-8">
        ABOUT US
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 md:col-span-3">
          {/* Mission Statement */}
          <div className="bg-[#FAAE42] p-4 sm:p-5 rounded-[1.5rem] shadow-md w-full flex flex-col justify-between h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] md:col-span-1">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2 md:mb-3">
              Mission Statement
            </h3>
            <p className="text-sm sm:text-base md:text-base lg:text-lg font-normal text-white line-clamp-6 md:line-clamp-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Core Values - Larger */}
          <div className="bg-[#EF5A2A] p-4 sm:p-5 rounded-[1.5rem] shadow-md w-full flex flex-col justify-between h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] md:col-span-2">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2 md:mb-3">
              Core Values
            </h3>
            <p className="text-sm sm:text-base md:text-base lg:text-lg font-normal text-white line-clamp-6 md:line-clamp-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 md:col-span-3">
          {/* Team Introduction - Larger */}
          <div className="bg-[#8BC540] p-4 sm:p-5 rounded-[1.5rem] shadow-md w-full flex flex-col justify-between h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] md:col-span-2">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2 md:mb-3">
              Team Introduction
            </h3>
            <p className="text-sm sm:text-base md:text-base lg:text-lg font-normal text-white line-clamp-6 md:line-clamp-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Experience */}
          <div className="bg-[#009247] p-4 sm:p-5 rounded-[1.5rem] shadow-md w-full flex flex-col justify-between h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] md:col-span-1">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2 md:mb-3">
              Experience
            </h3>
            <p className="text-sm sm:text-base md:text-base lg:text-lg font-normal text-white line-clamp-6 md:line-clamp-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

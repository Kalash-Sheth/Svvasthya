import React from "react";

const AboutUs = () => {
  return (
    <div className="p-6 sm:p-8 md:p-10 bg-[#FAF2F2] rounded-[30px_0_0_0] border-2 border-[#E2E2E2] mt-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#2F234E] mb-6 sm:mb-8">
        ABOUT US
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-[repeat(4,1fr)] md:gap-6 lg:grid-cols-[500px_1fr_1fr] lg:gap-8">
        {/* Mission Statement */}
        <div className="bg-[#FAAE42] p-4 sm:p-6 rounded-[2rem] shadow-md w-full flex flex-col justify-space h-auto sm:h-[323px] max-h-[400px]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 sm:mb-4">
            Mission Statement
          </h3>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Core Values - Larger */}
        <div className="bg-[#EF5A2A] right-0 p-4 sm:p-6 rounded-[2rem] shadow-md lg:col-span-2 w-full flex flex-col justify-space h-auto sm:h-[323px] max-h-[400px]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 sm:mb-4">
            Core Values
          </h3>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Team Introduction - Larger */}
        <div className="bg-[#8BC540] p-4 sm:p-6 rounded-[2rem] shadow-md lg:col-span-2 w-full flex flex-col justify-space h-auto sm:h-[325px] max-h-[400px]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 sm:mb-4">
            Team Introduction
          </h3>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Experience */}
        <div className="bg-[#009247] p-4 sm:p-6 rounded-[2rem] shadow-md w-full flex flex-col justify-space h-auto sm:h-[325px] max-h-[400px]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 sm:mb-4">
            Experience
          </h3>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";

const AboutUs = () => {
  return (
    <div className="p-10 bg-[#FAF2F2] rounded-[30px_0_0_0] border-2 border-[#E2E2E2] mt-12">
      <h2 className="text-4xl md:text-6xl font-bold text-center text-[#2F234E] mb-8">
        ABOUT US
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[repeat(4,1fr)] md:gap-6 lg:grid-cols-[500px_1fr_1fr] lg:gap-8">
        {/* Mission Statement */}
        <div className="bg-[#FAAE42] p-6 rounded-[2rem] shadow-md w-full flex flex-col justify-space h-[323px] max-h-[400px]">
          <h3 className="text-4xl font-semibold text-white mb-4">
            Mission Statement
          </h3>
          <p className="text-white text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Core Values - Larger */}
        <div className="bg-[#EF5A2A] right-0 p-6 rounded-[2rem] shadow-md lg:col-span-2 w-full flex flex-col justify-space  h-[323px] max-h-[400px]">
          <h3 className="text-4xl font-semibold text-white mb-4">
            Core Values
          </h3>
          <p className="text-white text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Team Introduction - Larger */}
        <div className="bg-[#8BC540] p-6 rounded-[2rem] shadow-md lg:col-span-2 w-full flex flex-col justify-space h-[325px] max-h-[400px]">
          <h3 className="text-4xl font-semibold text-white mb-4">
            Team Introduction
          </h3>
          <p className="text-white text-2xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Experience */}
        <div className="bg-[#009247] p-6 rounded-[2rem] shadow-md w-full flex flex-col justify-space h-[325px] max-h-[400px]">
          <h3 className="text-4xl font-semibold text-white mb-4">Experience</h3>
          <p className="text-white text-2xl font-normal">
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

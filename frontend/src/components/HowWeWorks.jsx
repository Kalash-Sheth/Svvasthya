import React from "react";
import howitworks from "../assets/howitworks.png";
import backgroundImage from "../assets/watermark.svg";

const WorkStep = ({ number, text }) => (
  <button className="relative flex w-full md:w-[500px] items-center mb-4 p-3 bg-transparent text-left rounded-full shadow-md border-2 border-black hover:bg-[#F0592A] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
    <div className="absolute inset-0 bg-cover bg-center rounded-full"></div>
    <div className="relative text-base sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 pl-2 sm:pl-4">
      {String(number).padStart(2, '0')} {text}
      <span className="float-right mr-2 sm:mr-6 transition-transform group-hover:translate-x-2">→</span>
    </div>
  </button>
);

const HowWeWorks = () => {
  const steps = [
    { text: "Book an Appointment" },
    { text: "Match with Attendees" },
    { text: "Receive Call" },
    { text: "Provide Feedback" },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center rounded-lg bg-[#ffe7de] mt-82 sm:mt-40">
      {/* Left Section */}
      <div
        className="bg-contain flex-1 text-center relative z-10 p-4 sm:p-6 md:p-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#282261] mb-4">
            HOW WE WORK
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#252627] mb-8">
            Discover comprehensive health care support services.
          </p>
          
          <div className="flex flex-col items-center lg:items-start mx-auto lg:mx-24 max-w-[500px] w-full">
            {steps.map((step, index) => (
              <WorkStep 
                key={index} 
                number={index + 1} 
                text={step.text} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 relative w-full lg:w-1/2 px-4 lg:px-0">
        <div className="relative aspect-[3/4] w-full">
          <img
            src={howitworks}
            alt="Healthcare Support"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium">
              Discover comprehensive health care support services conveniently
              tailored to meet all your needs in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeWorks;

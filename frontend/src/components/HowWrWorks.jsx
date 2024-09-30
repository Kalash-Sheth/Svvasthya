import React from "react";
import howitworks from "../assets/howitworks.png";
import backgroundImage from "../assets/watermark.svg";

const HowWeWorks = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center rounded-lg bg-[#ffe7de] mt-60 sm:mt-40  ">
      <div
        className="bg-contain flex-1 text-center  relative z-10"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-20">
          <h2 className="text-4xl md:text-7xl font-bold text-[#282261] -ml-5">
            HOW WE WORK
          </h2>
          <p className="text-xl md:text-2xl text-[ #252627] my-2 mb-5">
            Discover comprehensive health care support services.
          </p>
          <div className="flex flex-col items-start mx-4 md:mx-24 ">
            <button className="relative flex w-full md:w-[500px] items-center mb-4 p-3 bg-transparent text-left rounded-full shadow-md border-2 border-black hover:bg-[#F0592A] hover:text-white transition-colors duration-300">
              <div className="absolute inset-0 bg-cover bg-center rounded-full"></div>
              <div className="relative text-xl md:text-2xl lg:text-3xl font-bold  flex-1 pl-4 ">
                01 Book an Appointment{" "}
                <span className="float-right mr-6">→</span>
              </div>
            </button>
            <button className="relative flex w-full md:w-[500px] items-center mb-4 p-3 bg-transparent text-left rounded-full shadow-md border-2 border-black hover:bg-[#F0592A] hover:text-white transition-colors duration-300">
              <div className="absolute inset-0 bg-cover bg-center rounded-full"></div>
              <div className="relative text-xl md:text-2xl lg:text-3xl font-bold  flex-1 pl-4">
                02 Match with Attendees{" "}
                <span className="float-right mr-6">→</span>
              </div>
            </button>
            <button className="relative flex w-full md:w-[500px] items-center mb-4 p-3 bg-transparent text-left rounded-full shadow-md border-2 border-black hover:bg-[#F0592A] hover:text-white transition-colors duration-300">
              <div className="absolute inset-0 bg-cover bg-center rounded-full"></div>
              <div className="relative text-xl md:text-2xl lg:text-3xl font-bold  flex-1 pl-4">
                03 Receive Call <span className="float-right mr-6">→</span>
              </div>
            </button>
            <button className="relative flex w-full md:w-[500px] items-center mb-4 p-3 bg-transparent text-left rounded-full shadow-md border-2 border-black hover:bg-[#F0592A] hover:text-white transition-colors duration-300">
              <div className="absolute inset-0 bg-cover bg-center rounded-full"></div>
              <div className="relative text-xl md:text-2xl lg:text-3xl font-bold  flex-1 pl-4">
                04 Provide Feedback <span className="float-right mr-6">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 text-center relative mt-8 md:mt-0">
        <img
          src={howitworks}
          alt="Healthcare Support"
          className="w-full h-auto"
        />
        <p className="text-white p-2 text-xl md:text-2xl lg:text-3xl font-bold rounded-lg absolute bottom-2 left-2 right-2 inline-block text-left">
          Discover comprehensive health care support services conveniently
          tailored to meet all your needs in one place.
        </p>
      </div>
    </div>
  );
};

export default HowWeWorks;

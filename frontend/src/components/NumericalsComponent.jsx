import React from "react";

const StatCard = ({ number, text }) => (
  <div className="numerical-box relative flex flex-col items-center justify-center p-6 sm:p-8 w-full border-2 text-[#00A74A] border-[#00A74A] rounded-lg text-center transition-all duration-300 hover:bg-[#00A74A] hover:text-white transform hover:-translate-y-1 hover:shadow-lg">
    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
      {number}
    </div>
    <div className="text-lg sm:text-xl md:text-2xl font-medium">
      {text}
    </div>
  </div>
);

const NumericalsComponent = () => {
  const stats = [
    {
      number: "500+",
      text: "Recovered Patient"
    },
    {
      number: "96%",
      text: "Satisfaction Ratio"
    },
    {
      number: "4.8/5",
      text: "Service Rating"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-12 sm:mt-16 md:mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            number={stat.number}
            text={stat.text}
          />
        ))}
      </div>
    </div>
  );
};

export default NumericalsComponent;

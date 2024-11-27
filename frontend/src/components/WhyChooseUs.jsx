import React from "react";
import wcu_1 from "../assets/wcu_1.svg";
import wcu_2 from "../assets/wcu_2.svg";
import wcu_3 from "../assets/wcu_3.png";

const FeatureCard = ({ image, title, description, borderColor, hoverGradient, titleColor }) => (
  <div 
    className={`bg_container text-center w-full max-w-md h-auto min-h-[150px] border-2 ${borderColor} rounded-2xl p-4 sm:p-5 hover:${hoverGradient} group relative transition-all duration-300 transform hover:-translate-y-1`}
  >
    <img
      src={image}
      alt={title}
      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 transition-transform duration-300 group-hover:filter group-hover:invert"
    />
    <h2 className={`text-2xl sm:text-3xl font-bold ${titleColor} mb-2 transition-colors duration-300 group-hover:filter group-hover:invert`}>
      {title}
    </h2>
    <p className="text-base sm:text-xl text-[#252627] transition-colors duration-300 group-hover:text-white">
      {description}
    </p>
  </div>
);

const WhyChooseUs = () => {
  const features = [
    {
      image: wcu_1,
      title: "100% Safe",
      description: "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
      borderColor: "border-orange-500",
      hoverGradient: "bg-gradient-to-b from-[#F2733C] to-[#F9A54A]",
      titleColor: "text-[#EF5A2A]"
    },
    {
      image: wcu_2,
      title: "Experienced Doctor",
      description: "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
      borderColor: "border-green-500",
      hoverGradient: "bg-gradient-to-b from-[#129946] to-[#63B743]",
      titleColor: "text-[#039347]"
    },
    {
      image: wcu_3,
      title: "Premium Equipment",
      description: "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
      borderColor: "border-[#282261]",
      hoverGradient: "bg-gradient-to-b from-[#45457E] to-[#3F5EB0]",
      titleColor: "text-[#282261]"
    }
  ];

  return (
    <div className="text-center p-4 sm:p-5 mt-8 sm:mt-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3C3B6E] mb-4 sm:mb-6">
        WHY CHOOSE US
      </h1>
      <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 mt-6 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <div key={index} className="flex-1 min-w-[280px] max-w-[400px]">
            <FeatureCard
              image={feature.image}
              title={feature.title}
              description={feature.description}
              borderColor={feature.borderColor}
              hoverGradient={feature.hoverGradient}
              titleColor={feature.titleColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;

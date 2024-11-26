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
      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:sepia transition-all duration-300"
    />
    <h2 className={`text-2xl sm:text-3xl font-bold ${titleColor} mb-2 group-hover:text-white transition-colors duration-300`}>
      {title}
    </h2>
    <p className="text-base sm:text-xl text-[#252627] group-hover:text-white transition-colors duration-300">
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
      hoverGradient: "bg-[linear-gradient(#F2733C,#F9A54A)]",
      titleColor: "text-[#EF5A2A]"
    },
    {
      image: wcu_2,
      title: "Experienced Doctor",
      description: "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
      borderColor: "border-green-500",
      hoverGradient: "bg-[linear-gradient(#129946,#63B743)]",
      titleColor: "text-[#039347]"
    },
    {
      image: wcu_3,
      title: "Premium Equipment",
      description: "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
      borderColor: "border-[#282261]",
      hoverGradient: "bg-[linear-gradient(#45457E,#3F5EB0)]",
      titleColor: "text-[#282261]"
    }
  ];

  return (
    <div className="text-center p-4 sm:p-5 mt-8 sm:mt-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3C3B6E] mb-4 sm:mb-6">
        WHY CHOOSE US
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
            borderColor={feature.borderColor}
            hoverGradient={feature.hoverGradient}
            titleColor={feature.titleColor}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;

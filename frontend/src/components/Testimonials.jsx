import React from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const testimonials = [
  {
    name: "Lalit Somya",
    title: "Heart Patient",
    content:
      "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place. Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
  },
  {
    name: "John Doe",
    title: "Lung Patient",
    content:
      "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place. Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
  },
  {
    name: "Jane Smith",
    title: "Cancer Patient",
    content:
      "Discover comprehensive health care support services conveniently tailored to meet all your needs in one place. Discover comprehensive health care support services conveniently tailored to meet all your needs in one place.",
  },
];

const TestimonialSlider = () => {
  return (
    <div className="w-full py-8 mt-12 px-4">
      {" "}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 text-[#282261]">
        TESTIMONIALS
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        className="h-full"
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="relative bg-gray-100 p-6 md:p-8 rounded-2xl shadow-lg mx-auto max-w-[95%] md:max-w-[38rem] h-auto flex flex-col justify-between">
              {/* SVG Positioned in the upper-right corner */}
              <svg
                className="absolute top-4 right-4 md:top-12 md:right-14 w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] opacity-10"
                width="118"
                height="104"
                viewBox="0 0 118 104"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M118 52.9059C118 73.9233 111.045 88.7805 97.1341 97.4773C90.6585 101.584 83.5833 103.758 75.9085 104L75.9085 69.9373C82.8638 69.9373 87.7805 67.1591 90.6585 61.6028C91.6179 59.187 92.3374 56.288 92.8171 52.9059L67.2744 52.9059L67.2744 2.17421L118 7.62939e-06L118 52.9059ZM50.7256 52.9059C50.7256 73.6818 43.6504 88.5389 29.5 97.4773C23.5041 101.343 16.4289 103.517 8.27438 104L8.27439 69.9373C15.7094 69.9373 20.626 67.1591 23.0244 61.6028C24.4634 59.187 25.1829 56.288 25.1829 52.9059L-3.16261e-06 52.9059L1.2725e-06 2.17421L50.7256 1.74808e-06L50.7256 52.9059Z"
                  fill="#282261"
                  fillOpacity="0.1"
                />
              </svg>

              {/* Content of the testimonial */}
              <p className="font-semibold text-xl md:text-2xl mt-4 text-justify">
                {testimonial.name}
              </p>
              <p className="text-md md:text-xl font-normal text-[#252627] mt-4">
                {testimonial.content}
              </p>
              <div>
                <p className="font-bold mt-4">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;

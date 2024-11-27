import React from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";

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
    <div className="w-full py-12 md:py-16 mt-12 px-4 bg-[#FAF2F2]">
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 text-[#282261]">
        TESTIMONIALS
      </h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet bg-[#282261] opacity-50',
          bulletActiveClass: 'swiper-pagination-bullet-active bg-[#282261] opacity-100',
        }}
        className="h-full max-w-[1400px] mx-auto px-4 pb-12"
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
            <div className="bg-white p-8 rounded-2xl shadow-lg mx-auto h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Quote SVG */}
              <div className="flex justify-between items-start mb-6">
                <svg
                  className="w-12 h-12 text-[#282261] opacity-10"
                  viewBox="0 0 118 104"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M118 52.9059C118 73.9233 111.045 88.7805 97.1341 97.4773C90.6585 101.584 83.5833 103.758 75.9085 104L75.9085 69.9373C82.8638 69.9373 87.7805 67.1591 90.6585 61.6028C91.6179 59.187 92.3374 56.288 92.8171 52.9059L67.2744 52.9059L67.2744 2.17421L118 7.62939e-06L118 52.9059ZM50.7256 52.9059C50.7256 73.6818 43.6504 88.5389 29.5 97.4773C23.5041 101.343 16.4289 103.517 8.27438 104L8.27439 69.9373C15.7094 69.9373 20.626 67.1591 23.0244 61.6028C24.4634 59.187 25.1829 56.288 25.1829 52.9059L-3.16261e-06 52.9059L1.2725e-06 2.17421L50.7256 1.74808e-06L50.7256 52.9059Z" />
                </svg>
                <div className="text-right">
                  <h3 className="text-xl md:text-2xl font-bold text-[#282261]">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#EF5A2A] font-medium">{testimonial.title}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Rating Stars */}
              <div className="flex justify-end mt-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;

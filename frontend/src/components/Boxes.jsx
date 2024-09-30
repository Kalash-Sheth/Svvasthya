// import React from "react";
// import { useNavigate } from "react-router-dom";
// import babyImage from "../assets/babycare.png";
// import careImage from "../assets/caregiver.png";

// import nurseImage from "../assets/nursing.png";

// const Boxes = () => {
//   const navigate = useNavigate();

//   const handleBookNow = () => {
//     navigate("/services");
//   };
//   return (
//     <div>
//       {/* box content */}
//       <div className="services mt-60 ">
//         <div className="service-card w-[380px] h-[270px] group relative overflow-visible bg-white shadow-lg rounded-3xl sm:w-[440px] sm:h-[310px]">
//           {/* Overlay effect */}
//           <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>

//           {/* Image with hover scale */}
//           <img
//             src={nurseImage}
//             alt="Nursing"
//             className="bottom-0 transition-transform duration-300 group-hover:scale-130 group-hover:translate-y-50 transform-origin-top"
//           />

//           <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#F6A226] to-[rgba(246, 162, 38, 1)] opacity-1 rounded-3xl "></div>

//           {/* Text and button */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
//             <h2 className="font-bold text-7xl mb-4">Nursing</h2>
//             <div className="">
//               {/* Original Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="flex items-center justify-center w-36 h-12 text-2xl font-medium  bg-[background: linear-gradient(180deg, rgba(246, 162, 38, 0) 50%, #F6A226 85%)] border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
//               >
//                 <span className="mr-2">Book Now</span>
//                 <span className="transition-all duration-300 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
//                   →
//                 </span>
//               </button>

//               {/* Animation Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="absolute bottom-0 flex items-center justify-center w-36 h-12 text-2xl font-medium bg-orange-500 border-2 border-white rounded-full transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:w-44"
//               >
//                 <span className="mr-[6px]">Book Now</span>
//                 <span className="transition-all duration-300 transform group-hover:left-1/2 group-hover:translate-x-1 group-hover:opacity-100">
//                   →
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="service-card w-[380px] h-[270px] group relative overflow-visible bg-white shadow-lg rounded-3xl sm:w-[440px] sm:h-[310px]">
//           {/* Overlay effect */}
//           <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 "></div>

//           {/* Image with hover scale */}
//           <img
//             src={careImage}
//             alt="Caregiver"
//             className="bottom-2 transition-transform duration-300 group-hover:scale-130 group-hover:translate-y-50 transform-origin-top"
//           />
//           <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#F0592A] to-[rgba(340, 99, 52, 100)] opacity-1 rounded-3xl"></div>

//           {/* Text and button */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
//             <h2 className="font-bold text-7xl mb-4">Caregiver</h2>
//             <div className="">
//               {/* <div className=" w-80 h-14 bg-orange-500 opacity-1 transition-opacity duration-300 group-hover:opacity-100 rounded-md"></div> */}

//               {/* Original Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="flex items-center justify-center w-36 h-12 text-2xl font-medium bg-[background: linear-gradient(180deg, rgba(246, 162, 38, 0) 50%, #F6A226 85%)] border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
//               >
//                 <span className="mr-2">Book Now</span>
//                 <span className="transition-all duration-300 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
//                   →
//                 </span>
//               </button>

//               {/* Animation Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="absolute bottom-0 flex items-center justify-center w-36 h-12 text-2xl font-medium bg-orange-500 border-2 border-white rounded-full transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:w-44"
//               >
//                 <span className="mr-[6px]">Book Now</span>
//                 <span className="transition-all duration-300 transform group-hover:left-1/2 group-hover:translate-x-1 group-hover:opacity-100">
//                   →
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="service-card w-[380px] h-[270px]  group relative overflow-visible bg-white shadow-lg rounded-3xl sm:w-[440px] sm:h-[310px]">
//           {/* Overlay effect */}
//           <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 "></div>

//           {/* Image with hover scale */}
//           <img
//             src={babyImage}
//             alt="BabyCare"
//             className="bottom-0 transition-transform group-hover:scale-130 group-hover:translate-y-50 transform-origin-top"
//           />

//           <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#009247] to-[rgba(0, 146, 71, 1)] opacity-1 rounded-3xl"></div>

//           {/* Text and button */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
//             <h2 className="font-bold text-7xl mb-4">Baby&nbsp;Care</h2>
//             <div className="">
//               {/* Original Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="flex items-center justify-center w-36 h-12 text-2xl font-medium bg-[background: linear-gradient(180deg, rgba(246, 162, 38, 0) 50%, #F6A226 85%)] border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
//               >
//                 <span className="mr-2">Book Now</span>
//                 <span className="transition-all duration-300 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
//                   →
//                 </span>
//               </button>

//               {/* Animation Button */}
//               <button
//                 onClick={handleBookNow}
//                 className="absolute bottom-0 flex items-center justify-center w-36 h-12 text-2xl font-medium bg-orange-500 border-2 border-white rounded-full transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:w-44"
//               >
//                 <span className="mr-[6px]">Book Now</span>
//                 <span className="transition-all duration-300 transform group-hover:left-1/2 group-hover:translate-x-1 group-hover:opacity-100">
//                   →
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Boxes;

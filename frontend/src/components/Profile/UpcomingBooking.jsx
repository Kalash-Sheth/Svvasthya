import React from "react";
import { Link } from "react-router-dom";
import booking1 from "../../assets/booking_img.png";
import BackButton from "../BackButton";

const BookingHistory = () => {
  const bookings = [
    {
      id: 1,
      title: "TPN INFUSION",
      price: "30,000/-",
      time: "07:00 AM - 07:00 PM",
      date: "20 April, 2024",
      image: booking1,
    },
    {
      id: 2,
      title: "TPN INFUSION",
      price: "30,000/-",
      time: "07:00 AM - 07:00 PM",
      date: "20 April, 2024",
      image: booking1,
    },
    {
      id: 3,
      title: "TPN INFUSION",
      price: "30,000/-",
      time: "07:00 AM - 07:00 PM",
      date: "20 April, 2024",
      image: booking1,
    },
  ];

  return (
    <div
      style={{
        background:
          "linear-gradient(78.83deg, rgba(239, 91, 42, 0.1) 0%, rgba(250, 174, 66, 0.1) 33%, rgba(139, 197, 65, 0.1) 66%, rgba(3, 147, 71, 0.1) 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-4xl mx-auto p-6 bg-white border border-purple-700 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 sm:mb-0">
            Upcoming Booking
          </h2>
          <BackButton className="ml-4" />
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              to="/BookingDetails"
              key={booking.id}
              className="flex flex-col sm:flex-row border border-purple-700 rounded-lg overflow-hidden"
            >
              <img
                src={booking.image}
                alt={booking.title}
                className="w-full sm:w-72 h-40 object-cover"
              />
              <div className="p-4 flex-1">
                <h3 className="text-xl font-semibold text-purple-800">
                  {booking.title}
                </h3>
                <div className="flex items-center mt-2 text-[#282261]">
                  <span className="mr-2 text-orange-500">
                    <svg
                      width="24"
                      height="16"
                      viewBox="0 0 24 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 15.591H21.4135V3.33426H0V15.591ZM1.96997 6.78472C2.19583 6.78472 2.41948 6.74022 2.62813 6.65378C2.83679 6.56733 3.02637 6.44062 3.18605 6.28089C3.34573 6.12115 3.47238 5.93153 3.55876 5.72284C3.64514 5.51416 3.68956 5.2905 3.68948 5.06464H17.7235C17.7235 5.52083 17.9047 5.95834 18.2273 6.28092C18.5499 6.6035 18.9874 6.78472 19.4436 6.78472V12.136C18.9874 12.136 18.5499 12.3172 18.2273 12.6398C17.9047 12.9623 17.7235 13.3998 17.7235 13.856H3.68948C3.68956 13.6302 3.64514 13.4065 3.55876 13.1978C3.47238 12.9891 3.34573 12.7995 3.18605 12.6398C3.02637 12.4801 2.83679 12.3534 2.62813 12.2669C2.41948 12.1805 2.19583 12.136 1.96997 12.136V6.78472Z"
                        fill="#EF5A2A"
                      />
                      <path
                        d="M10.7065 12.0428C12.1314 12.0428 13.2866 10.8876 13.2866 9.46267C13.2866 8.03771 12.1314 6.88255 10.7065 6.88255C9.28152 6.88255 8.12636 8.03771 8.12636 9.46267C8.12636 10.8876 9.28152 12.0428 10.7065 12.0428Z"
                        fill="#EF5A2A"
                      />
                      <path
                        d="M1.12486 2.47605H22.2731V12.3688L24 12.1858L22.7191 0L1.12486 2.47605Z"
                        fill="#EF5A2A"
                      />
                    </svg>
                  </span>
                  <span className="text-lg font-normal">{booking.price}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-16 mt-2 ">
                  <div className="flex items-center text-[#282261]">
                    <span className="mr-2 text-orange-500">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.7834 2.29094C13.4172 1.73597 10.9546 1.73597 8.5884 2.29094C7.05615 2.65022 5.65465 3.43023 4.5418 4.54308C3.42894 5.65594 2.64894 7.05743 2.28965 8.58969C1.73469 10.9559 1.73469 13.4185 2.28965 15.7847C2.64894 17.3169 3.42894 18.7184 4.5418 19.8313C5.65465 20.9441 7.05615 21.7242 8.5884 22.0834C10.9547 22.6384 13.4172 22.6384 15.7834 22.0834C17.3157 21.7242 18.7172 20.9441 19.83 19.8313C20.9429 18.7184 21.7229 17.3169 22.0822 15.7847C22.6372 13.4185 22.6372 10.9559 22.0822 8.58969C21.7229 7.05743 20.9429 5.65594 19.83 4.54308C18.7172 3.43023 17.3157 2.65022 15.7834 2.29094ZM8.1609 0.465937C10.8091 -0.155312 13.5652 -0.155312 16.2134 0.465937C18.0852 0.905037 19.7973 1.858 21.1568 3.21752C22.5163 4.57703 23.4693 6.28911 23.9084 8.16094C24.5296 10.8092 24.5296 13.5652 23.9084 16.2134C23.4693 18.0853 22.5163 19.7973 21.1568 21.1569C19.7973 22.5164 18.0852 23.4693 16.2134 23.9084C13.5652 24.5296 10.8091 24.5296 8.1609 23.9084C6.28907 23.4693 4.577 22.5164 3.21748 21.1569C1.85797 19.7973 0.905003 18.0853 0.465903 16.2134C-0.155347 13.5652 -0.155347 10.8092 0.465903 8.16094C0.905003 6.28911 1.85797 4.57703 3.21748 3.21752C4.577 1.858 6.28907 0.905037 8.1609 0.465937ZM12.1865 6.12787C12.5742 6.12787 12.9365 6.30811 13.156 6.62274C13.3754 6.93737 13.4232 7.34965 13.2823 7.71574L10.7235 14.5293C10.6121 14.8217 10.3934 15.0597 10.1203 15.1933C9.84714 15.327 9.53949 15.345 9.25362 15.2434L6.62749 14.2939C6.252 14.1526 6.00795 13.7966 6.00795 13.3957C6.00795 12.7675 6.53029 12.2451 7.15853 12.2451C7.33078 12.2451 7.49856 12.2792 7.65281 12.3437L9.35397 12.997L11.5725 6.56366C11.6659 6.29973 11.8475 6.08326 12.082 5.95743C12.3166 5.8316 12.5866 5.807 12.8344 5.88899C12.8826 5.90593 12.9291 5.92798 12.9732 5.95494C13.0225 5.98544 13.0684 6.02111 13.1096 6.06096C13.166 6.11899 13.2146 6.18635 13.2516 6.26029C13.2886 6.33422 13.3128 6.41292 13.3229 6.49274C13.333 6.57256 13.3284 6.65256 13.3093 6.72925C13.2899 6.80593 13.2566 6.87736 13.2104 6.93996C13.1554 7.01934 13.0803 7.08832 12.9915 7.14198C12.9094 7.19196 12.8162 7.22629 12.7174 7.24397C12.6666 7.25299 12.6143 7.25447 12.5633 7.24792C12.5122 7.24137 12.4637 7.22672 12.4204 7.20492C12.3441 7.16994 12.2786 7.11893 12.2295 7.05508C12.1744 6.98364 12.1412 6.90044 12.1373 6.81467L12.1485 6.70483C12.1692 6.62742 12.1792 6.54729 12.1865 6.4685V6.12787Z"
                          fill="#EF5A2A"
                        />
                      </svg>
                    </span>
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center text-[#282261]">
                    <span className="mr-2 text-orange-500">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 1C4.58333 1 1 4.58333 1 9C1 13.4167 4.58333 17 9 17C13.4167 17 17 13.4167 17 9C17 4.58333 13.4167 1 9 1ZM9 15.6667C5.31667 15.6667 2.33333 12.6833 2.33333 9C2.33333 5.31667 5.31667 2.33333 9 2.33333C12.6833 2.33333 15.6667 5.31667 15.6667 9C15.6667 12.6833 12.6833 15.6667 9 15.6667ZM9.5 5.83333H8.16667V10.5L12.3333 12.7L12.9167 11.7833L9.5 9.83333V5.83333Z"
                          fill="#EF5A2A"
                        />
                      </svg>
                    </span>
                    <span>{booking.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
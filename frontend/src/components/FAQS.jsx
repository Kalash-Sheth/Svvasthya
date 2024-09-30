import React from "react";

function FAQS() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen  p-2 mt-12">
        <div className="w-full max-w-[1720px] text-justify bg-white p-6 shadow-lg rounded-lg space-y-4 border-2 border-[#EF5A2A]">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-[#2F234E] mb-8">
            FAQs
          </h2>
          <details
            className="group border-b border-b-[#f2d5d5] p-6 [&_summary::-webkit-details-marker]:hidden"
            open
          >
            <summary className="flex cursor-pointer items-center gap-1.5">
              {/* <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3"> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              {/* </span> */}
              <h2 className="text-3xl font-semibold text-[#282261] ">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
            </summary>

            <p className="mt-4 ml-7 leading-relaxed text-justify font-normal text-2xl justify-center mr-1 text-[#252627]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>

          <details className="group border-b border-b-[#f2d5d5]  p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center  gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-3xl font-semibold text-[#282261]">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>

              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3"></span>
            </summary>

            <p className="mt-4 ml-7 text-justify leading-relaxed text-2xl justify-center mr-1 text-[#252627]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>

          <details className="group border-b border-b-[#f2d5d5]  p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center  gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-3xl font-semibold text-[#282261]">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>

              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3"></span>
            </summary>

            <p className="mt-4 ml-7 text-justify leading-relaxed text-2xl justify-center mr-2 text-[#252627]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>

          <details className="group  border-b border-b-[#f2d5d5] p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center  gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-3xl font-semibold text-[#282261]">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>

              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3"></span>
            </summary>

            <p className="mt-4 ml-7 text-justify leading-relaxed text-2xl justify-center mr-2 text-[#252627]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>

          <details className="group border-b border-b-[#f2d5d5]  p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center  gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-3xl font-semibold text-[#282261]">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>

              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3"></span>
            </summary>

            <p className="mt-4 ml-7 text-justify leading-relaxed text-2xl justify-center mr-2 text-[#252627]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>
        </div>
      </div>
    </>
  );
}

export default FAQS;

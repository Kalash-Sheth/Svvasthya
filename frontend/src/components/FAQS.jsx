import React from "react";
import { IoAdd } from "react-icons/io5";

const faqs = [
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo consequuntur distinctio corporis earum similique!",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo consequuntur distinctio corporis earum similique!",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo consequuntur distinctio corporis earum similique!",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo consequuntur distinctio corporis earum similique!",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis explicabo consequuntur distinctio corporis earum similique!",
  },
];

const FAQItem = ({ question, answer }) => (
  <details className="group border-b border-b-[#f2d5d5] p-4 sm:p-6 [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex cursor-pointer items-center gap-4">
      <IoAdd className="text-xl sm:text-2xl shrink-0 transition duration-300 group-open:rotate-45" />
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#282261]">
        {question}
      </h2>
    </summary>
    <p className="mt-4 ml-8 text-base sm:text-lg md:text-xl lg:text-2xl text-justify leading-relaxed text-[#252627]">
      {answer}
    </p>
  </details>
);

function FAQS() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 mt-8 sm:mt-12">
      <div className="w-full max-w-[1720px] bg-white p-4 sm:p-6 md:p-8 shadow-lg rounded-lg space-y-4 border-2 border-[#EF5A2A]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#2F234E] mb-6 sm:mb-8">
          FAQs
        </h2>

        <div className="space-y-2 sm:space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQS;

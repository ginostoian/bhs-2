"use client";

import { useRef, useState } from "react";

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex w-full items-center gap-2 border-t border-base-content/10 py-5 text-left text-base font-semibold md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-[#266bf1]" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`ml-auto h-4 w-4 flex-shrink-0 fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`origin-center transform transition duration-200 ease-out ${isOpen && "rotate-180"}`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`origin-center rotate-90 transform transition duration-200 ease-out ${isOpen && "hidden rotate-180"}`}
          />
        </svg>
      </button>
      <div
        ref={accordion}
        className={`overflow-hidden opacity-80 transition-all duration-300 ease-in-out`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  const faqList = [
    {
      question: "How much does a kitchen renovation cost in London?",
      answer: (
        <div>
          The cost of a kitchen renovation in London typically ranges from
          £10,000 to £35,000+, depending on the size, materials, and complexity.
          Custom kitchens and high-end finishes will increase the price.
        </div>
      ),
    },
    {
      question: "What factors affect the cost of a new kitchen?",
      answer: (
        <div>
          Key factors include kitchen size, choice of units (pre-built, flat
          pack, custom), worktop and splashback materials, flooring, appliances,
          electrical and plumbing work, and whether structural changes are
          needed.
        </div>
      ),
    },
    {
      question: "How long does a kitchen renovation take?",
      answer: (
        <div>
          Most kitchen renovations take 3-6 weeks. Timelines depend on the scope
          of work, availability of materials, and whether structural or
          electrical changes are required.
        </div>
      ),
    },
    {
      question: "Do I need to move out during my kitchen renovation?",
      answer: (
        <div>
          In most cases, you can stay in your home, but you may be without a
          functioning kitchen for 1-3 weeks. Setting up a temporary kitchen
          space is recommended.
        </div>
      ),
    },
    {
      question: "What is the best type of worktop for kitchens?",
      answer: (
        <div>
          Popular options include quartz, granite, marble, wood, and laminate.
          The best choice depends on your budget, style, and how much
          maintenance you want.
        </div>
      ),
    },
    {
      question: "Can I install underfloor heating in my kitchen?",
      answer: (
        <div>
          Yes, underfloor heating is a popular choice for kitchens and works
          well with tile, stone, and LVT flooring. It adds comfort and can be
          energy efficient.
        </div>
      ),
    },
    {
      question: "Do I need planning permission for a kitchen renovation?",
      answer: (
        <div>
          Most kitchen renovations do not require planning permission unless you
          are making structural changes, extending the property, or altering
          listed buildings. Always check with your local authority.
        </div>
      ),
    },
    {
      question: "What are the latest kitchen design trends?",
      answer: (
        <div>
          Current trends include handleless cabinets, statement splashbacks,
          smart appliances, sustainable materials, and open-plan layouts.
          Neutral colours and natural textures are also popular.
        </div>
      ),
    },
    {
      question: "How can I make my kitchen renovation more eco-friendly?",
      answer: (
        <div>
          Choose energy-efficient appliances, sustainable materials (like bamboo
          or recycled worktops), LED lighting, and water-saving taps. Recycling
          old units and using local suppliers also helps.
        </div>
      ),
    },
    {
      question: "Is it worth investing in a custom kitchen?",
      answer: (
        <div>
          Custom kitchens offer maximum flexibility and can be tailored to your
          space and needs. They are more expensive but can add significant value
          and enjoyment to your home.
        </div>
      ),
    },
  ];

  return (
    <section className="container my-28 rounded-xl bg-base-100" id="faq">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-8 py-24 md:flex-row">
        <div className="flex basis-1/2 flex-col text-left">
          <p className="mb-4 inline-block font-semibold text-[#266bf1]">FAQ</p>
          <p className="text-3xl font-extrabold text-base-content sm:text-4xl">
            Kitchen Renovation FAQs
          </p>
        </div>
        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;

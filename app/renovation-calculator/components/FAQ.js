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
          className={`flex-1 text-base-content ${
            isOpen ? "text-[#266bf1]" : ""
          }`}
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
            className={`origin-center transform transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`origin-center rotate-90 transform transition duration-200 ease-out ${
              isOpen && "hidden rotate-180"
            }`}
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
      question: "How accurate is this renovation cost calculator?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>
            Our calculator provides estimates based on current market rates and
            typical renovation costs in London. The accuracy depends on the
            information you provide and current market conditions.
          </p>
          <p>
            For the most accurate quote, we recommend booking a free
            consultation where we can assess your specific property and
            requirements.
          </p>
        </div>
      ),
    },
    {
      question: "What&apos;s included in the renovation cost estimate?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>The estimate includes:</p>
          <ul className="ml-4 list-inside list-disc">
            <li>Materials and labor costs</li>
            <li>Professional fees (where applicable)</li>
            <li>Building regulations compliance</li>
            <li>VAT (20%)</li>
            <li>Contingency for unexpected issues</li>
          </ul>
          <p>
            It does not include planning permission fees (if required) or
            furniture and appliances.
          </p>
        </div>
      ),
    },
    {
      question: "How long does a typical renovation take?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>Renovation timelines vary depending on the scope of work:</p>
          <ul className="ml-4 list-inside list-disc">
            <li>Single room renovation: 2-4 weeks</li>
            <li>Kitchen renovation: 3-6 weeks</li>
            <li>Bathroom renovation: 2-4 weeks</li>
            <li>Full house renovation: 8-16 weeks</li>
          </ul>
          <p>Complex projects with structural work may take longer.</p>
        </div>
      ),
    },
    {
      question: "Do I need planning permission for my renovation?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>
            Most internal renovations don&apos;t require planning permission,
            but you may need it for:
          </p>
          <ul className="ml-4 list-inside list-disc">
            <li>Structural changes to load-bearing walls</li>
            <li>Extensions or loft conversions</li>
            <li>Changes to the external appearance</li>
            <li>Converting a house to flats</li>
          </ul>
          <p>
            Building regulations approval is usually required for electrical
            work, plumbing, and structural changes.
          </p>
        </div>
      ),
    },
    {
      question: "Can I live in the property during renovation?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>This depends on the scope of work:</p>
          <ul className="ml-4 list-inside list-disc">
            <li>
              <strong>Kitchen renovation:</strong> Usually requires temporary
              kitchen setup
            </li>
            <li>
              <strong>Bathroom renovation:</strong> May need alternative
              bathroom access
            </li>
            <li>
              <strong>Full house renovation:</strong> Often requires moving out
              temporarily
            </li>
          </ul>
          <p>
            We can discuss accommodation options and work around your schedule.
          </p>
        </div>
      ),
    },
    {
      question: "What warranties do you provide?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          <p>We provide comprehensive warranties:</p>
          <ul className="ml-4 list-inside list-disc">
            <li>2-year workmanship warranty</li>
            <li>10-year structural warranty (where applicable)</li>
            <li>Manufacturer warranties on materials and appliances</li>
            <li>Gas Safe certification for heating work</li>
            <li>NICEIC certification for electrical work</li>
          </ul>
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
            Frequently Asked Questions
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

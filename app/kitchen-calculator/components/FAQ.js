"use client";

import { useRef, useState } from "react";

function Item({ item }) {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex w-full items-center gap-2 border-t border-stone-200 py-5 text-left text-base font-semibold md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-stone-900">{item.question}</span>
        <svg className="ml-auto h-4 w-4 flex-shrink-0 fill-current" viewBox="0 0 16 16">
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`origin-center transform transition duration-200 ease-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`origin-center rotate-90 transform transition duration-200 ease-out ${
              isOpen ? "hidden rotate-180" : ""
            }`}
          />
        </svg>
      </button>
      <div
        ref={accordion}
        className="overflow-hidden text-stone-600 transition-all duration-300 ease-in-out"
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item.answer}</div>
      </div>
    </li>
  );
}

const faqList = [
  {
    question: "Why do online kitchen estimates vary so much?",
    answer: (
      <div className="space-y-2">
        <p>
          Many only price the units, not the installed project. Real kitchen
          jobs also depend on appliances, worktops, electrical work, plumbing,
          flooring, decorating, structural openings, and VAT.
        </p>
      </div>
    ),
  },
  {
    question: "What drives kitchen cost the most?",
    answer: (
      <div className="space-y-2">
        <p>
          The biggest cost drivers are cabinetry tier, worktop material,
          appliance package, layout changes, and any electrical / plumbing /
          structural work.
        </p>
      </div>
    ),
  },
  {
    question: "Why do you show a range instead of one exact number?",
    answer: (
      <div className="space-y-2">
        <p>
          Before the run length, services and structural details are fully
          confirmed, exact-looking prices are misleading. A transparent range is
          more useful for budgeting and quote comparison.
        </p>
      </div>
    ),
  },
  {
    question: "Does the estimate include appliances?",
    answer: (
      <div className="space-y-2">
        <p>
          Yes, if you select an appliance package. The result separates
          appliances from cabinetry so you can see their impact clearly.
        </p>
      </div>
    ),
  },
  {
    question: "What is usually missed in a kitchen budget?",
    answer: (
      <div className="space-y-2">
        <p>
          Common misses are making good, decorating, flooring, boiler work,
          extractor ducting, waste removal, structural engineer fees, and party
          wall / building control costs where applicable.
        </p>
      </div>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-8 py-16 shadow-xl shadow-stone-900/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row">
        <div className="basis-1/2">
          <p className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            FAQ
          </p>
          <p className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Kitchen budgeting questions
          </p>
        </div>
        <ul className="basis-1/2">
          {faqList.map((item, index) => (
            <Item key={index} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

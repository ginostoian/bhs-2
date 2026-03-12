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
        <span className={`flex-1 ${isOpen ? "text-slate-900" : "text-stone-900"}`}>
          {item.question}
        </span>
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
    question: "How accurate is this renovation calculator?",
    answer: (
      <div className="space-y-2">
        <p>
          It is built for early budgeting, not final quoting. It gives a low /
          expected / high range and widens that range when the scope is still
          vague or the property is older and more complex.
        </p>
        <p>
          Accuracy improves once you have a room-by-room scope, survey
          information, and clearer service / structural decisions.
        </p>
      </div>
    ),
  },
  {
    question: "Why not show one exact price?",
    answer: (
      <div className="space-y-2">
        <p>
          Exact-looking numbers for refurbishments are usually misleading.
          Renovation cost moves with hidden conditions, service upgrades,
          structural discoveries, access, and finish decisions.
        </p>
        <p>A useful planning tool should show range and assumptions openly.</p>
      </div>
    ),
  },
  {
    question: "What does the estimate include?",
    answer: (
      <div className="space-y-2">
        <p>The calculator separates:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Core scope allowance for the affected area</li>
          <li>Room fit-out allowances such as kitchens and bathrooms</li>
          <li>Systems upgrades like rewire / heating / plumbing</li>
          <li>Structural and hidden-condition allowances</li>
          <li>Finishing, fees, contingency, and VAT</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What is usually excluded from builder quotes that I should watch for?",
    answer: (
      <div className="space-y-2">
        <p>Common exclusions include appliances, furniture, specialist lighting, window treatments, removals, and temporary accommodation.</p>
        <p>Ask every contractor to confirm exclusions in writing so quotes are comparable.</p>
      </div>
    ),
  },
  {
    question: "Can I live in the house during the renovation?",
    answer: (
      <div className="space-y-2">
        <p>
          Sometimes, yes, but it usually increases cost and duration because
          work must be phased and the site protected more carefully.
        </p>
        <p>
          The calculator includes an occupancy allowance for that reason.
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
            Renovation budgeting questions
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

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
        <p className="pb-5 leading-relaxed">{item.answer}</p>
      </div>
    </li>
  );
}

export const renovationFaqs = [
  {
    question: "How accurate is this renovation calculator?",
    answer:
      "It is built for early budgeting, not final quoting. It gives a low / expected / high range and widens that range when the scope is still vague or the property is older and more complex. Accuracy improves once you have a room-by-room scope, survey information, and clearer service / structural decisions.",
  },
  {
    question: "Why not show one exact price?",
    answer:
      "Exact-looking numbers for refurbishments are usually misleading. Renovation cost moves with hidden conditions, service upgrades, structural discoveries, access, and finish decisions. A useful planning tool should show range and assumptions openly.",
  },
  {
    question: "What does the estimate include?",
    answer:
      "The calculator separates core scope allowance for the affected area, room fit-out allowances such as kitchens and bathrooms, systems upgrades like rewire / heating / plumbing, structural and hidden-condition allowances, finishing, fees, contingency, and VAT.",
  },
  {
    question: "What is usually excluded from builder quotes that I should watch for?",
    answer:
      "Common exclusions include appliances, furniture, specialist lighting, window treatments, removals, and temporary accommodation. Ask every contractor to confirm exclusions in writing so quotes are comparable.",
  },
  {
    question: "Can I live in the house during the renovation?",
    answer:
      "Sometimes, yes, but it usually increases cost and duration because work must be phased and the site protected more carefully. The calculator includes an occupancy allowance for that reason.",
  },
  {
    question: "How much does a full house renovation cost in London in 2026?",
    answer:
      "A full renovation in London typically runs £1,000 to £2,500 per square metre depending on specification and property condition, with inner boroughs at a 15–30% premium. A full terraced-house renovation commonly lands between £80,000 and £200,000 all-in, though older properties with structural or systems work can exceed that. Per-square-metre figures usually exclude VAT, professional fees and contingency — this calculator includes them so your budget is realistic from the start.",
  },
  {
    question: "Is this calculator free, and do I have to give my details?",
    answer:
      "The calculator is free and you can see your low/expected/high estimate on screen without entering any contact details. If you'd like the full PDF breakdown with the budgeting guidance and comparison tips, we ask for your name and email so we can send it to you.",
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
          {renovationFaqs.map((item, index) => (
            <Item key={index} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

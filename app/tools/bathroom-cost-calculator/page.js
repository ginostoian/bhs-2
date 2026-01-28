"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";

import Hero from "../components/Hero";
import ToolsFAQ from "../components/ToolsFAQ";
import Features from "@/components/Features";
import Testimonials3 from "@/components/Testimonials3";
import Stats from "@/components/Stats";
import Guarantee from "@/components/Guarantee";
import CustomCTA from "@/components/CustomCTA";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";

const BathroomCalculator = () => {
  const [renovationCost, setRenovationCost] = useState(0);
  const [formData, setFormData] = useState({
    bathroomSize: "",
    layoutChanges: "",
    bathroomTiling: "",
    fixtures: "",
    ufh: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const faqs = [
    {
      question: "Who is Better Homes Studio?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We are a full-service renovation company. We manage everything from
          kitchen renovations to building extensions and converting lofts. We bet
          there is nothing you can throw at us that we can&apos;t do.
        </div>
      ),
    },
    {
      question: "Where does Better Homes Studio operate and serve clients?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          At this time, we offer our renovation services in London, specifically
          East, North and Central London. If the project is right, please
          contact us if you are located anywhere else in the London area so we can
          see if we can work together.
        </div>
      ),
    },
    {
      question: "Is Better Homes Studio insured?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we have comprehensive insurance that covers all our projects.
          Contact us if you&apos;d like to find out more.
        </div>
      ),
    },
    {
      question: "What if I find a lower price for my project?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We are confident in our industry average pricing, while delivering
          more value than 95% of companies and exceptional customer support. If
          you find a comparable service at a lower price, we are more than happy
          to discuss pricing with you.
        </div>
      ),
    },
    {
      question: "What is the average cost of a bathroom or kitchen renovation?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          The average bathroom renovation in London ranges between £7K and £12K.
          For kitchen renovations, the average costs can be between £9K and
          £15K. At Better Homes Studio, we are confident in our value and
          industry-average pricing.
        </div>
      ),
    },
    {
      question: "What should I expect during the construction process?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Before any work begins, our renovation team protects all the door
          openings to prevent dust from spreading to other areas in your home.
          We also protect the floors, furniture and your belongings so they stay
          in mint condition during the remodeling. Once everything is protected,
          we begin with demolition including fixture removal and wall tearing.
          Rest assured, we will work with you to plan accordingly and minimize
          any inconvenience.
        </div>
      ),
    },
    {
      question: "How does payment work with Better Homes Studio?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We will ask you to pay a deposit upon agreeing to work together. The
          deposit ranges between £300 and £1,000 depending on the size of the
          project. Before starting the project, we will divide the remaining
          total by the number of weeks we expect the project to take and invoice
          you at the end of each week. There will always be 5% - 10% left to be
          paid after completion and snagging for your peace of mind.
        </div>
      ),
    },
    {
      question: "Is there a workmanship guarantee?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Of course. We offer a industry leading workmanship guarantee of up to
          10 years depending on the project type. If you&apos;d like to find out
          more about it, please{" "}
          <Link href="/our-guarantee">read more here</Link>.
        </div>
      ),
    },
  ];

  const prices = {
    baseCost: 5000,
    smallSize: 1.1,
    mediumSize: 1.3,
    largeSize: 1.4,
    noLayoutChange: 0,
    layoutChange: 500,
    tileLevelOne: 0,
    tileLevelTwo: 700,
    tileLevelThree: 1200,
    exposedFixtures: 0,
    concealedFixtures: 400,
    UFH: 1300,
    noUFH: 0,
  };

  const calculateTotalCost = () => {
    let totalCost = prices.baseCost;

    if (formData.bathroomSize === "Small") {
      totalCost = totalCost * prices.smallSize;
    } else if (formData.bathroomSize === "Medium") {
      totalCost = totalCost * prices.mediumSize;
    } else if (formData.bathroomSize === "Large") {
      totalCost = totalCost * prices.largeSize;
    }

    formData.layoutChanges === "No layout changes"
      ? (totalCost += prices.noLayoutChange)
      : (totalCost += prices.layoutChange);

    formData.bathroomTiling === "Splashback tiling"
      ? (totalCost += prices.tileLevelOne)
      : formData.bathroomTiling === "Halfway tiling"
        ? (totalCost += prices.tileLevelTwo)
        : (totalCost += prices.tileLevelThree);

    formData.fixtures === "Exposed Fixtures"
      ? (totalCost += prices.exposedFixtures)
      : (totalCost += prices.concealedFixtures);

    formData.ufh === "Underfloor heating"
      ? (totalCost += prices.UFH)
      : (totalCost += prices.noUFH);

    return totalCost;
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US"); // Or your preferred locale
  };

  const handleClick = () => {
    document.getElementById("my_modal_3").showModal();
    setRenovationCost(calculateTotalCost());
  };

  const sizeRadios = [
    {
      name: "Small",
      description:
        "Toilet room or bathroom with a size of between 3sqm and 5sqm ",
    },
    {
      name: "Medium",
      description: "Average sized bathroom, between 5sqm and 9sqm",
    },
    {
      name: "Large",
      description: "Large, luxurious bathrooms with a size of more than 9sqm",
    },
  ];
  const layoutRadios = [
    {
      name: "No layout changes",
      description: "All the fixtures remain in their current position",
    },
    {
      name: "Layout changes",
      description:
        "Some fixtures will change positions, like the toilet or basin",
    },
  ];

  const tilingRadios = [
    {
      name: "Splashback tiling",
      description:
        "Tiles will be installed on the floor, all the way up in the bath or shower enclosure and splashback behind the basin",
    },
    {
      name: "Halfway tiling",
      description:
        "Tiles will be installed on the floor, all the way up in the bath or shower enclosure and halfway all around the other walls",
    },
    {
      name: "Full height tiling",
      description:
        "Tiles will be installed on the floor and full height on all walls",
    },
  ];

  const fixturesRadios = [
    {
      name: "Exposed Fixtures",
      description: "Your basin tap, bath tap and shower mixers will be visible",
    },
    {
      name: "Concealed Fixtures",
      description: "Your basin tap, bath tap and shower mixers will be hidden",
    },
  ];

  const ufhRadios = [
    {
      name: "Underfloor heating",
      description: "Electric underfloor heating with wireless thermostat",
    },
    {
      name: "No underfloor heating",
      description: "Traditional heating with a heated towel rail",
    },
  ];
  return (
    <div>
      <Hero />
      <div className="mx-auto mb-8 max-w-[85%] rounded-xl bg-white px-6 py-6 text-black md:max-w-[70%]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">What size is your bathroom?</h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {sizeRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    value={item.name}
                    id={item.name}
                    type="radio"
                    checked={formData.bathroomSize === item.name}
                    onChange={handleChange}
                    name="bathroomSize"
                    class="peer sr-only"
                  />
                  <div className="max-w-[100%] cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2">
                    <div className="pl-7">
                      <h3 className="font-medium leading-none text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-5 top-5 block h-4 w-4 rounded-full border peer-checked:border-[5px] peer-checked:border-indigo-600"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Are there any layout changes?</h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {layoutRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    value={item.name}
                    id={item.name}
                    type="radio"
                    checked={formData.layoutChanges === item.name}
                    onChange={handleChange}
                    name="layoutChanges"
                    class="peer sr-only"
                  />
                  <div className="max-w-[100%] cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2">
                    <div className="pl-7">
                      <h3 className="font-medium leading-none text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-5 top-5 block h-4 w-4 rounded-full border peer-checked:border-[5px] peer-checked:border-indigo-600"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            How much wall tiling do you need?
          </h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {tilingRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    value={item.name}
                    id={item.name}
                    type="radio"
                    checked={formData.bathroomTiling === item.name}
                    onChange={handleChange}
                    name="bathroomTiling"
                    class="peer sr-only"
                  />
                  <div className="max-w-[100%] cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2 md:max-w-[350px]">
                    <div className="pl-7">
                      <h3 className="font-medium leading-none text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-5 top-5 block h-4 w-4 rounded-full border peer-checked:border-[5px] peer-checked:border-indigo-600"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            How would you like the fixtures to be installed?
          </h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {fixturesRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    value={item.name}
                    id={item.name}
                    type="radio"
                    checked={formData.fixtures === item.name}
                    onChange={handleChange}
                    name="fixtures"
                    class="peer sr-only"
                  />
                  <div className="max-w-[100%] cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2 md:max-w-[350px]">
                    <div className="pl-7">
                      <h3 className="font-medium leading-none text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-5 top-5 block h-4 w-4 rounded-full border peer-checked:border-[5px] peer-checked:border-indigo-600"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Would you like underfloor heating?
          </h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {ufhRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    value={item.name}
                    id={item.name}
                    type="radio"
                    checked={formData.ufh === item.name}
                    onChange={handleChange}
                    name="ufh"
                    class="peer sr-only"
                  />
                  <div className="max-w-[100%] cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2 md:max-w-[350px]">
                    <div className="pl-7">
                      <h3 className="font-medium leading-none text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-5 top-5 block h-4 w-4 rounded-full border peer-checked:border-[5px] peer-checked:border-indigo-600"></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            type="submit"
            onClick={handleClick}
            className="mb-6 mt-6 flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:px-[24px]"
          >
            Calculate your price!
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn-circle btn-ghost btn-sm absolute right-2 top-2 bg-[#266bf1] text-white">
                  ✕
                </button>
              </form>
              <h3 className="mt-4 text-center text-3xl font-bold">
                Your <span className="text-[#266bf1]">bathroom renovation</span>{" "}
                cost is between:
              </h3>
              <p className="py-4 text-center text-2xl md:text-4xl">
                <span className="font-extrabold text-[#266bf1]">
                  £{formatNumberWithCommas(renovationCost)}
                </span>{" "}
                and{" "}
                <span className="font-extrabold text-[#266bf1]">
                  £{formatNumberWithCommas(renovationCost + 2000)}
                </span>
              </p>
              <p className="text-sm">
                *The above cost is an estimate that includes labour, waste
                removal and building materials (plasterboard, pipes, white
                paint, etc) and excludes bathroom fittings and tiles.
              </p>
              <div className="mt-6 flex justify-center gap-6">
                <Link
                  href="/portfolio"
                  className="cursor-pointer rounded-full border border-[#266bf1] bg-white px-4 py-2 text-center text-base text-black md:px-8 md:py-4"
                >
                  View our work
                </Link>
                <Link
                  href="#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000"
                  className="cursor-pointer rounded-full bg-[#266bf1] px-4 py-2 text-center text-base text-white transition-all duration-200 hover:border-2 hover:border-[#266bf1] hover:bg-white hover:text-black md:px-8 md:py-4"
                >
                  Get a free detailed quote
                </Link>
              </div>
              <ToolsFAQ faqs={faqs} />
            </div>
          </dialog>
        </div>
      </div>
      <PortfolioCardContainer />
      <Features />
      <Testimonials3 />
      <Stats />
      <Guarantee />
      <CustomCTA />
    </div>
  );
};

export default BathroomCalculator;

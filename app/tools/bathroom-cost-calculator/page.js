"use client";

import React from "react";
import { useState } from "react";

import Hero from "../components/Hero";
import CalculatedPrice from "../components/CalculatedPrice";

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

  const prices = {
    baseCost: 5000,
    smallSize: 1.2,
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
      <div className="mx-auto mb-8 max-w-[85%] rounded-xl bg-white px-6 py-6 md:max-w-[70%]">
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
              <h3 className="text-3xl font-bold text-[#266bf1]">
                Your bathroom renovation will cost you between £{renovationCost}{" "}
                and £{renovationCost + 2000}
              </h3>
              <p className="py-4">
                Press ESC key or click on ✕ button to close
              </p>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default BathroomCalculator;

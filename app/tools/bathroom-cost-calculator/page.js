import React from "react";
import Hero from "../components/Hero";

const BathroomCalculator = () => {
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
      <div className="mx-auto mb-8 max-w-[70%] rounded-xl bg-white px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">What size is your bathroom?</h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {sizeRadios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
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
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
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
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
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
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
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
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
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
      </div>
    </div>
  );
};

export default BathroomCalculator;

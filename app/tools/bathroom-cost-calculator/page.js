import React from "react";
import Hero from "../components/Hero";

const BathroomCalculator = () => {
  const radios = [
    {
      name: "Hobby plan",
      description: "For personal or non-commercial projects.",
    },
    {
      name: "Pro plan",
      description: "For team collaboration with advanced features.",
    },
    {
      name: "Enterprise plan",
      description: "For teams with security,and performance needs.",
    },
  ];
  return (
    <div>
      <Hero />
      <div className="mx-auto mb-8 max-w-[85%] rounded-xl bg-white px-6 py-6">
        <div>
          <h2 className="text-2xl font-bold">
            What sort of property is the bathroom in?
          </h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6 space-y-3">
            {radios.map((item, idx) => (
              <li key={idx}>
                <label htmlFor={item.name} className="relative block">
                  <input
                    id={item.name}
                    type="radio"
                    defaultChecked={idx == 1 ? true : false}
                    name="payment"
                    class="peer sr-only"
                  />
                  <div className="w-max cursor-pointer rounded-lg border bg-white p-5 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2">
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

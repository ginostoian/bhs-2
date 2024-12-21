import React from "react";

const Guarantee = () => {
  const stats = [
    {
      data: "2 years",
      desc: "Bathroom fitting and renovation guarantee",
    },
    {
      data: "2 years",
      desc: "Kitchen fitting and renovation guarantee",
    },
    {
      data: "1 years",
      desc: "Painting and decorating guarantee",
    },
    {
      data: "15 years",
      desc: "Extension and loft conversion guarantee",
    },
  ];
  return (
    <section className="max-w-[85%] mx-auto mt-6 rounded-xl py-28 bg-gray-900 relative">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl xl:mx-auto xl:text-center">
          <h3 className="text-white text-3xl font-semibold sm:text-5xl">
            The best workmanship guarantee on the market?
          </h3>
          <p className="mt-6 text-lg text-gray-300">
            We want you to feel confident that we build to last. Our workmanship
            guarantee is top notch and is included with every project.
          </p>
        </div>
        <div className="mt-12">
          <ul className="flex-wrap gap-x-12 gap-y-10 items-center space-y-8 sm:space-y-0 sm:flex xl:justify-center">
            {stats.map((item, idx) => (
              <li
                key={idx}
                className="sm:max-w-[15rem]"
              >
                <h4 className="text-4xl text-white font-semibold">
                  {item.data}
                </h4>
                <p className="mt-3 text-gray-400 font-medium">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="absolute inset-0 max-w-md mx-auto h-80 blur-[118px] sm:h-72"
        style={{
          background:
            "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
        }}
      ></div>
    </section>
  );
};

export default Guarantee;

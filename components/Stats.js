import React from "react";

const Stats = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      title: "Workmanishp guarantee",
      desc: "From bathroom renovations to extensions, our workmanship is guaranteed for up to 10 years, giving you peace of mind and lasting value.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      title: "Insurance protection",
      desc: "We provide comprehensive insurance protection up to £10 million, safeguarding your investment and ensuring your project is in safe hands.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      ),
      title: "Customer service",
      desc: "Try outstanding for a change. Our 5-star rated customer service and Houzz awards for service excellence speak for themselves.",
    },
  ];

  return (
    <section className="">
      <div className="mx-auto max-w-[85%] rounded-xl bg-white px-4 py-14 md:px-8">
        <div className="max-w-xl space-y-3">
          <h3 className="font-semibold text-[#2563eb]">Benefits</h3>
          <p className="text-3xl font-semibold text-gray-800 sm:text-4xl">
            Your Renovation Advantage
          </p>
          <p className="leading-normal">
            Discover the Better Homes Studio advantage: unwavering commitment to
            quality, iron-clad guarantees, and award-winning customer service.
            Your dream renovation starts here.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-x-12 divide-y sm:grid-cols-2 sm:gap-y-8 sm:divide-y-0 lg:grid-cols-3 lg:gap-x-0 lg:divide-x [&>.feature-1]:pl-0">
            {features.map((item, idx) => (
              <li
                key={idx}
                className={`feature-${idx + 1} space-y-3 py-8 sm:py-0 lg:px-12`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border text-[#2563eb]">
                  {item.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h4>
                <p className="leading-normal">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Stats;

import React from "react";
import Image from "next/image";

const Features = () => {
  return (
    <div>
      {/* <!-- Features --> */}
      <div className="max-w-[85%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="aspect-w-16 aspect-h-7">
          <Image
            className="w-full object-cover rounded-xl max-h-[400px] bg-center"
            src="/assets/img/happy-better-homes-studio-clients.webp"
            alt="Features Image"
            width={500}
            height={500}
          />
        </div>

        {/* <!-- Grid --> */}
        <div className="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12 bg-white px-7 py-14 rounded-xl">
          <div className="lg:col-span-1">
            <h2 className="font-bold text-2xl md:text-4xl text-gray-800">
              Our values are aligned with you!
            </h2>
            <p className="mt-2 md:mt-4 text-gray-500 leading-relaxed tracking-wide">
              Construction and renovation projects are inherently complex and
              prone to delays and errors. However, using a company that has your
              best interest at heart, you can minimize risks and turn a
              potentially stressful situation into a rewarding experience.
            </p>
          </div>
          {/* <!-- End Col --> */}

          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
              {/* <!-- Icon Block --> */}
              <div className="flex gap-x-5">
                <svg
                  className="shrink-0 mt-1 size-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    width="18"
                    height="10"
                    x="3"
                    y="11"
                    rx="2"
                  />
                  <circle
                    cx="12"
                    cy="5"
                    r="2"
                  />
                  <path d="M12 7v4" />
                  <line
                    x1="8"
                    x2="8"
                    y1="16"
                    y2="16"
                  />
                  <line
                    x1="16"
                    x2="16"
                    y1="16"
                    y2="16"
                  />
                </svg>
                <div className="grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Transparent pricing
                  </h3>
                  <p className="mt-1 text-gray-600 leading-6 tracking-wide">
                    Our pricing is clear and straightforward – we offer upfront
                    estimates and detailed quotes to ensure you understand every
                    aspect of the cost for our services. No surprises, just
                    honesty and trust.
                  </p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}

              {/* <!-- Icon Block --> */}
              <div className="flex gap-x-5">
                <svg
                  className="shrink-0 mt-1 size-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <div className="grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Long-lasting quality
                  </h3>
                  <p className="mt-1 text-gray-600 leading-6 tracking-wide">
                    Exceptional craftsmanship, attention to detail, and a
                    commitment to perfection in every project. We don’t just
                    meet expectations; we exceed them, delivering results you’ll
                    love for years to come.
                  </p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}

              {/* <!-- Icon Block --> */}
              <div className="flex gap-x-5">
                <svg
                  className="shrink-0 mt-1 size-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <div className="grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Trusted for over 10 years
                  </h3>
                  <p className="mt-1 text-gray-600 leading-6 tracking-wide">
                    For over 10 years, homeowners across London have trusted us
                    to bring their vision to life. Your trust drives our
                    commitment to deliver exceptional quality, reliability, and
                    results that truly feel like home.
                  </p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}

              {/* <!-- Icon Block --> */}
              <div className="flex gap-x-5">
                <svg
                  className="shrink-0 mt-1 size-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                  />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <div className="grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Convenient and hassle free
                  </h3>
                  <p className="mt-1 text-gray-600 leading-6 tracking-wide">
                    We handle all services under one roof, wmaking your project
                    more convenient and saving you time and effort. Planning,
                    design, construction, and finishing touches.
                  </p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}
            </div>
          </div>
          {/* <!-- End Col --> */}
        </div>
        {/* <!-- End Grid --> */}
      </div>
      {/* <!-- End Features --> */}
    </div>
  );
};

export default Features;

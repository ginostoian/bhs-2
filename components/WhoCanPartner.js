import React from "react";
import Image from "next/image";

const WhoCanPartner = () => {
  return (
    // <!-- Features -->
    <div className="mx-auto max-w-[85%] rounded-xl bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* <!-- Grid --> */}
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
          <Image
            className="max-h-[500px] w-full rounded-xl"
            src="/assets/img/all-professionals.webp"
            alt="Features Image"
            width={500}
            height={500}
          />
        </div>
        {/* <!-- End Col --> */}

        <div className="mt-5 sm:mt-10 lg:mt-0">
          <div className="space-y-6 sm:space-y-8">
            {/* <!-- Title --> */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">
                Who can partner with Better Homes Studio?
              </h2>
              <p className="text-gray-500">
                All professionals working in the home services industry are
                welcome to join the Better Homes Studio network. Our agreement
                is beneficial for anyone.
              </p>
            </div>
            {/* <!-- End Title --> */}

            {/* <!-- List --> */}
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Real estate agents
                  </span>
                </div>
              </li>

              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Architects
                  </span>
                </div>
              </li>

              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Interior Designers
                  </span>
                </div>
              </li>

              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Design companies
                  </span>
                </div>
              </li>

              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Property Managers
                  </span>
                </div>
              </li>
              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Landlords
                  </span>
                </div>
              </li>
              <li className="flex gap-x-3">
                <span className="size-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="size-3.5 shrink-0"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div className="grow">
                  <span className="text-sm text-gray-500 sm:text-base">
                    Other building & renovating companies
                  </span>
                </div>
              </li>
            </ul>
            {/* <!-- End List --> */}
          </div>
        </div>
        {/* <!-- End Col --> */}
      </div>
      {/* <!-- End Grid --> */}
    </div>
  );
};

export default WhoCanPartner;

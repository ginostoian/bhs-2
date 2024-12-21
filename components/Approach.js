import React from "react";
import Image from "next/image";

const Approach = () => {
  return (
    <section className="max-w-[85%] mx-auto mb-20">
      {/* <!-- Approach --> */}
      <div className="bg-gray-900 rounded-3xl">
        {/* <!-- Approach --> */}
        <div className="max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
          {/* <!-- Title --> */}
          <div className="max-w-3xl mb-10 lg:mb-14">
            <h2 className="text-white font-semibold text-6xl md:leading-tight mb-6 md:mb-0">
              Our pre-build approach
            </h2>
            <p className="mt-1 text-xl text-neutral-400">
              We have refined our process with you in mind. Our pre-build
              approach ensures you feel confident and informed at every step.
              With a customer-first mindset, we turn your vision into a clear,
              comprehensive, hassle-free plan.
            </p>
          </div>
          {/* <!-- End Title --> */}

          {/* <!-- Grid --> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
            <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
              <Image
                className="w-full object-cover rounded-xl"
                src="/assets/img/couple-consulting-better-homes-studio.webp"
                alt="Features Image"
                width={500}
                height={500}
              />
            </div>
            {/* <!-- End Col --> */}

            {/* <!-- Timeline --> */}
            <div>
              {/* <!-- Heading --> */}
              <div className="mb-4">
                <h3 className="text-[#ff0] text-base font-medium uppercase">
                  Steps
                </h3>
              </div>
              {/* <!-- End Heading --> */}

              {/* <!-- Item --> */}
              <div className="flex gap-x-5 ms-1">
                {/* <!-- Icon --> */}
                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                  <div className="relative z-10 size-8 flex justify-center items-center">
                    <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-base uppercase rounded-full">
                      1
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pt-0.5 pb-8 sm:pb-12">
                  <p className="text-base lg:text-xl text-neutral-400">
                    <span className="text-white">
                      Initial Consultation:{"  "}
                    </span>
                    We begin with a friendly call to discuss your project,
                    understand your needs, and align our expertise with your
                    vision.
                  </p>
                </div>
                {/* <!-- End Right Content --> */}
              </div>
              {/* <!-- End Item --> */}

              {/* <!-- Item --> */}
              <div className="flex gap-x-5 ms-1">
                {/* <!-- Icon --> */}
                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                  <div className="relative z-10 size-8 flex justify-center items-center">
                    <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-base uppercase rounded-full">
                      2
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pt-0.5 pb-8 sm:pb-12">
                  <p className="text-base lg:text-xl text-neutral-400">
                    <span className="text-white">
                      Preliminary Estimate:{"  "}
                    </span>
                    Using photos, emails, and listings, we provide an initial
                    estimate to give you a clear starting point with no
                    surprises.
                  </p>
                </div>
                {/* <!-- End Right Content --> */}
              </div>
              {/* <!-- End Item --> */}

              {/* <!-- Item --> */}
              <div className="flex gap-x-5 ms-1">
                {/* <!-- Icon --> */}
                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                  <div className="relative z-10 size-8 flex justify-center items-center">
                    <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-base uppercase rounded-full">
                      3
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pt-0.5 pb-8 sm:pb-12">
                  <p className="text-base lg:text-xl text-neutral-400">
                    <span className="text-white">On-Site Meeting:{"  "}</span>
                    Once you are happy with the initial discussions, we schedule
                    an on-site meeting to finalize details, assess your space,
                    and align with your expectations.
                  </p>
                </div>
                {/* <!-- End Right Content --> */}
              </div>
              {/* <!-- End Item --> */}

              {/* <!-- Item --> */}
              <div className="flex gap-x-5 ms-1">
                {/* <!-- Icon --> */}
                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                  <div className="relative z-10 size-8 flex justify-center items-center">
                    <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-base uppercase rounded-full">
                      4
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pt-0.5 pb-8 sm:pb-12">
                  <p className="text-base lg:text-xl text-neutral-400">
                    <span className="text-white">
                      Final Quote & Next Steps:{"  "}
                    </span>
                    After gathering all the details, we provide a final quote so
                    you can move forward confidently, knowing exactly what to
                    expect.
                  </p>
                </div>
                {/* <!-- End Right Content --> */}
              </div>
              {/* <!-- End Item --> */}

              <a
                className="group inline-flex items-center gap-x-2 py-2 px-8 bg-[#ff0] font-medium text-xl text-neutral-800 rounded-full focus:outline-none"
                href="#"
              >
                <svg
                  className="shrink-0 size-4"
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  <path
                    className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:delay-100 transition"
                    d="M14.05 2a9 9 0 0 1 8 7.94"
                  ></path>
                  <path
                    className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition"
                    d="M14.05 6A5 5 0 0 1 18 10"
                  ></path>
                </svg>
                Schedule a call
              </a>
            </div>
            {/* <!-- End Timeline --> */}
          </div>
          {/* <!-- End Grid --> */}
        </div>
      </div>
      {/* <!-- End Approach --> */}
    </section>
  );
};

export default Approach;

import React from "react";
import Image from "next/image";

const Approach = () => {
  return (
    <section className="mx-auto mb-20 max-w-[85%]">
      {/* <!-- Approach --> */}
      <div className="rounded-3xl bg-gray-900">
        {/* <!-- Approach --> */}
        <div className="mx-auto max-w-5xl px-4 py-10 lg:pb-20 lg:pt-20 xl:px-0">
          {/* <!-- Title --> */}
          <div className="mb-10 max-w-3xl lg:mb-14">
            <h2 className="mb-6 text-6xl font-semibold text-white md:mb-0 md:leading-tight">
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
              <Image
                className="w-full rounded-xl object-cover"
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
                <h3 className="text-base font-medium uppercase text-[#ff0]">
                  Steps
                </h3>
              </div>
              {/* <!-- End Heading --> */}

              {/* <!-- Item --> */}
              <div className="ms-1 flex gap-x-5">
                {/* <!-- Icon --> */}
                <div className="relative after:absolute after:bottom-0 after:start-4 after:top-8 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800 last:after:hidden">
                  <div className="size-8 relative z-10 flex items-center justify-center">
                    <span className="size-8 flex shrink-0 items-center justify-center rounded-full border border-neutral-800 text-base font-semibold uppercase text-[#ff0]">
                      1
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pb-8 pt-0.5 sm:pb-12">
                  <p className="text-base text-neutral-400 lg:text-xl">
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
              <div className="ms-1 flex gap-x-5">
                {/* <!-- Icon --> */}
                <div className="relative after:absolute after:bottom-0 after:start-4 after:top-8 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800 last:after:hidden">
                  <div className="size-8 relative z-10 flex items-center justify-center">
                    <span className="size-8 flex shrink-0 items-center justify-center rounded-full border border-neutral-800 text-base font-semibold uppercase text-[#ff0]">
                      2
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pb-8 pt-0.5 sm:pb-12">
                  <p className="text-base text-neutral-400 lg:text-xl">
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
              <div className="ms-1 flex gap-x-5">
                {/* <!-- Icon --> */}
                <div className="relative after:absolute after:bottom-0 after:start-4 after:top-8 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800 last:after:hidden">
                  <div className="size-8 relative z-10 flex items-center justify-center">
                    <span className="size-8 flex shrink-0 items-center justify-center rounded-full border border-neutral-800 text-base font-semibold uppercase text-[#ff0]">
                      3
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pb-8 pt-0.5 sm:pb-12">
                  <p className="text-base text-neutral-400 lg:text-xl">
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
              <div className="ms-1 flex gap-x-5">
                {/* <!-- Icon --> */}
                <div className="relative after:absolute after:bottom-0 after:start-4 after:top-8 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800 last:after:hidden">
                  <div className="size-8 relative z-10 flex items-center justify-center">
                    <span className="size-8 flex shrink-0 items-center justify-center rounded-full border border-neutral-800 text-base font-semibold uppercase text-[#ff0]">
                      4
                    </span>
                  </div>
                </div>
                {/* <!-- End Icon --> */}

                {/* <!-- Right Content --> */}
                <div className="grow pb-8 pt-0.5 sm:pb-12">
                  <p className="text-base text-neutral-400 lg:text-xl">
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
                className="group inline-flex items-center gap-x-2 rounded-full bg-[#ff0] px-8 py-2 text-xl font-medium text-neutral-800 focus:outline-none"
                href="#"
              >
                <svg
                  className="size-4 shrink-0"
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
                    className="opacity-0 transition group-hover:opacity-100 group-hover:delay-100 group-focus:opacity-100"
                    d="M14.05 2a9 9 0 0 1 8 7.94"
                  ></path>
                  <path
                    className="opacity-0 transition group-hover:opacity-100 group-focus:opacity-100"
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

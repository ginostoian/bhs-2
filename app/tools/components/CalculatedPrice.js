import React from "react";

const CalculatedPrice = ({ price }) => {
  return (
    <div
      id="hs-task-created-alert"
      class="hs-overlay size-full fixed start-0 top-0 z-[80] hidden overflow-y-auto overflow-x-hidden"
      role="dialog"
      tabindex="-1"
      aria-labelledby="hs-task-created-alert-label"
    >
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 m-3 mt-0 opacity-0 transition-all ease-out sm:mx-auto sm:w-full sm:max-w-lg">
        <div class="relative flex flex-col rounded-xl bg-white shadow-lg dark:bg-neutral-900">
          <div class="absolute end-2 top-2">
            <button
              type="button"
              class="size-8 inline-flex items-center justify-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600"
              aria-label="Close"
              data-hs-overlay="#hs-task-created-alert"
            >
              <span class="sr-only">Close</span>
              <svg
                class="size-4 shrink-0"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto p-4 text-center sm:p-10">
            {/* <!-- Icon --> */}
            <span class="size-[46px] mb-4 inline-flex items-center justify-center rounded-full border-4 border-green-50 bg-green-100 text-green-500 dark:border-green-600 dark:bg-green-700 dark:text-green-100">
              <svg
                class="size-5 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
              </svg>
            </span>
            {/* <!-- End Icon --> */}

            <h3
              id="hs-task-created-alert-label"
              class="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200"
            >
              Task successfully created!
            </h3>
            <p class="text-gray-500 dark:text-neutral-500">
              You can see the progress of your task in your{" "}
              <a
                class="inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-none dark:text-blue-500"
                href="#"
              >
                personal account.
              </a>{" "}
              You will be notified of its completion.
            </p>

            <div class="mt-6 flex justify-center gap-x-4">
              <button
                type="button"
                class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                data-hs-overlay="#hs-task-created-alert"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatedPrice;

"use client";

import { useState, useEffect, useRef } from "react";

// List of features to display:
// - name: name of the feature
// - description: description of the feature (can be any JSX)
// - svg: icon of the feature
const features = [
  {
    name: "Client experience",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Excellent communication",
            "Upfront pricing",
            "Honest timelines",
            "Willingness to address client concerns",
            "Minimizing disruption to clients' lives, when possible",
            "Excellent workmanship guarantees - up to 10 years",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>

              {item}
            </li>
          ))}
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
        />
      </svg>
    ),
  },
  {
    name: "Project management",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Dedicated project manager",
            "Full office staff",
            "Automated sitemap generation to fasten Google indexing",
            "Project Management Tools",
            "Professional help and advice when needed",
            "In-house interior designers",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>

              {item}
            </li>
          ))}
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    name: "Services",
    description: (
      <>
        <ul className="space-y-1 flex flex-wrap gap-5 justify-center">
          {[
            "Interior design",
            "Bathroom renovation",
            "Kitchen renovation",
            "Home renovation",
            "House extension",
            "Loft conversion",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1 max-w-[40%]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>

              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent font-medium">
            Being a full service renovation company, we will save you the time
            and hassle of managing multiple contractors on one project.
          </li>
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
        />
      </svg>
    ),
  },
  {
    name: "Payments",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "We never request upfront payments",
            "Small deposit required to book availability",
            "Manageable weekly payments",
            "Last payment always paid after snagging",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>

              {item}
            </li>
          ))}
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
  },
  {
    name: "Quotes",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Quotes are always free",
            "Quotes are always detailed",
            "If it is not in there, we won't do it",
            "If it is in there, it will always get done",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] inline shrink-0 opacity-80"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>

              {item}
            </li>
          ))}
        </ul>
      </>
    ),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
        />
      </svg>
    ),
  },
];

// A list of features with a listicle style.
// - Click on a feature to display its description.
// - Good to use when multiples features are available.
// - Autoscroll the list of features (optional).
const FeaturesListicle = () => {
  const featuresEndRef = useRef(null);
  const [featureSelected, setFeatureSelected] = useState(features[0].name);
  const [hasClicked, setHasClicked] = useState(false);

  // (Optional) Autoscroll the list of features so user know it's interactive.
  // Stop scrolling when user scroll after the featuresEndRef element (end of section)
  // emove useEffect is not needed.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasClicked) {
        const index = features.findIndex(
          (feature) => feature.name === featureSelected
        );
        const nextIndex = (index + 1) % features.length;
        setFeatureSelected(features[nextIndex].name);
      }
    }, 5000);

    try {
      // stop the interval when the user scroll after the featuresRef element
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log("STOP AUTO CHANGE");
            clearInterval(interval);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      if (featuresEndRef.current) {
        observer.observe(featuresEndRef.current);
      }
    } catch (e) {
      console.error(e);
    }

    return () => clearInterval(interval);
  }, [featureSelected, hasClicked]);

  return (
    <section
      container
      className="container box-shadow py-12 my-10 rounded-2xl bg-white"
      id="features"
    >
      <div className="text-center w-full mx-auto">
        <div className="max-md:px-8 mx-4">
          <p className="text-accent font-medium text-sm font-mono mb-3">
            There is a better way
          </p>
          <h2 className="text-base-content/90 font-extrabold text-3xl lg:text-5xl mb-8">
            {/* 💡 COPY TIP: Remind visitors about the value of your product. Why do they need it? */}
            Don&apos;t be a statistic! Get your project on track now.
          </h2>
          <div className="text-base-content/90 leading-relaxed mb-8 lg:text-lg lg:pl-20 lg:pr-20 lg:max-w-6xl lg:mx-auto">
            {/* 💡 COPY TIP: Explain how your product delivers what you promise in the headline. */}
            Construction and renovation projects are inherently complex and
            prone to delays and errors. However, with careful planning and
            management, you can minimize risks and turn a potentially stressful
            situation into a rewarding experience.
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-4 md:flex justify-center gap-10 md:gap-12 max-md:px-8 text-center w-full mx-auto mb-8">
          {features.map((feature) => (
            <span
              key={feature.name}
              onClick={() => {
                if (!hasClicked) setHasClicked(true);
                setFeatureSelected(feature.name);
              }}
              className={`flex flex-col items-center justify-center gap-3 select-none cursor-pointer p-2 duration-200 group`}
            >
              <span
                className={`duration-100 ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-base-content/50 group-hover:text-base-content/80"
                }`}
              >
                {feature.svg}
              </span>
              <span
                className={`font-semibold text-sm ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-base-content/60"
                }`}
              >
                {feature.name}
              </span>
            </span>
          ))}
        </div>
        <div className="">
          <div className=" w-full mx-auto flex flex-col md:flex-row justify-center md:items-center gap-12">
            <div
              className="text-base-content/90 leading-relaxed space-y-4 px-12 md:px-0 py-12 max-w-xl animate-opacity"
              key={featureSelected}
            >
              <h3 className="font-semibold text-base-content text-lg">
                {features.find((f) => f.name === featureSelected)["name"]}
              </h3>

              {features.find((f) => f.name === featureSelected)["description"]}
            </div>
          </div>
        </div>
      </div>
      {/* Just used to know it's the end of the autoscroll feature (optional, see useEffect) */}
      <p
        className="opacity-0"
        ref={featuresEndRef}
      ></p>
    </section>
  );
};

export default FeaturesListicle;

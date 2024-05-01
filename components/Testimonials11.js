"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import config from "@/config";

// Use this object to add an icon to the testimonial (optional) like the Product Hunt logo for instance. Only change the values if you add more referrings sites (currently Twitter & Product Hunt)
const refTypes = {
  productHunt: {
    id: "product_hunt",
    ariaLabel: "See user review on Product Hunt",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </svg>
    ),
  },
  twitter: {
    id: "twitter",
    ariaLabel: "See user post on Twitter",
    svg: (
      <svg
        className="w-3 h-3 fill-[#00aCee]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
      </svg>
    ),
  },
  video: {
    id: "video",
  },
  other: { id: "other" },
};

// The list of your testimonials. It needs 11 items to fill the grid. The last one (11th) is featured on large devices (span 2 columns + big font)
const list = [
  {
    // Optional, use for social media like Twitter. Does not link anywhere but cool to display
    username: "louise",
    // REQUIRED
    name: "Louise Thorogood",
    // REQUIRED
    text: "I could not recommend them more highly. The whole process was so streamlined and efficient. They submitted a very detailed quote which was competitively priced, and went onto do the work very quickly to a high standard. ",
    // REQUIRED — use refTypes.other if you don't want to display an icon
    type: refTypes.productHunt,
    // Optional, link to the person's testimonial. It's more trustable
    link: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
    // Optional, a statically imported image (usually from your public folder—recommended) or a link to the person's avatar. Shows a fallback letter if not provided
    img: "",
    // You can display video testimonials to build more trust. Just swap the type above to "video" and add at least the video source below
    // videoSrc: "/jack.mp4"
  },
  {
    name: "Melina",
    text: `I couldn’t be happier with my kitchen and bathroom renovation.
The better homes studio managed to bring my vision to life, I still can’t believe it is the same house...`,
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2008037/better-homes-studio-review",
  },
  {
    name: "Shyra Muthusamy",
    text: "The quality of workmanship is extremely high and they have managed to translate loose ideas out together on PowerPoint by me into reality.",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
  {
    name: "Donovan",
    text: "The entirety of the work was executed to the utmost standard of excellence. Celli oversees a team comprising highly skilled craftsmen...",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2018228/better-homes-studio-review",
  },
  {
    username: "perrine_l",
    name: "Perrine LeGoanvic",
    text: "I came across Better Homes Studio through Houzz as I needed to fully renovate my first flat and I could honestly not recommend them enough.",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/1829290/better-homes-studio-review",
  },
  {
    name: "Lawrance and Kate",
    text: "We worked with Gino to make our dream bathroom into a reality. This was our first renovation project in our first home, so we were quite nervous about the process, but Gino and his team made it really smooth.",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
  },
  {
    name: "Phil",
    text: "My house, which is more than a century old, was magnificently restored by Better Homes Studio. They did an exceptional job,",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2006566/better-homes-studio-review",
  },
  {
    name: "Marc Lou",
    text: "This team is exactly what I didn't even know I needed.",
    videoPoster: "https://d1wkquwg5s1b04.cloudfront.net/demo/marcPoster.jpg",
    videoSrc: "https://d1wkquwg5s1b04.cloudfront.net/demo/marcVideo.mp",
    videoHeight: 250,
    videoWidth: 500,
    videoType: "video/mp4",
    type: refTypes.video,
  },
  {
    name: "HU-36197023",
    username: "HU-36197023",
    text: "We have now worked with Celli, Gino and the team twice, once for a major renovation and once for some minor but important work, and both times we have been absolutely delighted with the service that they have provided.",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2008039/better-homes-studio-review",
  },
  {
    name: "Knutt",
    text: "The team holds themselves to high standards, and we couldn't be happier with the top-notch quality of the end result.",
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2024469/better-homes-studio-review",
  },
  // The last testimonial is featured on big devices (span 2 columns + big font) 👇
  {
    name: "George G",
    text: `After checking out loads of loft conversion companies in North East London, we finally decided to go with Better Homes Studio for our hip to gable loft conversion.
Just a couple of months after our first chat with Gino, we've got an amazing loft conversion, all done and dusted in just 9 weeks, just like they promised from the get-go.
`,
    type: refTypes.productHunt,
    link: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  },
];

// A single testimonial, to be rendered in  a list
const Testimonial = ({ i }) => {
  const testimonial = list[i];

  if (!testimonial) return null;

  if (testimonial.type === refTypes.video) {
    return <VideoTestimonial i={i} />;
  }

  return (
    <li key={i}>
      <figure className="relative h-full p-6 bg-base-100 rounded-lg">
        <blockquote className="relative">
          <p className="text-sm text-base-content/80">{testimonial.text}</p>
        </blockquote>
        <figcaption className="relative flex items-center justify-start gap-4 pt-4 mt-4 border-t border-base-content/5">
          <div className="overflow-hidden rounded-full bg-base-300 shrink-0">
            {testimonial.img ? (
              <Image
                className="w-10 h-10 rounded-full object-cover"
                src={list[i].img}
                alt={`${list[i].name}'s testimonial for ${config.appName}`}
                width={48}
                height={48}
              />
            ) : (
              <span className="w-10 h-10 rounded-full flex justify-center items-center text-lg font-medium bg-base-300">
                {testimonial.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="w-full flex items-end justify-between gap-2">
            <div>
              <div className="text-sm font-medium text-base-content">
                {testimonial.name}
              </div>
              {testimonial.username && (
                <div className="mt-0.5 text-sm text-base-content/80">
                  @{testimonial.username}
                </div>
              )}
            </div>

            {testimonial.link && testimonial.type?.svg && (
              <a
                href={testimonial.link}
                target="_blank"
                className="shrink-0 "
                aria-label={testimonial.type?.ariaLabel}
              >
                {testimonial.type?.svg}
              </a>
            )}
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

// A video tesionial to build trust. 2 or 3 on a wall of love is perfect.
const VideoTestimonial = ({ i }) => {
  const vidRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vidRef.current?.readyState != 0) {
      setIsLoading(false);
    }
  }, [vidRef?.current?.readyState]);

  const handlePlayVideo = () => {
    if (isPlaying) {
      vidRef.current.pause();
      setIsPlaying(false);
    } else {
      vidRef.current.play();
      setIsPlaying(true);

      if (vidRef.current?.readyState === 0) setIsLoading(true);
    }
  };

  const testimonial = list[i];

  if (!testimonial) return null;

  return (
    <li
      key={i}
      className="break-inside-avoid max-md:flex justify-center bg-base-100 rounded-lg overflow-hidden flex flex-col"
    >
      <div className="relative w-full">
        {isLoading && (
          <span className="z-40 !h-24 !w-24 !bg-gray-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-ring"></span>
        )}
        <video
          className="w-full"
          ref={vidRef}
          poster={testimonial.videoPoster}
          preload="metadata"
          playsInline
          width={testimonial.videoWidth}
          height={testimonial.videoHeight}
          onLoadedData={() => {
            console.log("Video is loaded!");
            setIsLoading(false);
          }}
        >
          <source
            src={testimonial.videoSrc}
            type={testimonial.videoType || "video/mp4"}
          />
          Your browser does not support the videos
        </video>

        {!isPlaying && (
          <div className="absolute bottom-0 -inset-x-4 bg-gray-900/50 blur-lg h-24 translate-y-1/4 animate-opacity"></div>
        )}

        <div className="absolute w-full bottom-0 z-20">
          <div className="flex justify-between items-end p-4">
            <button
              className="group cursor-pointer"
              type="button"
              title="Play video"
              aria-label="Play video"
              onClick={handlePlayVideo}
            >
              {isPlaying ? (
                // PAUSE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className=" w-14 h-14 fill-gray-50 group-hover:scale-[1.05] duration-100 ease-in drop-shadow-lg animate-opacity"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // PLAY
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-14 h-14 fill-gray-50 group-hover:scale-[1.05] duration-100 ease-in drop-shadow-lg animate-opacity"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {!isPlaying && (
              <div className="animate-opacity text-right">
                <p className="text-gray-50 font-medium drop-shadow">
                  {testimonial.name}
                </p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-accent drop-shadow"
                      key={i}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-accent text-accent-content text-base leading-tight font-medium p-4 select-none">
        <p>&quot;{testimonial.text}&quot;</p>
      </div>
    </li>
  );
};

const Testimonials11 = () => {
  return (
    <section
      className="bg-base-200"
      id="testimonials"
    >
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <div className="mb-8">
            <h2 className="sm:text-5xl text-4xl font-extrabold text-[#100b47]">
              Hundreds of clients are thrilled about their new homes!
            </h2>
          </div>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-base-content/80">
            Don&apos;t take our word for it. Here&apos;s what they have to say
            about {config.appName}.
          </p>
        </div>

        <ul
          role="list"
          className="grid max-w-2xl grid-cols-1 gap-6 mx-auto sm:gap-8 md:grid-cols-2 lg:max-w-none lg:grid-cols-4"
        >
          <li>
            <ul
              role="list"
              className="flex flex-col gap-y-6 sm:gap-y-8"
            >
              {[...Array(3)].map((e, i) => (
                <Testimonial
                  key={i}
                  i={i}
                />
              ))}
            </ul>
          </li>

          <li className="hidden md:grid order-none md:order-first lg:order-none col-span-2 grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* BIG FEATURED TESTIMONIAL — THE LAST ONE IN THE LIST (11th) */}
            <ul className="col-span-2">
              <li>
                <figure className="relative h-full p-6 bg-base-100 rounded-lg">
                  <blockquote className="relative p-4">
                    <p className="text-lg font-medium text-base-content">
                      {list[list.length - 1].text}
                    </p>
                  </blockquote>
                  <figcaption className="relative flex items-center justify-start gap-4 pt-4 mt-4 border-t border-base-content/5">
                    <div className="overflow-hidden rounded-full bg-base-300 shrink-0">
                      {list[list.length - 1].img ? (
                        <Image
                          className="w-12 h-12 rounded-full object-cover"
                          src={list[list.length - 1].img}
                          alt={`${
                            list[list.length - 1].name
                          }'s testimonial for ${config.appName}`}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <span className="w-12 h-12 rounded-full flex justify-center items-center text-xl font-medium bg-base-300">
                          {list[list.length - 1].name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-base font-medium text-base-content">
                        {list[list.length - 1].name}
                      </div>
                      {list[list.length - 1].username && (
                        <div className="mt-1 text-base text-base-content/80">
                          @{list[list.length - 1].username}
                        </div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </li>
            </ul>
            <ul
              role="list"
              className="flex flex-col gap-y-6 sm:gap-y-8"
            >
              {[...Array(2)].map((e, i) => (
                <Testimonial
                  key={i}
                  i={i + 3}
                />
              ))}
            </ul>
            <ul
              role="list"
              className="flex flex-col gap-y-6 sm:gap-y-8"
            >
              {[...Array(2)].map((e, i) => (
                <Testimonial
                  key={i}
                  i={i + 5}
                />
              ))}
            </ul>
          </li>
          <li>
            <ul
              role="list"
              className="flex flex-col gap-y-6 sm:gap-y-8"
            >
              {[...Array(3)].map((e, i) => (
                <Testimonial
                  key={i}
                  i={i + 7}
                />
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Testimonials11;

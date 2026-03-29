import Link from "next/link";

const testimonials = [
  {
    name: "George G",
    quote:
      "After checking out loads of loft conversion companies in North East London, we finally decided to go with Better Homes Studio. We got an amazing hip-to-gable loft conversion, all done and dusted in just 9 weeks, just like they promised from the get-go.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
    outcome: "Hip-to-gable loft in 9 weeks",
    featured: true,
  },
  {
    name: "Louise Thorogood",
    quote:
      "I could not recommend them more highly. The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
    outcome: "Detailed quote and smooth delivery",
  },
  {
    name: "Perrine LeGoanvic",
    quote:
      "I came across Better Homes Studio through Houzz as I needed to fully renovate my first flat and I could honestly not recommend them enough.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1829290/better-homes-studio-review",
    outcome: "Trusted for a first-home renovation",
  },
  {
    name: "Lawrance and Kate",
    quote:
      "This was our first renovation project in our first home, so we were quite nervous about the process, but Gino and his team made it really smooth.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
    outcome: "Made a first renovation feel manageable",
  },
];

const platformPills = [
  "Google 5 Stars",
  "My Builder 5 Stars",
  "Best of Houzz Award",
];

const HomepageTestimonialStrip = () => {
  const featuredTestimonial =
    testimonials.find((testimonial) => testimonial.featured) || testimonials[0];
  const supportingTestimonials = testimonials.filter(
    (testimonial) => testimonial.name !== featuredTestimonial.name
  );

  return (
    <section id="testimonials" className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#266bf1]">
              Reviews
            </p>
            <h2 className="max-w-2xl text-4xl font-black text-[#100b47] md:text-6xl md:leading-tight">
              Real reviews with specifics, not vague praise
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
              The strongest testimonials talk about what homeowners actually
              care about: trust, communication, timing, and whether the final
              result felt worth it.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {platformPills.map((pill) => (
                <div
                  key={pill}
                  className="inline-flex items-center rounded-full border border-[#d8e4fb] bg-white px-4 py-2 text-sm font-semibold text-[#100b47] shadow-sm"
                >
                  {pill}
                </div>
              ))}
            </div>

            <article className="mt-8 rounded-2xl border border-[#d5e0f8] bg-white p-6 shadow-sm lg:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                  {featuredTestimonial.outcome}
                </span>
                <span className="rounded-full border border-[#d8e4fb] px-3 py-1 text-xs font-semibold text-gray-600">
                  {featuredTestimonial.sourceLabel}
                </span>
              </div>

              <div className="mb-4 text-6xl font-black leading-none text-[#dce8ff]">
                &ldquo;
              </div>
              <blockquote className="-mt-7 text-xl leading-9 text-[#2f3c52] md:text-2xl">
                {featuredTestimonial.quote}
              </blockquote>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-5">
                <div>
                  <p className="font-bold text-[#100b47]">
                    {featuredTestimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Verified {featuredTestimonial.sourceLabel.toLowerCase()}
                  </p>
                </div>
                <Link
                  href={featuredTestimonial.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                >
                  Read review
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          </div>

          <div className="grid gap-5">
            {supportingTestimonials.map((testimonial) => {
              const isExternal = testimonial.sourceUrl.startsWith("http");

              return (
                <article
                  key={testimonial.name}
                  className="relative overflow-hidden rounded-2xl border border-[#d5e0f8] bg-white p-5 shadow-sm"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#266bf1] via-[#6da2ff] to-[#bfd7ff]" />
                  <div className="mb-4 flex flex-wrap items-center gap-2 pt-2">
                    <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                      {testimonial.outcome}
                    </span>
                  </div>

                  <blockquote className="text-base leading-8 text-gray-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-4">
                    <div>
                      <p className="font-bold text-[#100b47]">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.sourceLabel}</p>
                    </div>
                    <Link
                      href={testimonial.sourceUrl}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                    >
                      Read
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageTestimonialStrip;

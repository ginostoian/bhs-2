const HomepageTimeline = ({ steps }) => {
  return (
    <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="overflow-hidden rounded-2xl bg-[#100b47] px-6 py-10 text-white md:px-10 lg:px-12 lg:py-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#8fb6ff]">
            Process
          </p>
          <h2 className="text-4xl font-black md:text-5xl">
            One clear process from first call to final handover
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#d6def6]">
            You always know what happens next, what you are paying for, and who
            is accountable from day one to handover.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#9ec1ff]">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#d6def6]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageTimeline;

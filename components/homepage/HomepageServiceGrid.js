import Image from "next/image";
import Link from "next/link";

const HomepageServiceGrid = ({ services }) => {
  return (
    <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#266bf1]">
          Services
        </p>
        <h2 className="text-4xl font-black text-[#100b47] md:text-6xl md:leading-tight">
          Choose the right route into your project
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 md:text-xl">
          Whether you want more space, a better layout, or a full reset of your
          home, start with the service that fits the result you want.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            className="group overflow-hidden rounded-2xl border border-[#d5e0f8] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-[240px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-[#100b47] shadow-sm">
                {service.price}
              </div>
            </div>

            <div className="flex h-full flex-col p-6">
              <h3 className="text-2xl font-extrabold text-[#100b47]">
                {service.title}
              </h3>
              <p className="mt-3 min-h-[56px] text-base leading-7 text-gray-600">
                {service.description}
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#266bf1]">
                {service.kicker}
              </p>

              <div className="mt-6">
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[#bfd3f9] bg-[#f5f9ff] px-5 py-3 text-sm font-bold text-[#266bf1] transition hover:border-[#266bf1] hover:bg-[#266bf1] hover:text-white"
                >
                  Explore service
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomepageServiceGrid;

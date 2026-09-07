import Link from "next/link";

export default function AreasServed({
  groups,
  title = "Renovation services across our London delivery patch",
  description = "Explore local service information for the neighbourhoods where we regularly assess and deliver projects.",
  id = "areas",
}) {
  return (
    <section id={id} className="scroll-mt-24 mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-[#4D5B4B]">Areas we serve</p>
        <h2 className="text-3xl font-medium leading-tight text-[#202925] md:text-5xl">{title}</h2>
        <p className="mt-5 text-lg leading-8 text-gray-700">{description}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map((group) => (
          <article key={group.regionTitle} className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-medium text-[#202925]">{group.regionTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">{group.regionDescription}</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1">
              {group.locations.map((location) => (
                <li key={location.slug} className="border-t border-[#edf2fc] py-3">
                  <Link href={`/locations/${location.slug}`} className="text-sm font-bold text-[#4D5B4B] hover:text-[#3E4A3C] hover:underline">
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

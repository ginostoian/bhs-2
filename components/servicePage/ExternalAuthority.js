import { ExternalLink } from "lucide-react";

export default function ExternalAuthority({ title, description, links }) {
  return (
    <aside className="mx-auto max-w-[88%] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="rounded-2xl border border-[#d9e5fb] bg-[#f8fbff] p-6 md:p-8">
        <h2 className="text-2xl font-black text-[#100b47]">{title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-gray-700">{description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#bfd3f9] bg-white px-5 text-sm font-bold text-[#266bf1] transition hover:border-[#266bf1] hover:text-[#1449B0]"
            >
              {link.label}
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

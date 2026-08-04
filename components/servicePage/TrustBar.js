import { BadgeCheck, House, MessageCircle, ShieldCheck } from "lucide-react";

const icons = [ShieldCheck, BadgeCheck, House, MessageCircle];

export default function TrustBar({ items }) {
  return (
    <section aria-label="Why homeowners trust Better Homes" className="border-y border-[#d7e3f8] bg-white">
      <div className="mx-auto grid max-w-[94rem] gap-px bg-[#d7e3f8] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <div key={item.headline} className="flex gap-4 bg-white px-5 py-6 sm:px-8">
              <Icon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-[#266bf1]" strokeWidth={1.8} />
              <div>
                <h2 className="text-base font-black text-[#100b47]">{item.headline}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{item.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

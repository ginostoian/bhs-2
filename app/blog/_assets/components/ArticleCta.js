import Link from "next/link";
import { BOOKING_URL } from "@/libs/booking";

// In-flow call to action placed after an article's opening answer, so mobile readers
// reach a next step without scrolling the whole guide.
export default function ArticleCta({
  title,
  text,
  primary,
  secondary = { href: BOOKING_URL, label: "Book a 20-minute call" },
  placement = "after-answer",
}) {
  return (
    <aside
      className="my-8 rounded-2xl border border-[#4D5B4B]/25 bg-white p-6 md:p-7"
      data-cta-placement={placement}
    >
      <p className="mb-2 text-lg font-semibold text-[#202925]">{title}</p>
      <p className="mb-5 leading-relaxed text-base-content/80">{text}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href={primary.href}
          className="rounded-full bg-[#4D5B4B] px-5 py-3 text-sm font-medium text-white no-underline"
        >
          {primary.label}
        </Link>
        <Link
          href={secondary.href}
          className="text-sm font-medium text-[#4D5B4B] underline underline-offset-4"
        >
          {secondary.label}
        </Link>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function SectionNav({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.anchorId ?? "");

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.anchorId))
      .filter(Boolean);

    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: [0, 0.1, 0.35] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-30 mb-8 border-b border-[#d7e3f8] bg-white/95 backdrop-blur lg:mb-12"
    >
      <div className="mx-auto flex max-w-[94rem] gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-12 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = activeId === item.anchorId;

          return (
            <a
              key={item.anchorId}
              href={`#${item.anchorId}`}
              aria-current={isActive ? "location" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D5B4B] ${
                isActive
                  ? "bg-[#202925] text-white"
                  : "text-[#334155] hover:bg-[#eef5ff] hover:text-[#202925]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

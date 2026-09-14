"use client";
import Link from "next/link";
import { hasPage } from "@/libs/route-patterns";
import { usePathname } from "next/navigation";
const labels = {
  "house-extension": "House extensions",
  "loft-conversion": "Loft conversions",
  "general-renovation": "Whole-home renovations",
  "kitchen-renovation": "Kitchen renovations",
  "bathroom-renovation": "Bathroom renovations",
  "basement-conversion": "Basement conversions",
  portfolio: "Our work",
  blog: "Blog",
  dashboard: "Client portal",
  admin: "Administration",
  auth: "Account",
  signin: "Sign in",
  tos: "Terms",
  faq: "FAQs",
  crm: "CRM",
  btu: "BTU",
  pdf: "PDF",
};
const noIndexSegments = new Set([
  "quotes",
  "invoices",
  "gantt",
  "auth",
  "admin",
  "dashboard",
  "designer",
  "employee",
  "referrer",
]);
export function breadcrumbItems(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const items = [{ label: "Home", href: "/" }];
  segments.forEach((part, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    let label =
      labels[part] ||
      (/[a-f0-9]{20,}/i.test(part)
        ? "Details"
        : decodeURIComponent(part)
            .replace(/-/g, " ")
            .replace(/^./, (x) => x.toUpperCase())
            .replace(
              /\b([enws]{1,2})([0-9]{1,2})\b/gi,
              (_, area, n) => area.toUpperCase() + n,
            ));
    // These grouping segments have no page of their own.
    const groupOnly = ["/blog/author", "/blog/category"].includes(href) || !hasPage(href);
    if (i === 0 && part.endsWith("calculator"))
      items.push({ label: "Cost planning", href: "/tools" });
    items.push({ label, href: groupOnly ? null : href });
  });
  return items;
}
export default function Breadcrumbs({
  items: supplied,
  schema = true,
  contained = true,
}) {
  const path = usePathname();
  const items = supplied || breadcrumbItems(path);
  const publicPage =
    !noIndexSegments.has(path.split("/")[1]) &&
    !path.startsWith("/catalogue/share");
  return (
    <nav
      className={`bh-breadcrumbs ${contained ? "bh-wrap" : ""}`}
      aria-label="Breadcrumb"
    >
      <ol>
        {items.map((x, i) => (
          <li key={i}>
            {i === items.length - 1 || !x.href ? (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>
                {x.label}
              </span>
            ) : (
              <Link href={x.href}>{x.label}</Link>
            )}
          </li>
        ))}
      </ol>
      {schema && publicPage && items.length > 1 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: items
                .filter((x) => x.href)
                .map((x, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: x.label,
                  item: `https://bhstudio.co.uk${x.href}`,
                })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
    </nav>
  );
}

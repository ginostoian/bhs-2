import Link from "next/link";
import Image from "next/image";
const groups = [
  [
    "Services",
    [
      ["Extensions", "/house-extension"],
      ["Loft conversions", "/loft-conversion"],
      ["Whole-home renovations", "/general-renovation"],
      ["Kitchens", "/kitchen-renovation"],
      ["Bathrooms", "/bathroom-renovation"],
      ["Basements", "/basement-conversion"],
    ],
  ],
  [
    "Company",
    [
      ["Our work", "/portfolio"],
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Cost planning", "/tools"],
      ["Where we work", "/locations"],
      ["Guarantee", "/our-guarantee"],
      ["Partners", "/our-partners"],
      ["Client portal", "/auth/signin"],
    ],
  ],
  [
    "Get in touch",
    [
      ["Send us your brief", "/contact#brief"],
      ["07922 391591", "tel:+447922391591"],
      ["Google reviews", "https://g.page/r/CaGIVAg_unOVEBM/"],
      ["Houzz", "https://www.houzz.co.uk/pro/betterhomeslondon/better-homes"],
      ["MyBuilder", "https://www.mybuilder.com/profile/view/celli/feedback"],
      ["Instagram", "https://www.instagram.com/better.homes.studio"],
      ["Partner with us", "/partner-with-us"],
    ],
  ],
];
export default function Footer() {
  return (
    <footer id="areas" className="bh-footer">
      <div className="bh-wrap bh-footer-grid">
        <div>
          <Link href="/" className="bh-wordmark">
            <Image src="/assets/brand/bh-icon-light.svg" alt="" width={30} height={30} className="bh-brand-icon" />
            Better Homes
          </Link>
          <p>
            A London construction company specialising in extensions, loft
            conversions and whole-home renovations. We also deliver standalone
            kitchens and bathrooms. Bring your architect or choose one we
            recommend, with optional coordination support either way.
          </p>
          <p id="where-we-work" className="bh-small">
            Central, North and East London, with selected projects in South
            London.
          </p>
        </div>
        {groups.map(([title, links]) => (
          <div key={title}>
            <p className="bh-eyebrow">{title}</p>
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="bh-wrap bh-footer-bottom">
        <span>
          © {new Date().getFullYear()} The Wisehome Group Limited, trading as
          Better Homes · Company No. 14659197 · VAT No. 441566202
        </span>
        <Link href="/privacy-policy">Privacy</Link>
        <Link href="/tos">Terms</Link>
      </div>
    </footer>
  );
}

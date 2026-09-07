"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { BOOKING_URL } from "@/libs/booking";
export const services = [
  ["Extensions", "/house-extension"],
  ["Loft conversions", "/loft-conversion"],
  ["Whole-home renovations", "/general-renovation"],
  ["Kitchens", "/kitchen-renovation"],
  ["Bathrooms", "/bathroom-renovation"],
  ["Basements", "/basement-conversion"],
];
export default function Navigation() {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const ref = useRef(null);
  const trigger = useRef(null);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const portal =
    role === "admin"
      ? "/admin/dashboard"
      : ["employee", "designer", "referrer"].includes(role)
        ? `/${role}`
        : "/dashboard";
  useEffect(() => {
    setMobile(false);
    setOpen(false);
  }, [path]);
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <header
      ref={ref}
      className="bh-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          setMobile(false);
          trigger.current?.focus();
        }
      }}
    >
      <a href="#page-content" className="bh-skip">
        Skip to content
      </a>
      <div className="bh-header-row">
        <Link href="/" className="bh-wordmark">
          <span />
          Better Homes
        </Link>
        <button
          ref={trigger}
          className="bh-menu-toggle"
          aria-expanded={mobile}
          aria-controls="bh-main-nav"
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? "Close" : "Menu"}
        </button>
        <nav
          onClick={(e) => {
            if (e.target.closest("a")) {
              setMobile(false);
              setOpen(false);
            }
          }}
          id="bh-main-nav"
          aria-label="Main navigation"
          className={`bh-nav ${mobile ? "is-open" : ""}`}
        >
          <Link href="/portfolio">Our work</Link>
          <div className="bh-services-menu">
            <button
              aria-expanded={open}
              aria-controls="bh-services"
              onClick={() => setOpen(!open)}
            >
              Services <span aria-hidden="true">⌄</span>
            </button>
            {open ? (
              <div id="bh-services" className="bh-dropdown">
                {services.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={path === href ? "page" : undefined}
                  >
                    {label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/#how">How we work</Link>
          <Link href="/tools">Cost planning</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link
            href={session ? portal : "/auth/signin"}
            className="bh-portal-link"
          >
            Client portal
          </Link>
          <a href={BOOKING_URL} className="bh-button">
            Discuss your project
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { planningTools } from "@/libs/serviceResources";
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
  const [costOpen, setCostOpen] = useState(false);
  const costTrigger = useRef(null);
  const servicesTrigger = useRef(null);
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
    setCostOpen(false);
  }, [path]);
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
        setCostOpen(false);
      }
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
          if (costOpen) costTrigger.current?.focus();
          else if (open) servicesTrigger.current?.focus();
          else {
            setMobile(false);
            trigger.current?.focus();
          }
          setOpen(false);
          setCostOpen(false);
        }
      }}
    >
      <a href="#page-content" className="bh-skip">
        Skip to content
      </a>
      <div className="bh-header-row">
        <Link href="/" className="bh-wordmark">
          <Image src="/assets/brand/bh-icon-light.svg" alt="" width={30} height={30} className="bh-brand-icon" />
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
              setCostOpen(false);
            }
          }}
          id="bh-main-nav"
          aria-label="Main navigation"
          className={`bh-nav ${mobile ? "is-open" : ""}`}
        >
          <div className="bh-nav-links">
            <Link href="/portfolio">Our work</Link>
            <div className="bh-services-menu">
              <button
                ref={servicesTrigger}
                aria-expanded={open}
                aria-controls="bh-services"
                onClick={() => {
                  setOpen(!open);
                  setCostOpen(false);
                }}
              >
                Services
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="m3 4.5 3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
            <div className="bh-services-menu bh-cost-menu">
              <div className="bh-cost-trigger">
                <Link href="/tools">Cost planning</Link>
                <button
                  ref={costTrigger}
                  type="button"
                  aria-label="Show cost calculators"
                  aria-expanded={costOpen}
                  aria-controls="bh-cost-tools"
                  onClick={() => {
                    setCostOpen(!costOpen);
                    setOpen(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="m3 4.5 3 3 3-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div
                id="bh-cost-tools"
                className="bh-dropdown"
                hidden={!costOpen}
              >
                {planningTools.map(([label, href]) => (
                  <Link key={href} href={href}>
                    {label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about">About</Link>
            <Link
              href="/blog"
              aria-current={path.startsWith("/blog") ? "page" : undefined}
            >
              Blog
            </Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="bh-nav-actions">
            <Link
              href={session ? portal : "/auth/signin"}
              className="bh-portal-link"
            >
              Client portal
            </Link>
            <a href={BOOKING_URL} className="bh-button">
              Book a 20-minute call
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

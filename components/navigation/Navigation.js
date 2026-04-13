"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSession, signIn } from "next-auth/react";

import classes from "./Navigation.module.css";

const COST_GUIDE_LINKS = [
  { href: "/tools", label: "All cost guides" },
  { href: "/extension-calculator", label: "Extension Calculator" },
  { href: "/renovation-calculator", label: "Renovation Calculator" },
  { href: "/kitchen-calculator", label: "Kitchen Calculator" },
  {
    href: "/tools/bathroom-cost-calculator",
    label: "Bathroom Calculator",
  },
  { href: "/btu-calculator", label: "BTU Calculator" },
];

const SERVICE_LINKS = [
  { href: "/house-extension", label: "House extension" },
  { href: "/loft-conversion", label: "Loft conversion" },
  { href: "/general-renovation", label: "Full home renovation" },
  { href: "/bathroom-renovation", label: "Bathroom renovations" },
  { href: "/kitchen-renovation", label: "Kitchen renovation" },
];

function Navigation() {
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const navRef = useRef(null);
  const { data: session } = useSession();

  const closeDropdowns = useCallback(() => {
    setActiveDesktopDropdown(null);
    setActiveMobileDropdown(null);
  }, []);

  const closeAllMenus = useCallback(() => {
    closeDropdowns();
    setIsMobileNavVisible(false);
  }, [closeDropdowns]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAllMenus]);

  const toggleDesktopDropdown = (dropdownName) => {
    setActiveDesktopDropdown((currentDropdown) =>
      currentDropdown === dropdownName ? null : dropdownName,
    );
  };

  const toggleMobileDropdown = (dropdownName) => {
    setActiveMobileDropdown((currentDropdown) =>
      currentDropdown === dropdownName ? null : dropdownName,
    );
  };

  const toggleMobileNav = () => {
    const nextState = !isMobileNavVisible;

    setIsMobileNavVisible(nextState);
    setActiveDesktopDropdown(null);

    if (!nextState) {
      setActiveMobileDropdown(null);
    }
  };

  const handleNavLinkClick = () => {
    closeAllMenus();
  };

  const handleDesktopDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveDesktopDropdown(null);
    }
  };

  const dashboardHref = session
    ? session.user.role === "employee"
      ? "/employee"
      : session.user.role === "designer"
        ? "/designer"
        : session.user.role === "referrer"
          ? "/referrer"
          : "/dashboard"
    : null;

  const dashboardLabel = session
    ? session.user.role === "employee"
      ? "Employee"
      : session.user.role === "designer"
        ? "Designer"
        : session.user.role === "referrer"
          ? "Referrer"
          : "Dashboard"
    : null;

  return (
    <header>
      <nav ref={navRef} className={`${classes["main-nav"]} container`}>
        <div className={classes["main-nav__left"]}>
          <ul className={classes["main-nav__list"]}>
            <li
              className={`${classes["main-nav__list-item"]} ${classes["dropdown-wrapper"]}`}
              onMouseEnter={() => setActiveDesktopDropdown("cost-guides")}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
              onBlur={handleDesktopDropdownBlur}
            >
              <button
                type="button"
                className={`${classes["dropdown-trigger"]} ${
                  activeDesktopDropdown === "cost-guides"
                    ? classes["dropdown-trigger-active"]
                    : ""
                }`}
                aria-expanded={activeDesktopDropdown === "cost-guides"}
                aria-controls="desktop-cost-guides-menu"
                onClick={() => toggleDesktopDropdown("cost-guides")}
                onFocus={() => setActiveDesktopDropdown("cost-guides")}
              >
                <span>Cost Guides</span>
                <MdOutlineKeyboardArrowDown className={classes["dropdown-chevron"]} />
              </button>
              <ul
                id="desktop-cost-guides-menu"
                className={`${classes["dropdown-menu"]} ${
                  activeDesktopDropdown === "cost-guides"
                    ? classes["dropdown-menu-visible"]
                    : ""
                }`}
              >
                {COST_GUIDE_LINKS.map((item) => (
                  <li key={item.href} className={classes["dropdown__list-item"]}>
                    <Link
                      href={item.href}
                      className={classes["dropdown__link"]}
                      onClick={handleNavLinkClick}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href="/portfolio"
                className={classes["main-nav__link"]}
                onClick={handleNavLinkClick}
              >
                Our work
              </Link>
            </li>
            <li
              className={`${classes["main-nav__list-item"]} ${classes["dropdown-wrapper"]}`}
              onMouseEnter={() => setActiveDesktopDropdown("services")}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
              onBlur={handleDesktopDropdownBlur}
            >
              <button
                type="button"
                className={`${classes["dropdown-trigger"]} ${
                  activeDesktopDropdown === "services"
                    ? classes["dropdown-trigger-active"]
                    : ""
                }`}
                aria-expanded={activeDesktopDropdown === "services"}
                aria-controls="desktop-services-menu"
                onClick={() => toggleDesktopDropdown("services")}
                onFocus={() => setActiveDesktopDropdown("services")}
              >
                <span>Services</span>
                <MdOutlineKeyboardArrowDown className={classes["dropdown-chevron"]} />
              </button>
              <ul
                id="desktop-services-menu"
                className={`${classes["dropdown-menu"]} ${
                  activeDesktopDropdown === "services"
                    ? classes["dropdown-menu-visible"]
                    : ""
                }`}
              >
                {SERVICE_LINKS.map((item) => (
                  <li key={item.href} className={classes["dropdown__list-item"]}>
                    <Link
                      href={item.href}
                      className={classes["dropdown__link"]}
                      onClick={handleNavLinkClick}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href="/contact"
                className={classes["main-nav__link"]}
                onClick={handleNavLinkClick}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className={classes["main-nav__center"]}>
          <Image
            className={classes["main-nav__logo"]}
            src="/assets/logo/bh-logo.svg"
            alt="better homes logo"
            width={100}
            height={100}
          />
          <Link href="/">
            <p className={classes["main-nav__logo-text"]}>Better Homes</p>
          </Link>
        </div>

        <button
          type="button"
          className={classes["main-nav__menu"]}
          aria-label={isMobileNavVisible ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
          aria-expanded={isMobileNavVisible}
          onClick={toggleMobileNav}
        >
          <Image
            className={classes["main-nav__icon"]}
            src="/assets/icons/menu.svg"
            alt="menu icon"
            width={100}
            height={100}
          />
        </button>

        <div className={classes["main-nav__right"]}>
          <ul className={classes["main-nav__list"]}>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href="/about"
                className={classes["main-nav__link"]}
                onClick={handleNavLinkClick}
              >
                About
              </Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href="/blog"
                className={classes["main-nav__link"]}
                onClick={handleNavLinkClick}
              >
                Learn
              </Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href="/faq"
                className={classes["main-nav__link"]}
                onClick={handleNavLinkClick}
              >
                FAQ
              </Link>
            </li>
            {session ? (
              <li className={classes["main-nav__list-item"]}>
                <Link
                  href={dashboardHref}
                  className={classes["main-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  {dashboardLabel}
                </Link>
              </li>
            ) : (
              <li className={classes["main-nav__list-item"]}>
                <button
                  type="button"
                  onClick={() => signIn()}
                  className={classes["main-nav__link-button"]}
                >
                  Sign In
                </button>
              </li>
            )}
            <li className={classes["main-nav__list-item"]}>
              <a
                href="tel:07922391591"
                className="lg:w-[245px]! btn-shadow flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-[#266bf1] bg-[#266bf1] px-[20px] text-[18px] font-bold leading-[140%] text-white transition duration-200 hover:border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[48px] lg:px-[24px]"
              >
                Call us now
              </a>
            </li>
          </ul>
        </div>

        <div
          id="mobile-nav"
          className={`${classes["mobile-nav"]} ${
            isMobileNavVisible ? classes["mobile-nav--visbile"] : ""
          }`}
        >
          <div className={classes["mobile-nav__left"]}>
            <ul className={classes["mobile-nav__list"]}>
              <li className={classes["mobile-nav__list-item"]}>
                <button
                  type="button"
                  className={`${classes["dropdown-trigger"]} ${
                    classes["dropdown-item-mobile"]
                  } ${
                    activeMobileDropdown === "cost-guides"
                      ? classes["dropdown-trigger-active"]
                      : ""
                  }`}
                  aria-expanded={activeMobileDropdown === "cost-guides"}
                  aria-controls="mobile-cost-guides-menu"
                  onClick={() => toggleMobileDropdown("cost-guides")}
                >
                  <span>Cost Guides</span>
                  <MdOutlineKeyboardArrowDown className={classes["dropdown-chevron"]} />
                </button>
                <ul
                  id="mobile-cost-guides-menu"
                  className={`${classes["dropdown-menu"]} ${
                    classes["dropdown-menu-mobile"]
                  } ${
                    activeMobileDropdown === "cost-guides"
                      ? classes["dropdown-menu-visible-mobile"]
                      : ""
                  }`}
                >
                  {COST_GUIDE_LINKS.map((item) => (
                    <li key={item.href} className={classes["dropdown__list-item"]}>
                      <Link
                        href={item.href}
                        className={classes["dropdown__link"]}
                        onClick={handleNavLinkClick}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href="/portfolio"
                  className={classes["mobile-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  Our work
                </Link>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <button
                  type="button"
                  className={`${classes["dropdown-trigger"]} ${
                    classes["dropdown-item-mobile"]
                  } ${
                    activeMobileDropdown === "services"
                      ? classes["dropdown-trigger-active"]
                      : ""
                  }`}
                  aria-expanded={activeMobileDropdown === "services"}
                  aria-controls="mobile-services-menu"
                  onClick={() => toggleMobileDropdown("services")}
                >
                  <span>Services</span>
                  <MdOutlineKeyboardArrowDown className={classes["dropdown-chevron"]} />
                </button>
                <ul
                  id="mobile-services-menu"
                  className={`${classes["dropdown-menu"]} ${
                    classes["dropdown-menu-mobile"]
                  } ${
                    activeMobileDropdown === "services"
                      ? classes["dropdown-menu-visible-mobile"]
                      : ""
                  }`}
                >
                  {SERVICE_LINKS.map((item) => (
                    <li key={item.href} className={classes["dropdown__list-item"]}>
                      <Link
                        href={item.href}
                        className={classes["dropdown__link"]}
                        onClick={handleNavLinkClick}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href="/contact"
                  className={classes["mobile-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className={classes["mobile-nav__right"]}>
            <ul className={classes["mobile-nav__list"]}>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href="/about"
                  className={classes["mobile-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  About
                </Link>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href="/blog"
                  className={classes["mobile-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  Learn
                </Link>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href="/faq"
                  className={classes["mobile-nav__link"]}
                  onClick={handleNavLinkClick}
                >
                  FAQ
                </Link>
              </li>
              {session ? (
                <li className={classes["mobile-nav__list-item"]}>
                  <Link
                    href={dashboardHref}
                    className={classes["mobile-nav__link"]}
                    onClick={handleNavLinkClick}
                  >
                    {dashboardLabel}
                  </Link>
                </li>
              ) : (
                <li className={classes["mobile-nav__list-item"]}>
                  <button
                    type="button"
                    onClick={() => signIn()}
                    className={classes["mobile-nav__button"]}
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;

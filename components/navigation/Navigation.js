"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import classes from "./Navigation.module.css";

function Navigation() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const toggleMobileNav = (e) => {
    e.preventDefault();
    setIsMobileNavVisible((prevState) => !prevState);
  };

  const handleNavLinkClick = () => {
    setIsMobileNavVisible(false);
    setIsDropdownVisible(false);
  };

  return (
    <header>
      <nav className={`${classes["main-nav"]} container`}>
        <div className={classes["main-nav__left"]}>
          <ul className={classes["main-nav__list"]}>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/portfolio">Our work</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link
                href=""
                className={classes["dropdown-item"]}
                onMouseEnter={toggleDropdown}
              >
                <span>Services</span>
                <MdOutlineKeyboardArrowDown />
              </Link>
              <ul
                className={`${classes["dropdown-menu"]} ${
                  isDropdownVisible ? classes["dropdown-menu-visible"] : ""
                }`}
                onMouseLeave={handleNavLinkClick}
              >
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/bathroom-renovation">Bathroom renovation</Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/kitchen-renovation">Kitchen renovation</Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/general-renovation">General renovation</Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/interior-design">Interior design</Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/house-extension">House extension</Link>
                </li>
              </ul>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={classes["main-nav__center"]}>
          <Image
            className={classes["main-nav__logo"]}
            src="/assets/logo/bh-logo.svg"
            alt="better homes studio logo"
            width={100}
            height={100}
          />
          <Link href="/">
            <p className={classes["main-nav__logo-text"]}>
              Better Homes <br />{" "}
              <span className={classes["main-nav__logo-text-accent"]}>
                Studio
              </span>
            </p>
          </Link>
        </div>

        <div
          className={classes["main-nav__menu"]}
          aria-label="menu"
          role="button"
          tabIndex="0"
          aria-controls="mobile-nav"
          onClick={toggleMobileNav}
        >
          <Image
            className={classes["main-nav__icon"]}
            src="/assets/icons/menu.svg"
            alt="better homes studio logo"
            width={100}
            height={100}
          />
        </div>
        <div className={classes["main-nav__right"]}>
          <ul className={classes["main-nav__list"]}>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/about">About</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/blog">Knowledge</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/faq">FAQ</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <a
                href="tel:02080504707"
                className="w-max flex items-center justify-center transition duration-200 cursor-pointer font-bold border-2 bg-transparent text-[#266bf1] border-[#266bf1] hover:bg-[#1449B0] hover:border-transparent hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[18px] leading-[140%] px-[20px] min-h-[64px] lg:min-h-[48px] lg:px-[24px] lg:w-[245px]! rounded-[20px] btn-shadow"
              >
                0208 050 4707
              </a>
            </li>
          </ul>
        </div>

        {/* { Mobile nav } */}

        <div
          className={`${classes["mobile-nav"]} ${
            isMobileNavVisible ? classes["mobile-nav--visbile"] : ""
          }`}
        >
          <div className={classes["mobile-nav__left"]}>
            <ul className={classes["mobile-nav__list"]}>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/portfolio">Our work</Link>
              </li>
              <li className={classes["mobile-nav__list-item"]}>
                <Link
                  href=""
                  className={`${classes["dropdown-item"]} ${classes["dropdown-item-mobile"]}`}
                  onClick={toggleDropdown}
                >
                  <span>Services</span>
                  <MdOutlineKeyboardArrowDown />
                </Link>
                <ul
                  className={`${classes["dropdown-menu"]} ${
                    classes["dropdown-menu-mobile"]
                  } ${
                    isDropdownVisible
                      ? classes["dropdown-menu-visible-mobile"]
                      : ""
                  }`}
                  onMouseLeave={handleNavLinkClick}
                >
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/bathroom-renovation">Bathroom renovation</Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/kitchen-renovation">Kitchen renovation</Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/general-renovation">General renovation</Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/interior-design">Interior design</Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/house-extension">House extension</Link>
                  </li>
                </ul>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className={classes["mobile-nav__right"]}>
            <ul className={classes["mobile-nav__list"]}>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/about">About</Link>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/blog">Knowledge</Link>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;

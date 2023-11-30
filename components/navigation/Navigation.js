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
              <Link href="/pages/portfolio">Portfolio</Link>
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
                  <Link href="/pages/bathroom-renovation">
                    Bathroom renovation
                  </Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/pages/kitchen-renovation">
                    Kitchen renovation
                  </Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/pages/general-renovation">
                    General renovation
                  </Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/pages/interior-design">Interior design</Link>
                </li>
                <li
                  className={classes["dropdown__list-item"]}
                  onClick={handleNavLinkClick}
                >
                  <Link href="/pages/house-extension">House extension</Link>
                </li>
              </ul>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/pages/contact">Contact</Link>
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
              <Link href="/pages/about">About</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/pages/blog">Blog</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <Link href="/pages/faq">FAQ</Link>
            </li>
            <li className={classes["main-nav__list-item"]}>
              <a
                href="tel:07922391591"
                className="btn"
              >
                Call us
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
                <Link href="/pages/portfolio">Portfolio</Link>
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
                    <Link href="/pages/bathroom-renovation">
                      Bathroom renovation
                    </Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/pages/kitchen-renovation">
                      Kitchen renovation
                    </Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/pages/general-renovation">
                      General renovation
                    </Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/pages/interior-design">Interior design</Link>
                  </li>
                  <li
                    className={classes["dropdown__list-item"]}
                    onClick={handleNavLinkClick}
                  >
                    <Link href="/pages/house-extension">House extension</Link>
                  </li>
                </ul>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/pages/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className={classes["mobile-nav__right"]}>
            <ul className={classes["mobile-nav__list"]}>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/pages/about">About</Link>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/pages/blog">Blog</Link>
              </li>
              <li
                className={classes["mobile-nav__list-item"]}
                onClick={handleNavLinkClick}
              >
                <Link href="/pages/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;

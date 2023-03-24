import Link from "next/link"
import Image from "next/image"

import classes from "./Navigation.module.css"
import arrowDown from "/assets/logo/bh-logo.svg"

function Navigation() {
    return (
        <header>
            <nav className={`${classes['main-nav']} container`}>
                <div className={classes['main-nav__left']}>
                    <ul className={classes['main-nav__list']}>
                        <li className={classes['main-nav__list-item']}><a href="./pages/portfolio.html">Portfolio</a></li>
                        <li className={classes['main-nav__list-item']}>
                            <a href="" className={classes['dropdown-item']}><span>Services</span>
                                <Image className={classes['arrow-down-icon']}
                                    src="./assets/icons/arrow-down.svg" alt="expand" />
                            </a>
                            <ul className={classes["dropdown-menu"]}>
                                <li className={classes["dropdown__list-item"]}><a href="./pages/bathroom-renovation.html">Bathroom
                                    renovation</a></li>
                                <li className={classes["dropdown__list-item"]}><a href="./pages/kitchen-renovation.html">Kitchen
                                    renovation</a></li>
                                <li className={classes["dropdown__list-item"]}><a href="./pages/general-renovation.html">General
                                    renovation</a></li>
                                <li className={classes["dropdown__list-item"]}><a href="./pages/interior-design.html">Interior design</a>
                                </li>
                                <li className={classes["dropdown__list-item"]}><a href="./pages/house-extension.html">House extension</a>
                                </li>
                            </ul>
                        </li>
                        <li className={classes["main-nav__list-item"]}><a href="./pages/contact.html">Contact</a></li>
                    </ul>
                </div>

                <div className={classes["main-nav__center"]}>
                    <img className={classes["main-nav__logo"]} src="./assets/logo/bh-logo.svg" alt="better homes studio logo" />
                    <Link href="/">
                        <p className={classes["main-nav__logo-text"]}>Better Homes <br /> <span
                            className={classes["main-nav__logo-text-accent"]}>Studio</span>
                        </p>
                    </Link>
                </div>

                <div className={classes["main-nav__menu"]} aria-label="menu" role="button" tabindex="0" aria-controls="mobile-nav">
                    <img className={classes["main-nav__icon"]} src="./assets/icons/menu.svg" alt="better homes studio logo" />
                </div>
                <div className={classes["main-nav__right"]}>
                    <ul className={classes["main-nav__list"]}>
                        <li className={classes["main-nav__list-item"]}><a href="./pages/about.html">About</a></li>
                        <li className={classes["main-nav__list-item"]}><a href="./pages/blog.html">Blog</a></li>
                        <li className={classes["main-nav__list-item"]}><a href="./pages/faq.html">FAQ</a></li>
                        <li className={classes["main-nav__list-item"]}>
                            <a href="tel:07922391591" className={classes["btn"]}>Call us</a>
                        </li>
                    </ul>
                </div>

                {/* { Mobile nav } */}

                <div className={classes["mobile-nav"]}>
                    <div className={classes["mobile-nav__left"]}>
                        <ul className={classes["mobile-nav__list"]}>
                            <li className={classes["mobile-nav__list-item"]}><a href="./pages/portfolio.html">Portfolio</a></li>
                            <li className={classes["mobile-nav__list-item"]}>
                                <a href="" className={`${classes["dropdown-item"]} ${classes["dropdown-item-mobile"]}`}><span>Services</span> <img
                                    className="arrow-down-icon" src="./assets/icons/arrow-down.svg" alt="expand" /></a>
                                <ul className={`${classes["dropdown-menu"]} ${classes["dropdown-menu-mobile"]}`}>
                                    <li className={classes["dropdown__list-item"]}><a href="./pages/bathroom-renovation.html">Bathroom
                                        renovation</a></li>
                                    <li className={classes["dropdown__list-item"]}><a href="./pages/kitchen-renovation.html">Kitchen
                                        renovation</a></li>
                                    <li className={classes["dropdown__list-item"]}><a href="./pages/general-renovation.html">General
                                        renovation</a></li>
                                    <li className={classes["dropdown__list-item"]}><a href="./pages/interior-design.html">Interior
                                        design</a></li>
                                    <li className={classes["dropdown__list-item"]}><a href="./pages/house-extension.html">House
                                        extension</a></li>
                                </ul>
                            </li>
                            <li className={classes["mobile-nav__list-item"]}><a href="./pages/contact.html">Contact</a></li>
                        </ul>
                    </div>
                    <div className={classes["mobile-nav__right"]}>
                        <ul className={classes["mobile-nav__list"]}>
                            <li className={classes["mobile-nav__list-item"]}><a href="./pages/about.html">About</a></li>
                            <li className={classes["mobile-nav__list-item"]}><a href="./pages/blog.html">Blog</a></li>
                            <li className={classes["mobile-nav__list-item"]}><a href="./pages/faq.html">FAQ</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navigation

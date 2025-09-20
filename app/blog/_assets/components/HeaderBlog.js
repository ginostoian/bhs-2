"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { categories } from "../content";
import ButtonGradient from "@/components/ButtonGradient";

const links = [
  {
    href: "/blog/",
    label: "All Posts",
  },
];

const ButtonPopoverCategories = () => {
  return (
    <Popover className="relative z-30">
      {({ open }) => (
        <>
          <Popover.Button
            className="link flex flex-nowrap items-center gap-1 text-base-content/80 no-underline duration-100 hover:text-base-content focus:text-base-content active:text-base-content"
            title="Open Blog categories"
          >
            Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-5 w-5 duration-200 ${
                open ? "rotate-180 transform" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute left-0 z-30 mt-3 w-screen max-w-full transform sm:max-w-sm">
              {({ close }) => (
                <div className="rounded-box overflow-hidden shadow-lg ring-1 ring-base-content ring-opacity-5">
                  <div className="relative grid gap-2 overflow-hidden bg-base-100 p-2">
                    {categories.map((category) => (
                      <div key={category.slug} onClick={() => close()}>
                        <Link
                          className="rounded-box -m-1 block cursor-pointer p-3 text-left duration-200 hover:bg-base-200"
                          href={`/blog/category/${category.slug}`}
                        >
                          <div className="">
                            <p className="mb-0.5 font-medium">
                              {category?.titleShort || category.title}
                            </p>
                            <p className="text-sm opacity-80">
                              {category?.descriptionShort ||
                                category.description}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const ButtonAccordionCategories = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        type="button"
        className="link flex w-full items-center justify-between no-underline"
      >
        Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 duration-200 ${
            isOpen ? "rotate-180 transform" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                className="link-hover link text-base-content/80 duration-100 hover:text-base-content"
              >
                {category?.titleShort || category.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

// This is the header that appears on all pages in the /blog folder.
// By default it shows the logo, the links, and the CTA.
// In the links, there's a popover with the categories.
const HeaderBlog = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const cta = (
    <ButtonGradient
      title="Expert help"
      onClick={() => {
        router.push("/contact");
      }}
    />
  );

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-50 mt-10 border-b border-base-content/10 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[85%] items-center justify-between px-8 py-4">
        <Link href="/" className="group mr-3 flex items-center gap-5">
          <Image
            src="/assets/logo/bh-logo.svg"
            alt={`${config.appName} logo`}
            className="w-12 transition-transform duration-200 group-hover:scale-105"
            priority={true}
            width={40}
            height={40}
          />
          <span className="hidden text-xl font-bold text-[#100b47] md:block">
            {config.appName}
          </span>
        </Link>
        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="rounded-box -m-2.5 inline-flex items-center justify-center p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Your links on large screens */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-12">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link-hover link text-base-content/80 duration-100 hover:text-base-content focus:text-base-content active:text-base-content"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}

          <ButtonPopoverCategories />
        </div>

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">{cta}</div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full origin-right transform overflow-y-auto bg-white/95 px-8 py-6 shadow-xl backdrop-blur-sm transition duration-300 ease-in-out sm:max-w-sm sm:ring-1 sm:ring-base-content/10`}
        >
          {/* Your logo/name on small screens */}
          <div className="flex items-center justify-between">
            <Link
              className="flex shrink-0 items-center gap-2"
              title={`${config.appName} hompage`}
              href="/"
            >
              <Image
                src="/assets/logo/bh-logo.svg"
                alt={`${config.appName} logo`}
                className="w-8"
                priority={true}
                width={40}
                height={40}
              />
              <span className="text-lg font-extrabold">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="rounded-box -m-2.5 p-2.5"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Your links on small screens */}
          <div className="mt-6 flow-root">
            <div className="py-4">
              <div className="flex flex-col items-start gap-y-4">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="link-hover link"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
                <ButtonAccordionCategories />
              </div>
            </div>
            <div className="divider"></div>
            {/* Your CTA on small screens */}
            <div className="flex flex-col">{cta}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBlog;

"use client";

import { usePathname } from "next/navigation";

const APP_ROUTE_PREFIXES = [
  "/admin",
  "/auth",
  "/dashboard",
  "/designer",
  "/employee",
  "/referrer",
];

export default function RouteChrome({
  children,
  announcement,
  header,
  whereWeWork,
  footer,
}) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAppRoute) {
    return children;
  }

  return (
    <>
      {announcement}
      {header}
      {children}
      {whereWeWork}
      {footer}
    </>
  );
}

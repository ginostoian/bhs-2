"use client";

import { usePathname } from "next/navigation";
import Breadcrumbs from "@/components/brand/Breadcrumbs";
import PublicHelp from "@/components/brand/PublicHelp";

const APP_ROUTE_PREFIXES = [
  "/admin",
  "/auth",
  "/dashboard",
  "/designer",
  "/employee",
  "/referrer",
];

export default function RouteChrome({ children, header, footer }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAppRoute) {
    return (
      <div className="bh-app" id="page-content">
        {children}
      </div>
    );
  }

  return (
    <>
      {header}
      <div className="bh-public" id="page-content">
        {!pathname.startsWith("/locations/") ? <Breadcrumbs /> : null}
        {children}
        <PublicHelp />
      </div>
      {footer}
    </>
  );
}

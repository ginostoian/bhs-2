import { Suspense } from "react";

import PlausibleProvider from "next-plausible";

import Header from "@/components/brand/Navigation";
import Footer from "@/components/brand/Footer";
import ClientLayout from "@/components/LayoutClient";
import CookieConsent from "@/components/CookieConsent";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getRootSchema } from "@/libs/structuredData";
import "./globals.css";
import "./brand.css";
import MarketingMeasurement from "@/components/MarketingMeasurement";
import ReferralTracker from "@/components/ReferralTracker";
import RouteChrome from "@/components/RouteChrome";



export const viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }) {
  const rootSchema = getRootSchema();

  return (
    <html lang="en" data-theme={config.colors.theme}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
          {/* GTM is now loaded by CookieConsent component with proper consent mode */}
        </head>
      )}
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>
          <Suspense fallback={null}>
            <ReferralTracker />
            <MarketingMeasurement />
          </Suspense>
          <RouteChrome
            header={<Header />}
            footer={<Footer />}
          >
            {children}
          </RouteChrome>
        </ClientLayout>
        {/* Cookie Consent Banner - handles GTM loading with consent mode */}
        <CookieConsent />
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import PlausibleProvider from "next-plausible";

import Header from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import WhereWeWork from "@/components/WhereWeWork";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import "./globals.css";
import Announcement from "@/components/Announcement";

const font = Inter({ subsets: ["latin"] });

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
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
          <GoogleTagManager gtmId="GTM-KBRRN8ZZ" />
        </head>
      )}
      <body>
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>
          <Announcement />
          <Header />
          {children}
          <WhereWeWork />
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

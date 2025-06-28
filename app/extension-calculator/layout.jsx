import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import PlausibleProvider from "next-plausible";

import Header from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import "../globals.css";
import Announcement from "@/components/Announcement";

const font = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  ...getSEOTags(),
  title: "Extension Cost Calculator | Better Homes Studio",
  description:
    "Calculate the cost of your house extension with our free online calculator. Get accurate estimates for single storey, double storey, and basement extensions.",
  keywords:
    "extension cost calculator, house extension cost, single storey extension, double storey extension, basement extension, London extensions",
};

export default function ExtensionCalculatorLayout({ children }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
          <GoogleTagManager gtmId="GTM-KBRRN8ZZ" />
        </head>
      )}
      <body>
        <ClientLayout>
          <Announcement />
          <Header />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

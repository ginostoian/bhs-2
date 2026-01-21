"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

/**
 * Cookie Consent Banner with proper service integration
 * - Implements Google Consent Mode v2 for GTM/GA
 * - Implements Microsoft Clarity consent API
 * - Stores preference in localStorage
 */

const GTM_ID = "GTM-KBRRN8ZZ";

// Initialize Google Consent Mode with denied defaults
const initializeGoogleConsent = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Set default consent to denied
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted", // For Crisp, etc.
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Enable URL passthrough for better measurement
  gtag("set", "url_passthrough", true);
};

// Update consent when user accepts
const grantGoogleConsent = () => {
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  }
};

// Deny consent explicitly
const denyGoogleConsent = () => {
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
};

// Grant Clarity consent
const grantClarityConsent = () => {
  if (window.clarity) {
    window.clarity("consent");
  }
};

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(null);

  useEffect(() => {
    // Initialize Google Consent Mode immediately
    initializeGoogleConsent();

    // Check for existing consent
    const storedConsent = localStorage.getItem("cookie-consent");

    if (storedConsent === null) {
      // No consent stored, show banner
      setShowBanner(true);
    } else if (storedConsent === "accepted") {
      // Consent was previously given
      setConsentGiven(true);
      grantGoogleConsent();
      // Clarity consent will be granted after GTM loads
    } else {
      // Consent was previously denied
      setConsentGiven(false);
      denyGoogleConsent();
    }
  }, []);

  // Grant Clarity consent after GTM loads (Clarity is loaded via GTM)
  useEffect(() => {
    if (consentGiven === true) {
      // Wait a bit for Clarity to be available via GTM
      const timer = setTimeout(() => {
        grantClarityConsent();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [consentGiven]);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsentGiven(true);
    grantGoogleConsent();
    setShowBanner(false);

    // Grant Clarity consent after a short delay (GTM needs to load first)
    setTimeout(() => {
      grantClarityConsent();
    }, 2000);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setConsentGiven(false);
    denyGoogleConsent();
    setShowBanner(false);
  };

  // Function to reopen banner (for footer link)
  const reopenBanner = () => {
    setShowBanner(true);
  };

  // Expose reopenBanner globally for footer link
  useEffect(() => {
    window.reopenCookieConsent = reopenBanner;
    return () => {
      delete window.reopenCookieConsent;
    };
  }, []);

  return (
    <>
      {/* Google Tag Manager - Always load, consent mode controls tracking */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10">
              <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      We value your privacy
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      We use cookies and similar technologies to improve your
                      experience, analyse site traffic, and for marketing
                      purposes. By clicking &quot;Accept All&quot;, you consent
                      to the use of cookies for analytics and advertising.
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      View our{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      for more information.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      onClick={handleReject}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAccept}
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

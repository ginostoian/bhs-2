"use client";
import { businessFacts } from "@/libs/businessFacts";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { downloadPdf } from "@/libs/downloadPdf";
import QuoteView from "@/components/documents/QuoteView";

export default function PublicQuotePage({ params }) {
  const { id: quoteId } = params;
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Tracking state
  const [viewId, setViewId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [trackingInitiated, setTrackingInitiated] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );

  // Function to extract UTM parameters from URL
  const extractUtmParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get("utm_source"),
      utmMedium: urlParams.get("utm_medium"),
      utmCampaign: urlParams.get("utm_campaign"),
      utmTerm: urlParams.get("utm_term"),
      utmContent: urlParams.get("utm_content"),
    };
  };

  // Function to determine visitor type based on UTM parameters
  const determineVisitorType = (utmParams) => {
    if (utmParams.utmSource === "client") return "client";
    if (utmParams.utmSource === "internal" || utmParams.utmMedium === "admin")
      return "internal";
    if (utmParams.utmSource === "partner") return "partner";
    return "unknown";
  };

  // Function to track quote view
  const trackQuoteView = async () => {
    // Prevent duplicate tracking calls
    if (trackingInitiated) {
      console.log("Tracking already initiated, skipping...");
      return;
    }

    setTrackingInitiated(true);

    try {
      const utmParams = extractUtmParams();
      const visitorType = determineVisitorType(utmParams);

      // Debug logging
      console.log("✅ UTM Params extracted:", utmParams);
      console.log("👤 Visitor type determined:", visitorType);

      const response = await fetch(`/api/quotes/${quoteId}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          utmParams,
          visitorType,
          metadata: {
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            fullUrl: window.location.href,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setViewId(result.data.viewId);
          setStartTime(Date.now());
        }
      }
    } catch (error) {
      console.error("Error tracking quote view:", error);
      // Fail silently - don't interrupt user experience
    }
  };

  // Function to update time on page
  const updateTimeOnPage = async () => {
    if (!viewId || !startTime) return;

    const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

    try {
      await fetch(`/api/quotes/${quoteId}/track`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewId,
          timeOnPage,
        }),
      });
    } catch (error) {
      console.error("Error updating time on page:", error);
      // Fail silently
    }
  };

  // Track view when component mounts and quote is loaded
  useEffect(() => {
    if (quote && !isLoading && !trackingInitiated) {
      console.log(
        "Triggering trackQuoteView because quote loaded and tracking not initiated yet",
      );
      trackQuoteView();
    }
  }, [quote, isLoading, trackingInitiated]);

  // Update time on page periodically and on unmount
  useEffect(() => {
    if (!viewId || !startTime) return;

    // Update time every 30 seconds
    const interval = setInterval(updateTimeOnPage, 30000);

    // Update time when user leaves the page
    const handleBeforeUnload = () => {
      updateTimeOnPage();
    };

    // Update time when page becomes hidden (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateTimeOnPage();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      updateTimeOnPage();
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [viewId, startTime]);

  useEffect(() => {
    // Load quote from database API
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setQuote(result.quote);
            setIsLoading(false);
            return;
          }
        }

        // If API call fails, fall back to mock data for demo purposes
        if (
          quoteId === "temp-id" ||
          quoteId.match(/^\d{8}$/) ||
          quoteId === "20240001" ||
          quoteId === "20240002" ||
          quoteId === "20240003"
        ) {
          setQuote({
            id: quoteId,
            quoteNumber: quoteId,
            title: "Sample Quote",
            projectType: "bathroom-renovation",
            client: {
              name: "John Doe",
              email: "john@example.com",
              phone: "07700 900000",
              address: "123 Sample Street",
              postcode: "SW1A 1AA",
            },
            projectAddress: "123 Sample Street, London",
            projectDescription:
              "Complete bathroom renovation including new fixtures, tiling, and plumbing",
            startDate: "2024-03-01",
            estimatedDuration: "2-3 weeks",
            services: [
              {
                categoryName: "Demolition & Preparation",
                categoryTotal: 1200,
                items: [
                  {
                    name: "Remove existing bathroom",
                    description: "Strip out old fixtures, tiles, and fittings",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 800,
                    total: 800,
                    notes: "Includes skip hire and disposal",
                  },
                  {
                    name: "Wall preparation",
                    description: "Remove old plaster, prepare surfaces",
                    quantity: 15,
                    unit: "sqm",
                    unitPrice: 25,
                    total: 375,
                    notes: "Ready for new plastering",
                  },
                ],
              },
              {
                categoryName: "Plumbing & Electrical",
                categoryTotal: 2800,
                items: [
                  {
                    name: "New plumbing system",
                    description: "Install new pipes, valves, and connections",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 1200,
                    total: 1200,
                    notes: "Includes all necessary fittings",
                  },
                  {
                    name: "Electrical work",
                    description: "New lighting, switches, and power points",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 800,
                    total: 800,
                    notes: "Part P certified installation",
                  },
                  {
                    name: "Shower installation",
                    description: "Exposed shower mixer and head",
                    quantity: 1,
                    unit: "set",
                    unitPrice: 800,
                    total: 800,
                    notes: "Exposed shower mixer - not concealed",
                  },
                ],
              },
              {
                categoryName: "Finishing",
                categoryTotal: 3200,
                items: [
                  {
                    name: "Wall tiling",
                    description: "Ceramic tiles to walls",
                    quantity: 25,
                    unit: "sqm",
                    unitPrice: 80,
                    total: 2000,
                    notes: "Includes adhesive and grout",
                  },
                  {
                    name: "Floor tiling",
                    description: "Porcelain floor tiles",
                    quantity: 8,
                    unit: "sqm",
                    unitPrice: 100,
                    total: 800,
                    notes: "Non-slip finish",
                  },
                  {
                    name: "Painting",
                    description: "Paint walls and ceiling",
                    quantity: 25,
                    unit: "sqm",
                    unitPrice: 16,
                    total: 400,
                    notes: "Mould-resistant paint",
                  },
                ],
              },
            ],
            pricing: {
              depositRequired: true,
              depositAmount: 1000,
              vatRate: 20,
            },
            termsAndConditions:
              "Standard Better Homes terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.",
            warrantyInformation: businessFacts.workmanship,
            leadTime: "We typically require 2 weeks notice to start a project.",
            validUntil: "2024-02-14T10:30:00Z",
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadPDF = async () => {
    if (!quote || downloadingPDF) return;

    setDownloadingPDF(true);
    try {
      await downloadPdf(
        `/api/quotes/${quoteId}/pdf`,
        `quote-${quote.quoteNumber || quoteId}.pdf`,
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Quote Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The quote you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <QuoteView
      quote={quote}
      toolbarProps={{
        onCopy: copyToClipboard,
        copied,
        onDownload: handleDownloadPDF,
        downloading: downloadingPDF,
      }}
    />
  );
}

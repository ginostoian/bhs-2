import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import QuoteView from "@/models/QuoteView";
import Quote from "@/models/Quote";

// Utility function to parse user agent
function parseUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();

  // Detect device type
  let deviceType = "desktop";
  if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
    if (/tablet|ipad/.test(ua)) {
      deviceType = "tablet";
    } else {
      deviceType = "mobile";
    }
  }

  // Detect browser
  let browser = "unknown";
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";

  // Detect OS
  let os = "unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    os = "iOS";

  return { deviceType, browser, os };
}

// Utility function to get client IP
function getClientIP(request) {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

// POST /api/quotes/[id]/track - Record a quote view
export async function POST(request, { params }) {
  console.log("🚀 POST /api/quotes/[id]/track - REQUEST RECEIVED");
  try {
    await connectMongo();

    const { id: quoteId } = params;
    const body = await request.json();
    console.log("📦 Request body received:", JSON.stringify(body, null, 2));

    // Validate quote exists
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 },
      );
    }

    // Extract request information
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ipAddress = getClientIP(request);
    const referrer = request.headers.get("referer") || null;

    // Parse user agent for device info
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Extract UTM parameters and visitor type from request body
    const utmParams = body.utmParams || {};
    const visitorType = body.visitorType || "unknown";

    // Debug logging - let's see exactly what we're saving
    console.log("💾 About to save QuoteView with UTM data:");
    console.log("UTM Source:", utmParams.utmSource);
    console.log("UTM Medium:", utmParams.utmMedium);
    console.log("UTM Campaign:", utmParams.utmCampaign);
    console.log("Visitor Type:", visitorType);

    // Check if there's already a view for this session
    let existingSessionView = null;
    if (body.sessionId) {
      existingSessionView = await QuoteView.findOne({
        quoteId,
        sessionId: body.sessionId,
      });
    }

    // If we already have a view for this session, return it instead of creating a new one
    if (existingSessionView) {
      return NextResponse.json({
        success: true,
        data: {
          viewId: existingSessionView._id,
          isUniqueVisitor: existingSessionView.isUniqueVisitor,
          totalViews: await QuoteView.countDocuments({ quoteId }),
        },
      });
    }

    // Check if this is a unique visitor for this quote (by IP)
    const existingIpView = await QuoteView.findOne({
      quoteId,
      ipAddress,
    });

    const isUniqueVisitor = !existingIpView;

    // Create the view record
    const quoteView = new QuoteView({
      quoteId,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      isUniqueVisitor,
      referrer,
      sessionId: body.sessionId || null,
      timeOnPage: body.timeOnPage || 0,
      // UTM Parameters
      utmSource: utmParams.utmSource || null,
      utmMedium: utmParams.utmMedium || null,
      utmCampaign: utmParams.utmCampaign || null,
      utmTerm: utmParams.utmTerm || null,
      utmContent: utmParams.utmContent || null,
      visitorType,
      metadata: {
        viewport: body.viewport || null,
        timestamp: new Date(),
        ...body.metadata,
      },
    });

    await quoteView.save();

    // Debug: Log what was actually saved
    console.log("✅ Saved QuoteView:", {
      id: quoteView._id,
      utmSource: quoteView.utmSource,
      utmMedium: quoteView.utmMedium,
      utmCampaign: quoteView.utmCampaign,
      visitorType: quoteView.visitorType,
    });

    // Update quote with viewed timestamps
    const updateFields = {
      lastViewed: new Date(),
      $inc: { viewCount: 1 },
    };

    // Set first viewed if this is the first view
    if (isUniqueVisitor) {
      const quote = await Quote.findById(quoteId);
      if (!quote.firstViewed) {
        updateFields.firstViewed = new Date();
      }
    }

    await Quote.findByIdAndUpdate(quoteId, updateFields);

    return NextResponse.json({
      success: true,
      data: {
        viewId: quoteView._id,
        isUniqueVisitor,
        totalViews: await QuoteView.countDocuments({ quoteId }),
      },
    });
  } catch (error) {
    console.error("Error tracking quote view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track view" },
      { status: 500 },
    );
  }
}

// PUT /api/quotes/[id]/track - Update time on page
export async function PUT(request, { params }) {
  try {
    await connectMongo();

    const { id: quoteId } = params;
    const body = await request.json();
    const { viewId, timeOnPage } = body;

    if (!viewId || !timeOnPage) {
      return NextResponse.json(
        { success: false, error: "viewId and timeOnPage are required" },
        { status: 400 },
      );
    }

    // Update the specific view record
    const updatedView = await QuoteView.findByIdAndUpdate(
      viewId,
      { timeOnPage },
      { new: true },
    );

    if (!updatedView) {
      return NextResponse.json(
        { success: false, error: "View record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        viewId: updatedView._id,
        timeOnPage: updatedView.timeOnPage,
      },
    });
  } catch (error) {
    console.error("Error updating time on page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update time on page" },
      { status: 500 },
    );
  }
}

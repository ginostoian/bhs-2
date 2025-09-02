import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/libs/mongoose";
import QuoteView from "@/models/QuoteView";
import Quote from "@/models/Quote";
import { requireAdmin } from "@/libs/requireAdmin";

// GET /api/quotes/[id]/analytics - Get quote view analytics
export async function GET(request, { params }) {
  try {
    // Require admin authentication
    await requireAdmin(request);

    await connectMongo();

    const { id: quoteId } = params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30"; // days

    // Validate quote exists
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 },
      );
    }

    // Get overall analytics
    const overallAnalytics = await QuoteView.getQuoteAnalytics(quoteId);

    // Get time-based analytics
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    const timeBasedAnalytics = await QuoteView.getViewsByTimeRange(
      quoteId,
      startDate,
      endDate,
    );

    // Get recent views (last 10)
    const recentViews = await QuoteView.find({ quoteId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "ipAddress deviceType browser os country city createdAt timeOnPage utmSource utmMedium utmCampaign visitorType sessionId",
      );

    // Debug: Log the recent views to see what's in the database
    console.log("Recent views from DB:", JSON.stringify(recentViews, null, 2));

    // Get device breakdown
    const deviceStats = await QuoteView.aggregate([
      { $match: { quoteId: new mongoose.Types.ObjectId(quoteId) } },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get browser breakdown
    const browserStats = await QuoteView.aggregate([
      { $match: { quoteId: new mongoose.Types.ObjectId(quoteId) } },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get visitor type breakdown
    const visitorTypeStats = await QuoteView.aggregate([
      { $match: { quoteId: new mongoose.Types.ObjectId(quoteId) } },
      {
        $group: {
          _id: "$visitorType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get UTM source breakdown
    const utmSourceStats = await QuoteView.aggregate([
      {
        $match: {
          quoteId: new mongoose.Types.ObjectId(quoteId),
          utmSource: { $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$utmSource",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get UTM medium breakdown
    const utmMediumStats = await QuoteView.aggregate([
      {
        $match: {
          quoteId: new mongoose.Types.ObjectId(quoteId),
          utmMedium: { $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$utmMedium",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get hourly distribution (last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const hourlyViews = await QuoteView.aggregate([
      {
        $match: {
          quoteId: new mongoose.Types.ObjectId(quoteId),
          createdAt: { $gte: last24Hours },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          id: quote._id,
          title: quote.title,
          quoteNumber: quote.quoteNumber,
          createdAt: quote.createdAt,
          lastViewed: quote.lastViewed,
        },
        analytics: {
          overview: overallAnalytics,
          timeRange: {
            days: parseInt(timeRange),
            data: timeBasedAnalytics,
          },
          recentViews,
          deviceStats,
          browserStats,
          visitorTypeStats,
          utmSourceStats,
          utmMediumStats,
          hourlyViews: hourlyViews.map((h) => ({
            hour: h._id,
            views: h.count,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching quote analytics:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

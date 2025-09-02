import mongoose from "mongoose";

const QuoteViewSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      index: true,
    },

    // Visitor Information
    ipAddress: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    // Device & Browser Info
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },

    browser: {
      type: String,
      default: "unknown",
    },

    os: {
      type: String,
      default: "unknown",
    },

    // Geographic Information (optional)
    country: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      default: null,
    },

    // Engagement Metrics
    timeOnPage: {
      type: Number, // in seconds
      default: 0,
    },

    // Tracking flags
    isUniqueVisitor: {
      type: Boolean,
      default: false,
    },

    // Referrer information
    referrer: {
      type: String,
      default: null,
    },

    // Session information
    sessionId: {
      type: String,
      default: null,
    },

    // UTM Parameters for source tracking
    utmSource: {
      type: String,
      default: null, // e.g., 'client', 'internal', 'partner'
    },

    utmMedium: {
      type: String,
      default: null, // e.g., 'email', 'whatsapp', 'admin', 'direct'
    },

    utmCampaign: {
      type: String,
      default: null, // e.g., 'quote_delivery', 'follow_up', 'review'
    },

    utmTerm: {
      type: String,
      default: null,
    },

    utmContent: {
      type: String,
      default: null,
    },

    // Visitor type derived from UTM or other factors
    visitorType: {
      type: String,
      enum: ["client", "internal", "partner", "unknown"],
      default: "unknown",
    },

    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Compound indexes for efficient queries
QuoteViewSchema.index({ quoteId: 1, createdAt: -1 });
QuoteViewSchema.index({ quoteId: 1, ipAddress: 1 });
QuoteViewSchema.index({ createdAt: -1 });

// Static methods for analytics
QuoteViewSchema.statics.getQuoteAnalytics = async function (quoteId) {
  const analytics = await this.aggregate([
    { $match: { quoteId: new mongoose.Types.ObjectId(quoteId) } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$ipAddress" },
        averageTimeOnPage: { $avg: "$timeOnPage" },
        firstView: { $min: "$createdAt" },
        lastView: { $max: "$createdAt" },
        deviceBreakdown: {
          $push: {
            device: "$deviceType",
            browser: "$browser",
            os: "$os",
          },
        },
      },
    },
    {
      $project: {
        totalViews: 1,
        uniqueVisitorCount: { $size: "$uniqueVisitors" },
        averageTimeOnPage: { $round: ["$averageTimeOnPage", 2] },
        firstView: 1,
        lastView: 1,
        deviceBreakdown: 1,
      },
    },
  ]);

  return (
    analytics[0] || {
      totalViews: 0,
      uniqueVisitorCount: 0,
      averageTimeOnPage: 0,
      firstView: null,
      lastView: null,
      deviceBreakdown: [],
    }
  );
};

QuoteViewSchema.statics.getViewsByTimeRange = async function (
  quoteId,
  startDate,
  endDate,
) {
  return await this.aggregate([
    {
      $match: {
        quoteId: new mongoose.Types.ObjectId(quoteId),
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$ipAddress" },
      },
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        views: "$count",
        uniqueVisitors: { $size: "$uniqueVisitors" },
      },
    },
    { $sort: { date: 1 } },
  ]);
};

// Instance methods
QuoteViewSchema.methods.updateTimeOnPage = async function (timeInSeconds) {
  this.timeOnPage = timeInSeconds;
  return await this.save();
};

const QuoteView =
  mongoose.models?.QuoteView || mongoose.model("QuoteView", QuoteViewSchema);

export default QuoteView;

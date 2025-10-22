/**
 * Rate Limiting Utility
 * Provides IP-based rate limiting for API endpoints
 */

// In-memory store for rate limiting (in production, consider Redis)
const rateLimitStore = new Map();

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_CONFIG = {
  // Maximum submissions per time window
  maxSubmissions: 3,
  // Time window in milliseconds (1 hour)
  windowMs: 60 * 60 * 1000,
  // Block duration for exceeding limits (24 hours)
  blockDurationMs: 24 * 60 * 60 * 1000,
  // Minimum time between submissions (30 seconds)
  minIntervalMs: 30 * 1000,
};

/**
 * Get client IP address from request
 */
function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

/**
 * Check if IP is currently blocked
 */
function isIPBlocked(ip) {
  const record = rateLimitStore.get(ip);
  if (!record) return false;

  const now = Date.now();
  if (record.blockedUntil && now < record.blockedUntil) {
    return true;
  }

  // Clean up expired blocks
  if (record.blockedUntil && now >= record.blockedUntil) {
    record.blockedUntil = null;
  }

  return false;
}

/**
 * Check if IP has exceeded rate limits
 */
function hasExceededRateLimit(ip) {
  const record = rateLimitStore.get(ip);
  if (!record) return false;

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;

  // Filter submissions within the current window
  const recentSubmissions = record.submissions.filter(
    (timestamp) => timestamp > windowStart,
  );

  return recentSubmissions.length >= RATE_LIMIT_CONFIG.maxSubmissions;
}

/**
 * Check if submission is too soon after last submission
 */
function isSubmissionTooSoon(ip) {
  const record = rateLimitStore.get(ip);
  if (!record || record.submissions.length === 0) return false;

  const now = Date.now();
  const lastSubmission = Math.max(...record.submissions);

  return now - lastSubmission < RATE_LIMIT_CONFIG.minIntervalMs;
}

/**
 * Record a submission for an IP
 */
function recordSubmission(ip) {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record) {
    record = {
      submissions: [],
      blockedUntil: null,
      firstSeen: now,
    };
  }

  // Add current submission
  record.submissions.push(now);

  // Clean up old submissions (older than 24 hours)
  const cutoff = now - 24 * 60 * 60 * 1000;
  record.submissions = record.submissions.filter(
    (timestamp) => timestamp > cutoff,
  );

  // Check if we should block this IP
  if (hasExceededRateLimit(ip)) {
    record.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
    console.warn(
      `Rate limit exceeded for IP: ${ip}. Blocked until: ${new Date(record.blockedUntil).toISOString()}`,
    );
  }

  rateLimitStore.set(ip, record);
}

/**
 * Get rate limit status for an IP
 */
function getRateLimitStatus(ip) {
  const record = rateLimitStore.get(ip);
  if (!record) {
    return {
      isBlocked: false,
      remainingSubmissions: RATE_LIMIT_CONFIG.maxSubmissions,
      resetTime: null,
      canSubmit: true,
    };
  }

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
  const recentSubmissions = record.submissions.filter(
    (timestamp) => timestamp > windowStart,
  );

  const isBlocked = isIPBlocked(ip);
  const remainingSubmissions = Math.max(
    0,
    RATE_LIMIT_CONFIG.maxSubmissions - recentSubmissions.length,
  );
  const resetTime =
    recentSubmissions.length > 0
      ? new Date(Math.min(...recentSubmissions) + RATE_LIMIT_CONFIG.windowMs)
      : null;

  return {
    isBlocked,
    remainingSubmissions,
    resetTime,
    canSubmit:
      !isBlocked && remainingSubmissions > 0 && !isSubmissionTooSoon(ip),
  };
}

/**
 * Rate limiting middleware for API routes
 */
export function rateLimitMiddleware(handler) {
  return async function (request) {
    const ip = getClientIP(request);

    // Check if IP is blocked
    if (isIPBlocked(ip)) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "3600", // 1 hour
          },
        },
      );
    }

    // Check if submission is too soon
    if (isSubmissionTooSoon(ip)) {
      return new Response(
        JSON.stringify({
          error: "Please wait before submitting another form.",
          code: "SUBMISSION_TOO_SOON",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "30", // 30 seconds
          },
        },
      );
    }

    // Check if rate limit would be exceeded
    if (hasExceededRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "3600", // 1 hour
          },
        },
      );
    }

    // Record the submission attempt
    recordSubmission(ip);

    // Call the original handler
    return handler(request);
  };
}

/**
 * Get rate limit statistics (for admin monitoring)
 */
export function getRateLimitStats() {
  const now = Date.now();
  const stats = {
    totalIPs: rateLimitStore.size,
    blockedIPs: 0,
    recentSubmissions: 0,
    topIPs: [],
  };

  for (const [ip, record] of rateLimitStore.entries()) {
    if (isIPBlocked(ip)) {
      stats.blockedIPs++;
    }

    const recentSubmissions = record.submissions.filter(
      (timestamp) => timestamp > now - RATE_LIMIT_CONFIG.windowMs,
    );
    stats.recentSubmissions += recentSubmissions.length;

    if (recentSubmissions.length > 0) {
      stats.topIPs.push({
        ip,
        submissions: recentSubmissions.length,
        lastSubmission: new Date(Math.max(...recentSubmissions)),
      });
    }
  }

  // Sort by submission count
  stats.topIPs.sort((a, b) => b.submissions - a.submissions);
  stats.topIPs = stats.topIPs.slice(0, 10); // Top 10

  return stats;
}

export default {
  rateLimitMiddleware,
  getRateLimitStatus,
  getRateLimitStats,
  isIPBlocked,
  hasExceededRateLimit,
  isSubmissionTooSoon,
};

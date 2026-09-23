import rateLimit from "express-rate-limit";

const limiter = (windowMinutes, limit, error) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error },
  });

// Reads: generous, the directory page makes several calls per visit.
export const generalLimiter = limiter(15, 300, "Too many requests, please try again later");

// Upvotes and visit tracking.
export const engagementLimiter = limiter(15, 60, "Too many actions, please slow down");

// Public forms: submissions, contact, newsletter.
export const formLimiter = limiter(60, 10, "Too many submissions, please try again in an hour");

// Admin endpoints (also protected by API key).
export const adminLimiter = limiter(15, 100, "Too many admin requests, please try again later");

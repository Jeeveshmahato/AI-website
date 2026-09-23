import crypto from "crypto";
import { env } from "../config/env.js";

// Hash both sides so timingSafeEqual always compares equal-length buffers
// and the key length is not leaked through an early return.
const digest = (value) => crypto.createHash("sha256").update(value).digest();

const requireApiKey = (req, res, next) => {
  if (!env.apiKey) {
    console.warn("[auth] API_KEY not set in environment - rejecting request");
    return res.status(503).json({ error: "Server authentication not configured" });
  }

  const apiKey = req.get("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key. Provide X-API-Key header." });
  }

  if (!crypto.timingSafeEqual(digest(env.apiKey), digest(apiKey))) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};

export default requireApiKey;

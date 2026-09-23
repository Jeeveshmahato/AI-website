import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173"];

// The official production frontends. Origins are public (not secrets), so they are
// committed here to keep a stale CLIENT_URL on the host from blocking the live site.
// Extra origins (custom domains, previews) still come from CLIENT_URL.
const PRODUCTION_ORIGINS = ["https://ai-website-frontend.onrender.com"];

function parseOrigins(value) {
  const configured = (value || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  const defaults = isProduction ? PRODUCTION_ORIGINS : [...PRODUCTION_ORIGINS, ...DEV_ORIGINS];
  return [...new Set([...configured, ...defaults])];
}

export const env = {
  isProduction,
  isVercel: Boolean(process.env.VERCEL),
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "",
  apiKey: process.env.API_KEY || "",
  clientOrigins: parseOrigins(process.env.CLIENT_URL),
  // Render and Vercel both sit behind exactly one proxy hop.
  trustProxy: process.env.TRUST_PROXY === undefined ? 1 : Number(process.env.TRUST_PROXY),
};

// Warn instead of exiting: on serverless platforms process.exit() turns every
// request into an opaque FUNCTION_INVOCATION_FAILED. Routes that need a missing
// value respond with a clear 503 instead, and /health reports what is missing.
export function reportMissingEnv() {
  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.apiKey) missing.push("API_KEY");
  if (missing.length) {
    console.error(`[config] Missing environment variables: ${missing.join(", ")}`);
  }
  return missing;
}

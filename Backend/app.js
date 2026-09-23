import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import { env, reportMissingEnv } from "./config/env.js";
import { connectDB } from "./lib/db.js";
import { generalLimiter } from "./middleware/rateLimits.js";
import errorHandler from "./middleware/errorHandler.js";
import aitoolsRouter from "./routes/aitools.js";
import publicRouter from "./routes/public.js";
import adminRouter from "./routes/admin.js";

const missingEnv = reportMissingEnv();

const app = express();

app.disable("x-powered-by");
// Required behind Render/Vercel proxies so rate limiting keys on the real client IP
// instead of the proxy's (which would throttle every visitor together).
app.set("trust proxy", env.trustProxy);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // JSON API only; the frontend host sets its own CSP
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// CLIENT_URL is a comma-separated list; "*" matches one subdomain label,
// e.g. https://my-app-*.vercel.app for preview deployments.
const originMatchers = env.clientOrigins.map((origin) =>
  origin.includes("*")
    ? new RegExp(`^${origin.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+")}$`, "i")
    : origin
);
const isAllowedOrigin = (origin) =>
  originMatchers.some((m) => (typeof m === "string" ? m === origin : m.test(origin)));

console.log(`[cors] Allowed origins: ${env.clientOrigins.join(", ") || "(none - set CLIENT_URL)"}`);

// Log each rejected origin once so a misconfigured CLIENT_URL is obvious in the host's logs.
const reportedOrigins = new Set();
const checkOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // same-origin, curl, server-to-server
  const normalized = origin.replace(/\/+$/, "");
  const allowed = isAllowedOrigin(normalized);
  if (!allowed && !reportedOrigins.has(normalized) && reportedOrigins.size < 50) {
    reportedOrigins.add(normalized);
    console.warn(`[cors] Blocked origin "${normalized}". Add it to CLIENT_URL to allow it.`);
  }
  callback(null, allowed);
};

app.use(
  cors({
    // Unknown origins get no CORS headers (browser blocks them) rather than a 500.
    origin: checkOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-API-Key"],
    maxAge: 86400,
  })
);

app.use(compression());
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({ name: "AI Tools Hub API", status: "ok", health: "/health", endpoints: "/api/aitools" });
});

// Health check: verifies config and database reachability. Used by Render's
// healthCheckPath and handy for diagnosing a broken deployment.
app.get("/health", async (_req, res) => {
  const body = { status: "ok", timestamp: new Date().toISOString(), db: "up", corsOrigins: env.clientOrigins };
  if (missingEnv.length) body.missingEnv = missingEnv;
  try {
    await connectDB();
  } catch {
    body.status = "degraded";
    body.db = env.mongoUri ? "unreachable" : "not_configured";
  }
  body.dbState = mongoose.STATES[mongoose.connection.readyState];
  res.set("Cache-Control", "no-store");
  res.status(body.status === "ok" ? 200 : 503).json(body);
});

app.use("/api", generalLimiter);
app.use("/api/aitools", aitoolsRouter);
app.use("/api/admin", adminRouter);
app.use("/api", publicRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use(errorHandler);

export default app;

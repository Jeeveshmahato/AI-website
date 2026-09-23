import { env } from "../config/env.js";

const errorHandler = (err, req, res, _next) => {
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation failed", details });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // Duplicate key (e.g. an already-subscribed email or taken slug)
  if (err.code === 11000) {
    return res.status(409).json({ error: "Resource already exists" });
  }

  // Errors raised by express.json() carry `status`/`type` (malformed or oversized body)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }

  const statusCode = err.statusCode || err.status || 500;
  // 503s are expected outages (DB down / unconfigured) already logged by lib/db.js.
  if (statusCode >= 500 && statusCode !== 503) {
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  }

  // 5xx details can leak internals; only expose them outside production
  // (503s carry deliberately user-facing messages).
  const message =
    statusCode < 500 || statusCode === 503 || !env.isProduction
      ? err.message
      : "Internal server error";

  res.status(statusCode).json({ error: message });
};

export default errorHandler;

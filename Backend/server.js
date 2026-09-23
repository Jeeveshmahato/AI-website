// Long-running server entrypoint (local dev, Render, Railway, Docker, ...).
// Vercel does not use this file; it imports app.js via api/index.js.
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./lib/db.js";

// Warm the connection at boot; requests still retry via requireDb if this fails.
connectDB().catch(() => {});

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB().catch(() => {});
    console.log("MongoDB connection closed");
    process.exit(0);
  });
  // Don't hang forever on keep-alive connections.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled rejection:", reason);
});

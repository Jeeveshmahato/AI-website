import mongoose from "mongoose";
import { env } from "../config/env.js";

mongoose.set("strictQuery", true);

// Cache the connection promise on globalThis so warm serverless invocations
// (and hot reloads) reuse one connection instead of opening a new pool per request.
const cache = globalThis.__mongoose ?? (globalThis.__mongoose = { promise: null });

export class DatabaseUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseUnavailableError";
    this.statusCode = 503;
  }
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!env.mongoUri) {
    throw new DatabaseUnavailableError("Database is not configured (MONGO_URI missing)");
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: env.isVercel ? 5 : 10,
      })
      .then((m) => {
        console.log("[db] MongoDB connected");
        return m.connection;
      })
      .catch((err) => {
        // Clear the cache so the next request retries instead of reusing a failed promise.
        cache.promise = null;
        console.error("[db] MongoDB connection error:", err.message);
        throw new DatabaseUnavailableError("Database is temporarily unavailable");
      });
  }
  return cache.promise;
}

export async function disconnectDB() {
  cache.promise = null;
  await mongoose.connection.close(false);
}

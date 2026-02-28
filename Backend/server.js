import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import aitoolsRouter from "./routes/aitools.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// Validate required env vars
const requiredEnvVars = ["MONGO_URI", "CLIENT_URL", "API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// Body parsing with reasonable limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// CORS setup - trim trailing slash to prevent mismatch
const clientUrl = process.env.CLIENT_URL.replace(/\/+$/, "");
app.use(
  cors({
    origin: clientUrl,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// API routes
app.use("/api/aitools", aitoolsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

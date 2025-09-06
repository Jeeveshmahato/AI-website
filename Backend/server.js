import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import AITool from "./models/AITool.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
const allowedOrigins = [process.env.CLIENT_URL];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// API routes
app.post("/api/aitools", async (req, res) => {
  try {
    const newTool = new AITool(req.body);
    await newTool.save();
    res.status(201).json(newTool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/aitools", async (req, res) => {
  try {
    const tools = await AITool.find();
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/aitools/:id", async (req, res) => {
  try {
    await AITool.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React static files
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});yyy
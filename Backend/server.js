import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AITool from "./models/AITool.js"; // ✅ Import AI tool schema

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(cors({ origin: "http://localhost:5173" })); // Allow frontend access

const allowedOrigins = [
  "https://ai-website-eight-ivory.vercel.app", // ✅ Your frontend domain
  "https://www.ai-website-eight-ivory.vercel.app", // ✅ Just in case of www redirect
];


app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


// ✅ Ensure MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((error) => console.error("❌ MongoDB Connection Failed:", error));

// ✅ API Endpoints

// 🔹 Add a new AI tool
app.post("/api/aitools", async (req, res) => {
  try {
    const newTool = new AITool(req.body);
    await newTool.save();
    res.status(201).json(newTool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Fetch all AI tools
app.get("/api/aitools", async (req, res) => {
  try {
    const tools = await AITool.find();
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Delete an AI tool (Optional)
app.delete("/api/aitools/:id", async (req, res) => {
  try {
    await AITool.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Health check route
app.get("/", (req, res) => {
  res.send("✅ Server is running 🚀");
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

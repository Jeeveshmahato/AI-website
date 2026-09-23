import { Router } from "express";
import AITool from "../models/AITool.js";
import ContactMessage from "../models/ContactMessage.js";
import Subscriber from "../models/Subscriber.js";
import requireApiKey from "../middleware/auth.js";
import { requireDb } from "../middleware/validate.js";
import { adminLimiter } from "../middleware/rateLimits.js";
import { TOOL_STATUS } from "../config/constants.js";

const router = Router();

router.use(adminLimiter, requireApiKey, requireDb);

// Never cache authenticated responses in shared caches.
router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// GET /api/admin/summary
router.get("/summary", async (_req, res, next) => {
  try {
    const [pending, approved, rejected, messages, unreadMessages, subscribers] = await Promise.all([
      AITool.countDocuments({ status: "pending" }),
      AITool.countDocuments({ status: { $nin: ["pending", "rejected"] } }),
      AITool.countDocuments({ status: "rejected" }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      Subscriber.countDocuments(),
    ]);
    res.json({ pending, approved, rejected, messages, unreadMessages, subscribers });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/tools?status=pending
router.get("/tools", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : "pending";
    if (!TOOL_STATUS.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${TOOL_STATUS.join(", ")}` });
    }
    const filter = status === "approved" ? { status: { $nin: ["pending", "rejected"] } } : { status };
    const tools = await AITool.find(filter).select("+submitterEmail").sort({ createdAt: -1 }).limit(500).lean();
    res.json(tools);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/messages
router.get("/messages", async (_req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/messages/:id/read
router.patch("/messages/:id/read", async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (err) {
    next(err);
  }
});

export default router;

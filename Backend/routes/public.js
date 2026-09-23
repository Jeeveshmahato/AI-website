import { Router } from "express";
import { body } from "express-validator";
import AITool from "../models/AITool.js";
import ContactMessage from "../models/ContactMessage.js";
import Subscriber from "../models/Subscriber.js";
import { validate, requireDb, honeypot } from "../middleware/validate.js";
import { formLimiter } from "../middleware/rateLimits.js";
import { escapeRegex } from "../lib/slug.js";
import { toolRules, emailRule, pickToolFields } from "./validators.js";

const router = Router();

// POST /api/submissions - Public: queue a tool for moderation
router.post(
  "/submissions",
  formLimiter,
  honeypot(),
  toolRules(),
  emailRule("submitterEmail").optional({ values: "falsy" }),
  validate,
  requireDb,
  async (req, res, next) => {
    try {
      const fields = pickToolFields(req.body);
      const duplicate = await AITool.exists({
        $or: [
          { name: new RegExp(`^${escapeRegex(fields.name)}$`, "i") },
          { link: fields.link },
        ],
        status: { $ne: "rejected" },
      });
      if (duplicate) {
        return res.status(409).json({ error: "This tool is already listed or awaiting review." });
      }

      await AITool.create({
        ...fields,
        status: "pending",
        featured: false,
        submitterEmail: req.body.submitterEmail || undefined,
      });
      res.status(201).json({ message: "Thanks! Your tool was submitted and will appear once reviewed." });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/contact - Public
router.post(
  "/contact",
  formLimiter,
  honeypot(),
  body("name").isString().bail().trim().isLength({ min: 2, max: 100 }).withMessage("Please enter your name"),
  emailRule(),
  body("subject").optional().isString().bail().trim().isLength({ max: 150 }),
  body("message").isString().bail().trim().isLength({ min: 10, max: 5000 }).withMessage("Message must be 10-5000 characters"),
  validate,
  requireDb,
  async (req, res, next) => {
    try {
      const { name, email, subject = "", message } = req.body;
      await ContactMessage.create({ name, email, subject, message });
      res.status(201).json({ message: "Thanks for reaching out! We'll get back to you soon." });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/newsletter - Public, idempotent
router.post("/newsletter", formLimiter, honeypot(), emailRule(), validate, requireDb, async (req, res, next) => {
  try {
    await Subscriber.updateOne(
      { email: req.body.email },
      { $setOnInsert: { email: req.body.email } },
      { upsert: true }
    );
    res.status(201).json({ message: "You're subscribed! Watch your inbox for the best new AI tools." });
  } catch (err) {
    next(err);
  }
});

export default router;

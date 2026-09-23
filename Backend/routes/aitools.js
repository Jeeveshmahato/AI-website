import { Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import AITool from "../models/AITool.js";
import requireApiKey from "../middleware/auth.js";
import { validate, requireDb } from "../middleware/validate.js";
import { adminLimiter, engagementLimiter } from "../middleware/rateLimits.js";
import { PUBLIC_TOOL_FILTER, TOOL_STATUS } from "../config/constants.js";
import { escapeRegex } from "../lib/slug.js";
import { toolRules, pickToolFields } from "./validators.js";

const router = Router();

const SORTS = {
  newest: { createdAt: -1 },
  featured: { featured: -1, upvotes: -1, createdAt: -1 },
  popular: { upvotes: -1, visits: -1, createdAt: -1 },
  trending: { visits: -1, upvotes: -1, createdAt: -1 },
  name: { name: 1 },
};

// Query params may arrive as arrays (?a=1&a=2); only ever use them as plain strings.
const str = (value) => (typeof value === "string" ? value.trim() : "");

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

// GET /api/aitools?q=&category=&price=&featured=true&sort=&limit= - Public
router.get("/", requireDb, async (req, res, next) => {
  try {
    const filter = { ...PUBLIC_TOOL_FILTER };
    const q = str(req.query.q).slice(0, 100);
    const category = str(req.query.category);
    const price = str(req.query.price);

    if (q) {
      const pattern = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: pattern }, { tagline: pattern }, { category: pattern }, { tags: pattern }];
    }
    if (category && category !== "All") filter.category = category;
    if (price && price !== "All") filter.price = price;
    if (str(req.query.featured) === "true") filter.featured = true;

    const sort = SORTS[str(req.query.sort)] || SORTS.newest;
    const limit = Math.min(Math.max(parseInt(str(req.query.limit), 10) || 500, 1), 500);

    const tools = await AITool.find(filter)
      .sort(sort)
      .collation({ locale: "en", strength: 2 })
      .limit(limit)
      .lean();
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(tools.map(({ __v, ...tool }) => tool));
  } catch (err) {
    next(err);
  }
});

// GET /api/aitools/stats - Public: totals for the landing page
router.get("/stats", requireDb, async (_req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [byCategory, total, newThisWeek, freeCount] = await Promise.all([
      AITool.aggregate([
        { $match: PUBLIC_TOOL_FILTER },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AITool.countDocuments(PUBLIC_TOOL_FILTER),
      AITool.countDocuments({ ...PUBLIC_TOOL_FILTER, createdAt: { $gte: weekAgo } }),
      AITool.countDocuments({ ...PUBLIC_TOOL_FILTER, price: { $in: ["Free", "Freemium"] } }),
    ]);
    res.set("Cache-Control", "public, max-age=300");
    res.json({
      total,
      newThisWeek,
      freeCount,
      categories: byCategory.map(({ _id, count }) => ({ category: _id, count })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/aitools/:idOrSlug - Public
router.get("/:idOrSlug", requireDb, async (req, res, next) => {
  try {
    const key = req.params.idOrSlug.toLowerCase();
    const match = isObjectId(req.params.idOrSlug) ? { _id: req.params.idOrSlug } : { slug: key };
    const tool = await AITool.findOne({ ...match, ...PUBLIC_TOOL_FILTER }).lean();
    if (!tool) return res.status(404).json({ error: "Tool not found" });
    delete tool.__v;
    res.json(tool);
  } catch (err) {
    next(err);
  }
});

// Engagement endpoints - Public, rate limited
const engage = (update, extraFilter = {}) => [
  engagementLimiter,
  requireDb,
  async (req, res, next) => {
    try {
      if (!isObjectId(req.params.id)) return res.status(400).json({ error: "Invalid ID format" });
      const tool = await AITool.findOneAndUpdate(
        { _id: req.params.id, ...PUBLIC_TOOL_FILTER, ...extraFilter },
        update,
        { new: true, projection: { upvotes: 1, visits: 1 } }
      ).lean();
      if (!tool) {
        // Unvoting a tool already at 0 is a no-op, not an error.
        const exists = await AITool.exists({ _id: req.params.id, ...PUBLIC_TOOL_FILTER });
        if (!exists) return res.status(404).json({ error: "Tool not found" });
        return res.json({ upvotes: 0 });
      }
      res.json({ upvotes: tool.upvotes, visits: tool.visits });
    } catch (err) {
      next(err);
    }
  },
];

router.post("/:id/upvote", ...engage({ $inc: { upvotes: 1 } }));
router.delete("/:id/upvote", ...engage({ $inc: { upvotes: -1 } }, { upvotes: { $gt: 0 } }));
router.post("/:id/visit", ...engage({ $inc: { visits: 1 } }));

// POST /api/aitools - Admin: create an approved tool directly
router.post("/", adminLimiter, requireApiKey, toolRules(), body("featured").optional().isBoolean().toBoolean(), validate, requireDb, async (req, res, next) => {
  try {
    const tool = await AITool.create({
      ...pickToolFields(req.body),
      featured: req.body.featured ?? false,
      status: "approved",
    });
    res.status(201).json(tool);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/aitools/:id - Admin: moderate (status / featured) or edit fields
router.patch(
  "/:id",
  adminLimiter,
  requireApiKey,
  toolRules({ partial: true }),
  body("status").optional().isIn(TOOL_STATUS).withMessage(`Status must be one of: ${TOOL_STATUS.join(", ")}`),
  body("featured").optional().isBoolean().toBoolean(),
  validate,
  requireDb,
  async (req, res, next) => {
    try {
      if (!isObjectId(req.params.id)) return res.status(400).json({ error: "Invalid ID format" });
      const update = pickToolFields(req.body);
      if (req.body.status !== undefined) update.status = req.body.status;
      if (req.body.featured !== undefined) update.featured = req.body.featured;

      const tool = await AITool.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      });
      if (!tool) return res.status(404).json({ error: "Tool not found" });
      res.json(tool);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/aitools/:id - Admin
router.delete("/:id", adminLimiter, requireApiKey, requireDb, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(400).json({ error: "Invalid ID format" });
    const tool = await AITool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ error: "Tool not found" });
    res.json({ message: "Tool deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;

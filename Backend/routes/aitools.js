import { Router } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import AITool from "../models/AITool.js";
import requireApiKey from "../middleware/auth.js";

const router = Router();

// Validation rules for creating a tool
const createToolValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters")
    .escape(),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters")
    .escape(),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isLength({ max: 50 })
    .withMessage("Price cannot exceed 50 characters")
    .escape(),
  body("link")
    .trim()
    .notEmpty()
    .withMessage("Link is required")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Link must be a valid URL"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("image")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Image must be a valid URL"),
];

// GET /api/aitools - Public
router.get("/", async (req, res, next) => {
  try {
    const tools = await AITool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (err) {
    next(err);
  }
});

// POST /api/aitools - Protected
router.post("/", requireApiKey, createToolValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }

    const { name, category, price, link, description, image } = req.body;
    const newTool = new AITool({ name, category, price, link, description, image });
    await newTool.save();
    res.status(201).json(newTool);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/aitools/:id - Protected
router.delete("/:id", requireApiKey, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const tool = await AITool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.json({ message: "Tool deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;

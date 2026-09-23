import { validationResult } from "express-validator";
import { connectDB } from "../lib/db.js";

// Runs after express-validator chains; responds 400 with field-level details.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({
    error: "Validation failed",
    details: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
  });
};

// Ensures a MongoDB connection before handlers touch the database. Placed after
// validation so bad requests are rejected without opening a connection.
export const requireDb = async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
};

// Bots fill every field; humans never see this one. Pretend success so bots don't adapt.
export const honeypot = (field = "website") => (req, res, next) => {
  if (req.body && typeof req.body[field] === "string" && req.body[field].trim() !== "") {
    return res.status(201).json({ message: "Thanks!" });
  }
  next();
};

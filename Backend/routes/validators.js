import { body } from "express-validator";
import { CATEGORIES, PRICING } from "../config/constants.js";

const URL_OPTIONS = { protocols: ["http", "https"], require_protocol: true, require_tld: true };

// Accepts ["a", "b"] or "a, b"; returns a clean, de-duplicated list.
const toTags = (value) => {
  const list = Array.isArray(value) ? value : String(value ?? "").split(",");
  const tags = list
    .filter((t) => typeof t === "string")
    .map((t) => t.trim().toLowerCase().slice(0, 30))
    .filter(Boolean);
  return [...new Set(tags)].slice(0, 8);
};

// Note: no .escape() — values are stored raw and React escapes on render.
// Escaping here double-encodes ("AT&T" would display as "AT&amp;T").
export function toolRules({ partial = false } = {}) {
  const field = (name) => (partial ? body(name).optional() : body(name));
  return [
    field("name")
      .isString().withMessage("Name is required").bail()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),
    field("category")
      .isString().withMessage("Category is required").bail()
      .trim()
      .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(", ")}`),
    field("price")
      .isString().withMessage("Pricing is required").bail()
      .trim()
      .isIn(PRICING).withMessage(`Pricing must be one of: ${PRICING.join(", ")}`),
    field("link")
      .isString().withMessage("Website link is required").bail()
      .trim()
      .isURL(URL_OPTIONS).withMessage("Website link must be a valid http(s) URL")
      .isLength({ max: 500 }),
    field("description")
      .isString().withMessage("Description is required").bail()
      .trim()
      .isLength({ min: 20, max: 2000 }).withMessage("Description must be 20-2000 characters"),
    body("tagline")
      .optional({ values: "falsy" })
      .isString().bail()
      .trim()
      .isLength({ max: 140 }).withMessage("Tagline cannot exceed 140 characters"),
    body("image")
      .optional({ values: "falsy" })
      .isString().bail()
      .trim()
      .isURL(URL_OPTIONS).withMessage("Logo must be a valid http(s) image URL")
      .isLength({ max: 500 }),
    body("tags").optional().customSanitizer(toTags),
  ];
}

export const emailRule = (name = "email") =>
  body(name)
    .isString().withMessage("Email is required").bail()
    .trim()
    .isEmail().withMessage("Please enter a valid email address")
    .isLength({ max: 254 })
    .normalizeEmail({ gmail_remove_dots: false });

// Copies only whitelisted, validated fields onto a plain object.
export function pickToolFields(src) {
  const fields = ["name", "category", "price", "link", "description", "tagline", "image", "tags"];
  return Object.fromEntries(fields.filter((f) => src[f] !== undefined).map((f) => [f, src[f]]));
}

import mongoose from "mongoose";
import { TOOL_STATUS } from "../config/constants.js";
import { slugify } from "../lib/slug.js";

const httpUrl = {
  validator: (v) => !v || /^https?:\/\/.+/.test(v),
  message: "Must be a valid URL starting with http:// or https://",
};

const AIToolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tool name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [140, "Tagline cannot exceed 140 characters"],
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
      index: true,
    },
    // Named `price` for compatibility with existing documents; holds a PRICING value.
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
      maxlength: [50, "Price cannot exceed 50 characters"],
    },
    link: {
      type: String,
      required: [true, "Link is required"],
      trim: true,
      maxlength: [500, "Link cannot exceed 500 characters"],
      validate: httpUrl,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    // Optional: the frontend falls back to the site's favicon when empty.
    image: {
      type: String,
      trim: true,
      maxlength: [500, "Image URL cannot exceed 500 characters"],
      validate: httpUrl,
      default: "",
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
      validate: { validator: (v) => v.length <= 8, message: "At most 8 tags allowed" },
      default: [],
    },
    status: {
      type: String,
      enum: TOOL_STATUS,
      default: "approved",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    upvotes: { type: Number, default: 0, min: 0 },
    visits: { type: Number, default: 0, min: 0 },
    submitterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret.submitterEmail;
        return ret;
      },
    },
  }
);

AIToolSchema.index({ slug: 1 }, { unique: true, sparse: true });
AIToolSchema.index({ featured: -1, upvotes: -1 });

// Generate a unique slug from the name on first save.
AIToolSchema.pre("validate", async function () {
  if (this.slug || !this.name) return;
  const base = slugify(this.name) || "tool";
  let candidate = base;
  for (let i = 2; await this.constructor.exists({ slug: candidate }); i++) {
    candidate = `${base}-${i}`;
  }
  this.slug = candidate;
});

const AITool = mongoose.models.AITool || mongoose.model("AITool", AIToolSchema);
export default AITool;

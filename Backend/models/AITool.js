import mongoose from "mongoose";

const AIToolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tool name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
      index: true,
    },
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
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v),
        message: "Link must be a valid URL starting with http:// or https://",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      maxlength: [500, "Image URL cannot exceed 500 characters"],
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v),
        message: "Image must be a valid URL starting with http:// or https://",
      },
    },
  },
  {
    timestamps: true,
  }
);

const AITool = mongoose.model("AITool", AIToolSchema);
export default AITool;

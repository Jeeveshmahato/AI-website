import mongoose from "mongoose";

const AIToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const AITool = mongoose.model("AITool", AIToolSchema);
export default AITool;
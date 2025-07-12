import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  type: String,
  size: String,
  condition: String,
  tags: [String],
  image: String,
  uploaderEmail: String,
  status: { type: String, default: "available" }, // available | swapped
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);

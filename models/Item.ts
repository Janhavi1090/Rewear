import mongoose from "mongoose";
import Email from "next-auth/providers/email";

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
  swapRequests: [{ 
    email: String, 
    requestedAt: Date,
    status: { type: String, default: "pending" }}]
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);

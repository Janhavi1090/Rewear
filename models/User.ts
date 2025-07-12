import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  points : {type: Number, default: 100},
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);

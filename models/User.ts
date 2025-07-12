import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  points : {type: Number, default: 100},
  notification: [{
    message: String,
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);

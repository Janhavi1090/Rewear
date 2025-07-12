import connectToDatabase from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import Otp from "../../models/Otp";
import User from "../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, otp, password } = req.body;
  if (!name || !email || !otp || !password) return res.status(400).json({ message: "Missing fields" });

  await connectToDatabase();

  const existingOtp = await Otp.findOne({ email, otp });
  if (!existingOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    points: 10,
    notifications: [],
  });

  await newUser.save();
  await Otp.deleteMany({ email }); // cleanup

  res.status(201).json({ message: "User created" });
}

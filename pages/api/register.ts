// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({ message: "User registered", user });
}

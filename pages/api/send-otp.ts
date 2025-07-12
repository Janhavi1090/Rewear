import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongodb";
import Otp from "../../models/Otp";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  await connectToDatabase();

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  await Otp.deleteMany({ email }); // clear any previous
  await Otp.create({ email, otp });

  // Send email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // set in .env
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"ReWear" <noreply@rewear.app>',
    to: email,
    subject: "Your ReWear OTP",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to send email" });
  }
}

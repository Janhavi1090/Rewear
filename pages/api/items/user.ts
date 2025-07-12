import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await connectToDatabase();

  const items = await Item.find({ uploaderEmail: session.user?.email }).sort({ createdAt: -1 });
  res.status(200).json(items);
}

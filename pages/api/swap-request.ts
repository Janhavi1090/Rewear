import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connectToDatabase from "../../lib/mongodb";
import Item from "../../models/Item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await connectToDatabase();

  const { itemId } = req.body;

  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  // Check duplicate swap request
  const alreadyRequested = item.swapRequests?.some(
    (r: { email: string }) => r.email === session.user!.email
  );

  if (alreadyRequested) {
    return res.status(400).json({ message: "You’ve already requested this item." });
  }
  // Add swap request
  item.swapRequests.push({
    email: session.user!.email,
    requestedAt: new Date(),
  });

  await item.save();
  res.status(200).json({ message: "Swap request submitted" });
}


  

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connectToDatabase from "../../lib/mongodb";
import Item from "../../models/Item";
import User from "../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { itemId, requesterEmail, action } = req.body;

  await connectToDatabase();
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  // Only uploader can take action
  if (item.uploaderEmail !== session.user?.email) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Find the specific request
  const request = item.swapRequests.find((r:any) => r.email === requesterEmail);
  if (!request) return res.status(404).json({ message: "Request not found" });

  // Update request status
  request.status = action;
  item.markModified("swapRequests");

  // If accepted, mark item swapped + update points
  if (action === "accepted") {
    item.status = "swapped";

    await User.updateOne(
      { email: requesterEmail },
      {
        $inc: { points: -25 },
        $push: {
          notifications: {
            message: `🎉 Your swap request for "${item.title}" was accepted!`,
          },
        },
      }
    );

    await User.updateOne(
      { email: item.uploaderEmail },
      {
        $inc: { points: 25 },
        $push: {
          notifications: {
            message: `📦 You earned 25 points for giving away "${item.title}"!`,
          },
        },
      }
    );
  }

  // Add rejection notification
  if (action === "rejected") {
    await User.updateOne(
      { email: requesterEmail },
      {
        $push: {
          notifications: {
            message: `❌ Your swap request for "${item.title}" was rejected.`,
          },
        },
      }
    );
  }

  await item.save();
  res.status(200).json({ message: `Request ${action}` });
}

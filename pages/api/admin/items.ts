import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"; // ✅ correct import
import { authOptions } from "../auth/[...nextauth]";
import { isAdmin } from "@/lib/isAdmin";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !isAdmin(session.user?.email || "")) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await connectToDatabase();

  if (req.method === "GET") {
    const items = await Item.find({});
    return res.status(200).json(items);
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body;
    const item = await Item.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json(item);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    await Item.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).end(); // Method Not Allowed
}

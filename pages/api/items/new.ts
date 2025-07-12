
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb"
import Item from "../../../models/Item";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectToDatabase();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, category, type, size, condition, tags, image } = req.body;

  const config = {
    api: {
      bodyParser: {
        sizeLimit: "4mb", // or "10mb" if needed
      },
    },
  };

  try {
    const item = await Item.create({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      image,
      uploaderEmail: session.user.email,
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
}

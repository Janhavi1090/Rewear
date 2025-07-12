import { GetServerSideProps } from "next";
import connectToDatabase from "../../lib/mongodb";
import Item from "@/models/Item";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import "./item-detail.css";

export default function ItemDetail({ item, isOwner }: any) {
  if (!item) return <p>Item not found</p>;

  const handleAction = async (type: "swap" | "redeem") => {
    const res = await fetch("/api/swap-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item._id }),
    });
  
    const data = await res.json();
    alert(data.message);
  };
  

  

  return (
    <div className="dreamy-wrapper">
  <div className="emoji emoji-1">👚</div>
  <div className="emoji emoji-2">💖</div>
  <div className="emoji emoji-3">🌈</div>

  <div className="dreamy-card">
    <div className="image-panel">
      <Image
        src={item.image}
        alt={item.title}
        width={500}
        height={500}
        className="rounded-lg object-cover dreamy-image"
      />
    </div>

    <div className="info-panel">
      <h1>{item.title}</h1>
      <p className="desc">{item.description}</p>

      <div className="meta">
        <p>👗 Size: {item.size}</p>
        <p>🧼 Condition: {item.condition}</p>
        <p>🏷️ Tags: {item.tags?.join(", ")}</p>
        <p>📁 Category: {item.category}</p>
        <p>🔖 Type: {item.type}</p>
        <p>
          📦 Status:{" "}
          <span className={item.status === "available" ? "green" : "red"}>
            {item.status}
          </span>
        </p>
        <p>📩 Uploaded by: <strong>{item.uploaderEmail}</strong></p>
      </div>

      {!isOwner && item.status === "available" && (
        <div className="dreamy-btns">
          <button onClick={() => handleAction("swap")}>🔄 Request Swap</button>
          <button onClick={() => handleAction("redeem")}>✨ Redeem via Points</button>
        </div>
      )}

      {isOwner && (
        <p className="note">🧸 You uploaded this item.</p>
      )}
    </div>
  </div>
</div>

  );
}

// Fetch item from DB
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  await connectToDatabase();
  const session = await getServerSession(context.req, context.res, authOptions);

  const rawItem = await Item.findById(id);
if (!rawItem) return { notFound: true };

const plainItem = rawItem.toObject();


  if (!rawItem) return { notFound: true };

  const item = {
    _id: plainItem._id.toString(),
    title: plainItem.title || "",
    description: plainItem.description || "",
    category: plainItem.category || "",
    type: plainItem.type || "",
    size: plainItem.size || "",
    condition: plainItem.condition || "",
    tags: plainItem.tags || [],
    image: plainItem.image || null,
    uploaderEmail: plainItem.uploaderEmail || "unknown",
    status: plainItem.status || "available",
    swapRequests: (plainItem.swapRequests || []).map((req: any) => ({
      email: req.email,
      requestedAt: req.requestedAt.toString(), // optional
    })),
  };

  const isOwner = session?.user?.email === item.uploaderEmail;

  return {
    props: { item, isOwner },
  };
};

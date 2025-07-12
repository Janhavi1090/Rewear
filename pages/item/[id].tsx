import { GetServerSideProps } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function ItemDetail({ item, isOwner }: any) {
  if (!item) return <p>Item not found</p>;

  const handleAction = async (type: "swap" | "redeem") => {
    alert(`This would trigger a ${type.toUpperCase()} action in a real app.`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div>
          <Image
            src={item.image}
            alt={item.title}
            width={500}
            height={500}
            className="rounded-md object-cover w-full h-auto"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="text-gray-600">{item.description}</p>
          <p className="text-sm text-gray-500">Size: {item.size}</p>
          <p className="text-sm text-gray-500">Condition: {item.condition}</p>
          <p className="text-sm text-gray-500">Tags: {item.tags?.join(", ")}</p>
          <p className="text-sm text-gray-500">Category: {item.category}</p>
          <p className="text-sm text-gray-500">Type: {item.type}</p>
          <p className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={
                item.status === "available"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {item.status}
            </span>
          </p>

          <p className="text-sm">Uploaded by: <strong>{item.uploaderEmail}</strong></p>

          {!isOwner && item.status === "available" && (
            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleAction("swap")}
              >
                Request Swap
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={() => handleAction("redeem")}
              >
                Redeem via Points
              </button>
            </div>
          )}

          {isOwner && (
            <p className="text-sm text-yellow-600 mt-4">You uploaded this item.</p>
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
    ...rawItem,
    _id: rawItem._id.toString(),
    image: rawItem.image || null,
    uploaderEmail: rawItem.uploaderEmail || "unknown",
    tags: rawItem.tags || [],
    status: rawItem.status || "available",
  };

  const isOwner = session?.user?.email === item.uploaderEmail;

  return {
    props: { item, isOwner },
  };
};

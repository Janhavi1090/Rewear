import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Item = {
  _id: string;
  title: string;
  image: string;
  status: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/items/user")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  if (status === "loading") return <p className="p-8">Loading session...</p>;
  if (!session) return <p className="p-8">You must be logged in to view this page.</p>;

  const user = session.user;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.name || user?.email || "ReWear User"}
      </h1>

      <h2 className="text-xl mb-2">Your Uploaded Items</h2>
      {items.length === 0 ? (
        <p>
          No items listed yet.{" "}
          <Link href="/item/new" className="text-blue-600 underline">
            Add one
          </Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="font-semibold">{item.title}</h3>
              <p
                className={`text-sm ${
                  item.status === "available" ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.status}
              </p>
              <Link
                href={`/item/${item._id}`}
                className="text-blue-500 underline text-sm mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

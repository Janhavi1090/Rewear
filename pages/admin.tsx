import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

type Item = {
  _id: string;
  title: string;
  category: string;
  status: string;
};

export default function AdminPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session || !session.user?.email) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/items");
      if (!res.ok) return alert("Not authorized");

      const data = await res.json();
      setItems(data);
    };

    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status } : item
      )
    );
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    await fetch("/api/admin/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin Panel 👑</h1>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className={`text-xs ${item.status === 'approved' ? 'text-green-600' : item.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                {item.status}
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => updateStatus(item._id, "approved")} className="text-green-600">✅</button>
              <button onClick={() => updateStatus(item._id, "rejected")} className="text-yellow-600">🚫</button>
              <button onClick={() => deleteItem(item._id)} className="text-red-600">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

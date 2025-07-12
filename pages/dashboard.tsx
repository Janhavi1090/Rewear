import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "./dashboard.css";

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

  if (status === "loading") return <p className="loading">Loading session...</p>;
  if (!session)
    return (
      <div className="login-message">
        <div className="login-box">
          <h2>🚪 Hold up, fashionista!</h2>
          <p>You need to be logged in to access your ✨ closet dashboard ✨.</p>
          <Link href="/login" className="login-btn">Login or Register</Link>
        </div>
      </div>
    );
  
  const user = session.user;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">
        Welcome, <span className="username">{user?.name || user?.email || "ReWear Babe"}</span>
      </h1>

      <h2 className="section-title">🛍️ Your Closet Collection</h2>

      {items.length === 0 ? (
        <p className="empty-msg">
          No items listed yet.{" "}
          <Link href="/item/new" className="add-link">
            Add one!
          </Link>
        </p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={item.image} alt={item.title} className="item-img" />
              <h3 className="item-name">{item.title}</h3>
              <p className={`item-status ${item.status}`}>
                {item.status === "available" ? "✅ Available" : "❌ Swapped"}
              </p>
              <Link href={`/item/${item._id}`} className="details-link">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

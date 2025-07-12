import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "./dashboard.css";

type SwapRequest = {
  email: string;
  status: string;
};

type Item = {
  _id: string;
  title: string;
  image: string;
  status: string;
  swapRequests?: SwapRequest[];
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

  const handleSwapAction = async (itemId: string, requesterEmail: string, action: string) => {
    const res = await fetch("/api/swap-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, requesterEmail, action }),
    });

    const result = await res.json();
    alert(result.message);
    // Refresh closet after action
    fetch("/api/items/user")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">
        Welcome, <span className="username">{user?.name || "ReWear Babe"}</span>
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

              {/* SWAP REQUESTS */}
              {item.swapRequests && item.swapRequests.length > 0 && (
                <div className="swap-requests">
                  <h4 className="section-title">🔁 Swap Requests:</h4>
                  {item.swapRequests.map((req) => (
                    <div key={req.email} className="swap-request-entry">
                      <p>📧 {req.email}</p>
                      <p>Status: <strong>{req.status}</strong></p>

                      {req.status === "pending" && item.status === "available" && (
                        <div className="action-buttons">
                          <button
                            className="accept-btn"
                            onClick={() => handleSwapAction(item._id, req.email, "accepted")}
                          >
                            ✅ Accept
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleSwapAction(item._id, req.email, "rejected")}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

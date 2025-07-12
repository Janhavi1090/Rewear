import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = () => {
    signOut({ redirect: false });
    alert("Logged out 💨"); // You can replace this with a toast if using a toast lib
  };

  return (
    <nav className="nav-container">
      <div className="nav-inner">
        <Link href="/" className="logo">👚 ReWear</Link>

        <div className="nav-links">
          <Link href="/dashboard">Closet</Link>
          <Link href="/item/new">Add Item</Link>
          <Link href="/items">Browse</Link>
        </div>

        <div className="nav-auth">
          {status === "authenticated" ? (
            <div className="dropdown-wrapper">
              <div className="user-info" onClick={() => setOpenDropdown(!openDropdown)}>
                <img
                  src={session.user?.image || "/default-avatar.jpg"}
                  alt="Profile"
                  className="avatar"
                />
                <span className="user-name">
                  {session.user?.name?.split(" ")[0] || "Babe"}
                </span>
              </div>

              {openDropdown && (
                <div className="dropdown">
                  <Link href="/dashboard">📂 Dashboard</Link>
                  <Link href="/item/new">🪡 Add Item</Link>
                  <Link href="/items">🔍 Browse</Link>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-btn">Login</Link>
              <Link href="/register" className="nav-btn primary">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

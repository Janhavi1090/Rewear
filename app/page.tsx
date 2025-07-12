import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="homepage">
      {/* Sticky Announcement */}
      <div className="announcement-bar">
        ✨ Swapping clothes never looked this cute — join the movement ✨
      </div>

      {/* Header */}
      <header className="hero">
        <h1 className="headline">
          Welcome to <span className="brand">ReWear</span>
        </h1>
        <p className="subtext">
          Your ✿ community-powered ✿ fashion exchange hub — let's make sustainable look *sooo good*.
        </p>

        <div className="button-group">
          <Link href="/item/new" className="btn dark">List an Item</Link>
          <Link href="/dashboard" className="btn pink">Start Swapping</Link>
          <Link href="/items" className="btn outline">Browse Items</Link>
        </div>
      </header>

      {/* Featured Items */}
      <section className="featured">
        <h2 className="section-heading">🌼 Featured Picks</h2>
        <div className="items-grid">
          {[1, 2, 3].map((num) => (
            <div key={num} className="item-card">
              <div className="image-box"></div>
              <p className="item-title">Item {num}</p>
              <p className="item-subtext">Your next closet crush 💘</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="why">
        <h3 className="why-heading">🌍 Why ReWear?</h3>
        <p className="why-text">
          We give your clothes a second life (and a second chance to slay). Join the swap party & save the planet in style. 💅
        </p>
      </section>
    </div>
  );
}

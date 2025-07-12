import Link from "next/link";
import Image from "next/image";
import connectToDatabase from '../lib/mongodb';
import Item from "@/models/Item";
import "./browse.css"; 

export default function BrowseItems({ items }: any) {
  const handleSurpriseSwap = () => {
    const random = items[Math.floor(Math.random() * items.length)];
    if (random) window.location.href = `/item/${random._id}`;
  };

  return (
    <div className="browse-wrapper">
      <h1>🎀 Browse Available Items</h1>

      <div className="grid-gallery">
        {items.map((item: any) => (
          <Link key={item._id} href={`/item/${item._id}`} className="card">
            <div className="img-wrap">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={300}
                className="item-img"
              />
              <span className="tap-to-swap">🔄 Tap to Swap</span>
            </div>
            <div className="card-content">
              <h2>{item.title}</h2>
              <p>{item.category}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="surprise-btn-wrapper">
        <button className="surprise-btn" onClick={handleSurpriseSwap}>
          🎁 Surprise Me!
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const rawItems = await Item.find({ status: "available" }).lean();

  const items = rawItems.map((i: any) => ({
    ...i,
    _id: i._id.toString(),
    image: i.image || "/placeholder.jpg",
    createdAt: i.createdAt?.toISOString() || null,
    updatedAt: i.updatedAt?.toISOString() || null,
  }));

  return { props: { items } };
}

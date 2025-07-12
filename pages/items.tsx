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

const items = rawItems.map((i: any) => {
  return {
    _id: i._id.toString(),
    title: i.title || "",
    image: i.image || "/placeholder.jpg",
    createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : null,
    updatedAt: i.updatedAt ? new Date(i.updatedAt).toISOString() : null,
    status: i.status || "available",
    uploaderEmail: i.uploaderEmail || "unknown",
    tags: i.tags || [],
    swapRequests: Array.isArray(i.swapRequests)
      ? i.swapRequests.map((req: any) => ({
          email: req.email || "unknown",
          requestedAt: req.requestedAt
            ? new Date(req.requestedAt).toISOString()
            : null,
        }))
      : [],
  };
});

console.log("items JSON", JSON.stringify(items, null, 2));


  return { props: { items } };
}

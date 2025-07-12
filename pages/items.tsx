import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";

export default function BrowseItems({ items }: any) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Browse Available Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((item: any) => (
          <Link key={item._id} href={`/item/${item._id}`} className="bg-white rounded shadow hover:shadow-lg transition">
            <div>
              <Image src={item.image} alt={item.title} width={400} height={300} className="rounded-t w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
          </Link>
        ))}
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
  }));

  return { props: { items } };
}

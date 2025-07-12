import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen text-center p-6">
        <section className="max-w-4xl mx-auto py-16">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-blue-600">ReWear</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            A community-powered clothing exchange platform to help reduce textile waste and embrace sustainable fashion.
          </p>

          <div className="flex justify-center gap-4 mb-10">
            <Link href="/item/new" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              List an Item
            </Link>
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Start Swapping
            </Link>
            <Link href="/items" className="bg-white border px-6 py-2 rounded hover:bg-gray-100">
              Browse Items
            </Link>
          </div>

          {/* Static Featured Items */}
          <h2 className="text-xl font-semibold mb-6">🌟 Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white p-4 rounded shadow-md">
                <div className="bg-gray-200 h-40 mb-2 rounded"></div>
                <p className="font-semibold">Item {num}</p>
                <p className="text-sm text-gray-500">Nice sustainable piece</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold">♻️ Why ReWear?</h3>
            <p className="text-sm text-gray-600 mt-2">
              ReWear helps you give unused clothes a second life through swaps or point redemptions — good for your wardrobe, better for the planet.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

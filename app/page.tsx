// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">👚 ReWear</h1>
        <p className="text-gray-600 mb-6">
          A community-driven clothing exchange platform to promote sustainable fashion.
        </p>
        <div className="space-y-3">
          <Link href="/login">
            <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="w-full border border-gray-700 text-gray-800 py-2 px-4 rounded hover:bg-gray-100 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

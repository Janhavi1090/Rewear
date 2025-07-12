// pages/dashboard.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";

type DashboardProps = {
  user: {
    name?: string;
    email?: string;
  };
};

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email} 👋</h1>
        <p className="text-gray-600 mb-4">You're now in your ReWear dashboard.</p>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        user: {
          name: session.user?.name ?? null,
          email: session.user?.email ?? null,
          image: session.user?.image ?? null, // <-- ✅ THIS LINE FIXES THE ERROR
        },
      },
    };
  };
  

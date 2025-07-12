import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import "./scrapbook.css";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("🚫 Invalid email or password");
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="scrapbook-container">
      <div className="tabs">
        <a href="/login" className="tab active">📁 Login</a>
        <a href="/register" className="tab">📂 Register</a>
      </div>

      <div className="scrapbook-card">
        <h2>🔐 Unlock Your Closet</h2>
        <p className="note">Welcome back, style queen ✨</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleLogin} className="scrap-form">
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔐 Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "✨ Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

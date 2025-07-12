import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import "./scrapbook.css";

export default function Register() {
  const router = useRouter();

  const [step, setStep] = useState<"register" | "verify">("register");
  const [form, setForm] = useState({ name:"", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name,
          email: form.email,
          password: form.password,
          otp,}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("🚫 " + data.message);
      } else {
        setStep("verify");
      }
    } catch {
      setError("🚫 Something went wrong while sending OTP.");
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      console.log("🔐 Sending OTP verify payload:", {
        name: form.name,
        email: form.email,
        password: form.password,
        otp,
      });
      
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name:form.name, email: form.email, otp, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("🚫 " + data.message);
        setLoading(false);
        return;
      }

      // Auto login after success
      const login = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (login?.error) {
        setError("🚫 Login failed after registration.");
      } else {
        router.replace("/dashboard");
      }

    } catch {
      setError("🚫 OTP verification failed.");
    }

    setLoading(false);
  };

  return (
    <div className="scrapbook-container">
      <div className="tabs">
        <a href="/login" className="tab">📁 Login</a>
        <a href="/register" className="tab active">📂 Register</a>
      </div>

      <div className="scrapbook-card">
        <h2>💖 Join the ReWear Club</h2>
        <p className="note">Sign up to slay & swap sustainably 🌱</p>

        {error && <p className="auth-error">{error}</p>}

        {step === "register" && (
          <form onSubmit={handleSendOtp} className="scrap-form">
            <input
              type="name"
              name="name"
              placeholder="❣️ Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔐 Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "✨ Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="scrap-form">
            <div className="otp-box">
              <label htmlFor="otp">🔢 Enter OTP sent to {form.email}</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                pattern="\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="otp-input"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "🔄 Verifying..." : "Verify & Join"}
            </button>

            <p className="note" style={{ marginTop: "1rem" }}>
              Didn’t get the code?{" "}
              <button type="button" onClick={handleSendOtp} className="resend-btn">
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

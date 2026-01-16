// pages/login.jsx
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <div className="card">
        <h1>Login to Digital Garden</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>Welcome back! Sign in to access your notes.</p>

        {error && (
          <div style={{ 
            padding: 12, 
            background: "rgba(220,38,38,0.1)", 
            border: "1px solid var(--danger)",
            borderRadius: 8,
            color: "var(--danger)",
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Email</label>
            <input 
              type="email" 
              className="input"
              value={email} 
              placeholder="your@email.com" 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input"
              value={password} 
              placeholder="Enter password" 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: "100%", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", color: "var(--muted)" }}>
          Don't have an account? <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

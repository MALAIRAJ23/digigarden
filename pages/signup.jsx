import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: "60px auto" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2>Account Created!</h2>
          <p style={{ color: "var(--muted)" }}>
            Check your email to verify your account. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <div className="card">
        <h1>Create Account</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          Start your Digital Garden journey today.
        </p>

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

        <form onSubmit={handleSignup}>
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
              placeholder="At least 6 characters" 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input 
              type="password" 
              className="input"
              value={confirmPassword} 
              placeholder="Re-enter password" 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: "100%", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", color: "var(--muted)" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
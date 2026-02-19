import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://localhost:5000";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }
      if (data.user) {
        localStorage.setItem("sajilo_user", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        navigate("/contributors", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <section className="card login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to secure your account and continue accessing our services.
          </p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-label">Email</span>
            <input
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-field">
            <span className="login-label">Password</span>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="button"
            className="login-link login-link-muted"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="primary-btn login-button"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="login-links">
          <span className="login-links-separator">·</span>
          <Link to="/signup" className="login-link">
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Login;

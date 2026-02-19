import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const API_BASE = "http://localhost:5000";

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page signup-page">
      <section className="card signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Sign up to start contributing routes and stops to Sajilo Yatra and
            earn points for every helpful contribution you make.
          </p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-field">
            <span className="signup-label">Full name</span>
            <input
              type="text"
              className="signup-input"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">Email</span>
            <input
              type="email"
              className="signup-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">Password</span>
            <input
              type="password"
              className="signup-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">Confirm Password</span>
            <input
              type="password"
              className="signup-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="primary-btn signup-button"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="signup-helper">
          As we expand, your contributions can unlock rewards based on the
          points you earn from sharing accurate routes and local knowledge.
        </p>

        <p className="signup-helper">
          <Link to="/login">Already have an account? Log in</Link>
        </p>
      </section>
    </div>
  );
}

export default Signup;

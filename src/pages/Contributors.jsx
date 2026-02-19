import { useEffect, useState } from "react";
import "./Contributors.css";

const API_BASE = "http://localhost:5000";

function Contributors({ user, onUserUpdate }) {
  const [stops, setStops] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    from_stop_id: "",
    to_stop_id: "",
    bus_name: "",
    remarks: "",
    photo: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchStops = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stops`);
      const data = await res.json().catch(() => []);
      if (res.ok) setStops(Array.isArray(data) ? data : []);
    } catch {
      setStops([]);
    }
  };

  const fetchContributions = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/contributions?user_id=${user.id}`,
      );
      const data = await res.json().catch(() => []);
      if (res.ok) setContributions(Array.isArray(data) ? data : []);
      else setError(data.error || "Failed to load contributions");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/${user.id}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        onUserUpdate(data);
        localStorage.setItem("sajilo_user", JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      await fetchStops();
      await fetchContributions();
      await refreshUser();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const asked = contributions.filter(
    (c) => c.status === "pending" || c.status === "rejected",
  );
  const accepted = contributions.filter((c) => c.status === "approved");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!form.from_stop_id || !form.to_stop_id || !form.bus_name.trim()) {
      setSubmitError("Please select pickup, stop and bus name.");
      return;
    }
    if (form.from_stop_id === form.to_stop_id) {
      setSubmitError("Pickup and drop must be different.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("user_id", user.id);
      fd.append("from_stop_id", form.from_stop_id);
      fd.append("to_stop_id", form.to_stop_id);
      fd.append("bus_name", form.bus_name.trim());
      if (form.remarks.trim()) fd.append("remarks", form.remarks.trim());
      if (form.photo) fd.append("photo", form.photo);
      const res = await fetch(`${API_BASE}/api/contributions`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit");
        return;
      }
      setForm({
        from_stop_id: "",
        to_stop_id: "",
        bus_name: "",
        remarks: "",
        photo: null,
      });
      await fetchContributions();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const stopName = (c) => {
    const from =
      c.from_stop?.name ||
      stops.find((s) => s.id === c.from_stop_id)?.name ||
      `#${c.from_stop_id}`;
    const to =
      c.to_stop?.name ||
      stops.find((s) => s.id === c.to_stop_id)?.name ||
      `#${c.to_stop_id}`;
    return `${from} → ${to}`;
  };

  return (
    <div className="page contributors-page">
      <div className="contributors-wrap">
        {/* Rewards / points hero */}
        <section className="contributors-rewards">
          <div className="contributors-rewards-inner">
            <div className="contributors-rewards-card">
              <div className="contributors-rewards-left">
                <p className="contributors-welcome">
                  Welcome Back, {user?.full_name ?? "User"}
                </p>
                <h1 className="contributors-rewards-title">
                  Your Reward Points
                </h1>
                <div className="contributors-points-block">
                  <span className="contributors-points-value">
                    {user?.reward_points ?? 0}
                  </span>
                  <span className="contributors-points-label">Points</span>
                </div>
                <p className="contributors-rewards-hint">
                  Earn 1 point for each approved route. Redeem points for
                  rewards later.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="contributors-card">
          {loading && <p className="contributors-loading">Loading…</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="contributors-layout">
            <form onSubmit={handleSubmit} className="contributors-form">
              <div className="contributors-field">
                <label className="contributors-label">Pickup stop</label>
                <select
                  value={form.from_stop_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, from_stop_id: e.target.value }))
                  }
                  className="contributors-input"
                  required
                >
                  <option value="">Select stop</option>
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contributors-field">
                <label className="contributors-label">Drop stop</label>
                <select
                  value={form.to_stop_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, to_stop_id: e.target.value }))
                  }
                  className="contributors-input"
                  required
                >
                  <option value="">Select stop</option>
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contributors-field">
                <label className="contributors-label">Bus / vehicle name</label>
                <input
                  type="text"
                  value={form.bus_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bus_name: e.target.value }))
                  }
                  placeholder="e.g. Sajha Yatayat"
                  className="contributors-input"
                  required
                />
              </div>
              <div className="contributors-field">
                <label className="contributors-label">Remarks (optional)</label>
                <textarea
                  value={form.remarks}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, remarks: e.target.value }))
                  }
                  placeholder="Why you're suggesting this route…"
                  className="contributors-input contributors-textarea"
                  rows={3}
                />
              </div>
              <div className="contributors-field">
                <label className="contributors-label">Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      photo: e.target.files?.[0] || null,
                    }))
                  }
                  className="contributors-input"
                />
              </div>
              {submitError && <p className="error-text">{submitError}</p>}
              <button
                type="submit"
                className="primary-btn contributors-submit"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit for review"}
              </button>
            </form>

            <aside className="contributors-side">
              <div className="contributors-side-content">
                <header className="contributors-header">
                  <h2 className="contributors-title">Contribute & Earn</h2>
                  <p className="contributors-subtitle">
                    Suggest new routes. When an admin approves your proposal,
                    you get reward points.
                  </p>
                </header>

                <div className="contributors-side-header">
                  <h2 className="contributors-side-title">Propose a Route</h2>
                  <p className="contributors-side-caption">
                    Select pickup and drop stops, enter the bus/vehicle name and
                    optional photo. It will be sent for admin review.
                  </p>
                </div>

                <section className="contributors-section">
                  <h2 className="contributors-section-title">
                    Your Proposed Changes
                  </h2>
                  <p className="contributors-caption">
                    Pending or Rejected Proposals.
                  </p>
                  {asked.length === 0 ? (
                    <p className="contributors-empty">No pending Proposals.</p>
                  ) : (
                    <ul className="contributors-list">
                      {asked.map((c) => (
                        <li key={c.id} className="contributors-list-item">
                          <div>
                            <strong>{stopName(c)}</strong> — {c.bus_name}
                            <span
                              className={`contributors-status contributors-status-${c.status}`}
                            >
                              {c.status}
                            </span>
                            {c.remarks && (
                              <p className="contributors-remarks">
                                {c.remarks}
                              </p>
                            )}
                          </div>
                          {c.image_url && (
                            <img
                              src={c.image_url}
                              alt=""
                              className="contributors-thumb"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="contributors-section">
                  <h2 className="contributors-section-title">
                    Accepted changes
                  </h2>
                  <p className="contributors-caption">
                    Proposals approved by admin (+1 point each).
                  </p>
                  {accepted.length === 0 ? (
                    <p className="contributors-empty">None yet.</p>
                  ) : (
                    <ul className="contributors-list">
                      {accepted.map((c) => (
                        <li key={c.id} className="contributors-list-item">
                          <div>
                            <strong>{stopName(c)}</strong> — {c.bus_name}
                            <span className="contributors-status contributors-status-approved">
                              approved
                            </span>
                            {c.remarks && (
                              <p className="contributors-remarks">
                                {c.remarks}
                              </p>
                            )}
                          </div>
                          {c.image_url && (
                            <img
                              src={c.image_url}
                              alt=""
                              className="contributors-thumb"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contributors;

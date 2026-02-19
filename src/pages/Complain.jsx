import { useState } from "react";
import { FiShield } from "react-icons/fi";
import "./Complain.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Complain() {
  const [form, setForm] = useState({
    type: "overcharged",
    vehicle_number: "",
    organization: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [latestComplaint, setLatestComplaint] = useState(null);

  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitted(false);
    setLookupResult(null);

    if (!form.vehicle_number.trim() || !form.organization.trim()) {
      setError("Please fill in vehicle number and organization.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to submit complaint.");
        return;
      }

      setSubmitted(true);
      setLatestComplaint(data || null);
      setLookupId(data?.id != null ? String(data.id) : "");
      setSuccess(
        "Thank you. Your report has been sent for review and will help keep transport safe and fair.",
      );

      setForm((prev) => ({
        ...prev,
        description: "",
      }));
    } catch {
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    const id = lookupId.trim();
    if (!id) {
      return;
    }

    setLookupResult(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/complaints/${encodeURIComponent(id)}`,
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.id) {
        setLookupResult({ error: data.error || "Complaint not found." });
        return;
      }

      setLookupResult({
        status: data.status,
        type: data.type,
        vehicle_number: data.vehicle_number,
        organization: data.organization,
      });
    } catch {
      setLookupResult({ error: "Failed to check status. Please try again." });
    }
  };

  return (
    <div className="page-complain-page">
      <div className="complain-inner">
        <section className="complain-card">
          <header className="complain-header">
            <h1 className="complain-title">Report an Issue</h1>
            <p className="complain-subtitle">
              Overcharged or felt unsafe? Tell us the bus number and operator so
              we can help keep transport fair and safe for everyone.
            </p>
          </header>

          <div className="complain-layout">
            <form className="complain-form" onSubmit={handleSubmit}>
              <div className="complain-field">
                <label className="complain-label">What happened?</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                  className="complain-input"
                >
                  <option value="overcharged">I was overcharged</option>
                  <option value="unsafe">Felt unsafe / Harassment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="complain-field">
                <label className="complain-label">Vehicle number</label>
                <input
                  type="text"
                  value={form.vehicle_number}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, vehicle_number: e.target.value }))
                  }
                  placeholder="e.g. Na 1 Pa 2345"
                  className="complain-input"
                  required
                />
              </div>

              <div className="complain-field">
                <label className="complain-label">
                  Vehicle organization / company
                </label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, organization: e.target.value }))
                  }
                  placeholder="e.g. Sajha Yatayat, Metro Bus"
                  className="complain-input"
                  required
                />
              </div>

              <div className="complain-field">
                <label className="complain-label">Details (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Route, time, or what happened…"
                  className="complain-input complain-textarea"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="primary-btn complain-submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit report"}
              </button>

              {error && <p className="complain-error">{error}</p>}

              {submitted && (
                <div className="complain-success-block">
                  <p className="complain-success">{success}</p>
                  {latestComplaint && (
                    <p className="complain-ref">
                      Your complaint ID: <strong>{latestComplaint.id}</strong>.
                      Keep this ID to track the status.
                    </p>
                  )}
                </div>
              )}

              <div className="complain-status-check">
                <h2 className="complain-status-title">
                  Check complaint status
                </h2>
                <p className="complain-status-text">
                  Enter your complaint ID to see if it is pending, solved, or
                  removed.
                </p>
                <div className="complain-status-row">
                  <input
                    type="text"
                    className="complain-input complain-status-input"
                    placeholder="Complaint ID"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                  />
                  <button
                    type="button"
                    className="primary-btn complain-status-button"
                    onClick={handleCheckStatus}
                  >
                    Check status
                  </button>
                </div>
                {lookupResult && (
                  <div className="complain-status-result">
                    {lookupResult.error ? (
                      <p className="complain-error">{lookupResult.error}</p>
                    ) : (
                      <>
                        <p>
                          Current status: <strong>{lookupResult.status}</strong>
                        </p>
                        {lookupResult.organization && (
                          <p>
                            Vehicle: {lookupResult.organization} (
                            {lookupResult.type})
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>

            <aside className="complain-side">
              <div className="complain-side-card">
                <div className="complain-icon-row">
                  <div className="complain-icon-wrap" aria-hidden="true">
                    <FiShield className="complain-icon" />
                  </div>
                </div>
                <h2 className="complain-side-title">Safe & fair transport</h2>
                <p className="complain-side-text">
                  Your report helps us and authorities keep fares transparent
                  and journeys safe. We review every submission.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Complain;

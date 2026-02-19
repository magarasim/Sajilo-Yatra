import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [proposedRoutes, setProposedRoutes] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [vehicleForm, setVehicleForm] = useState({
    id: null,
    name: "",
    image: null,
  });
  const [stopForm, setStopForm] = useState({
    id: null,
    name: "",
    latitude: "",
    longitude: "",
  });
  const [routeForm, setRouteForm] = useState({
    id: null,
    vehicle_id: "",
    from_stop_id: "",
    to_stop_id: "",
    fare: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [vehRes, stopRes, routeRes, propRes, complaintRes] =
        await Promise.all([
          fetch(`${API_BASE}/vehicles`),
          fetch(`${API_BASE}/stops`),
          fetch(`${API_BASE}/routes`),
          fetch(`${API_BASE}/proposed-routes`),
          fetch(`${API_BASE}/complaints`),
        ]);

      const [vehData, stopData, routeData, propData, complaintData] =
        await Promise.all([
          vehRes.json(),
          stopRes.json(),
          routeRes.json(),
          propRes.json().catch(() => []),
          complaintRes.json().catch(() => []),
        ]);

      if (
        !vehRes.ok ||
        !stopRes.ok ||
        !routeRes.ok ||
        !complaintRes.ok
      ) {
        throw new Error(
          vehData.error ||
            stopData.error ||
            routeData.error ||
            complaintData.error ||
            "Failed to load admin data"
        );
      }

      setVehicles(vehData);
      setStops(stopData);
      setRoutes(routeData);
      setProposedRoutes(Array.isArray(propData) ? propData : []);
      setComplaints(Array.isArray(complaintData) ? complaintData : []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", vehicleForm.name);
      if (vehicleForm.image) {
        formData.append("image", vehicleForm.image);
      }

      const isEdit = Boolean(vehicleForm.id);
      const url = isEdit
        ? `${API_BASE}/vehicles/${vehicleForm.id}`
        : `${API_BASE}/vehicles`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to save vehicle");
      }

      setVehicleForm({ id: null, name: "", image: null });
      await fetchAll();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      setError(err.message || "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleEdit = (vehicle) => {
    setVehicleForm({ id: vehicle.id, name: vehicle.name, image: null });
  };

  const handleVehicleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete vehicle");
      }
      await fetchAll();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError(err.message || "Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleStopSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload = {
        name: stopForm.name,
        latitude: stopForm.latitude,
        longitude: stopForm.longitude,
      };

      const isEdit = Boolean(stopForm.id);
      const url = isEdit
        ? `${API_BASE}/stops/${stopForm.id}`
        : `${API_BASE}/stops`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to save stop");
      }

      setStopForm({ id: null, name: "", latitude: "", longitude: "" });
      await fetchAll();
    } catch (err) {
      console.error("Error saving stop:", err);
      setError(err.message || "Failed to save stop");
    } finally {
      setLoading(false);
    }
  };

  const handleStopEdit = (stop) => {
    setStopForm({
      id: stop.id,
      name: stop.name,
      latitude: stop.latitude,
      longitude: stop.longitude,
    });
  };

  const handleStopDelete = async (id) => {
    if (!window.confirm("Delete this stop?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/stops/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete stop");
      }
      await fetchAll();
    } catch (err) {
      console.error("Error deleting stop:", err);
      setError(err.message || "Failed to delete stop");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload = {
        vehicle_id: routeForm.vehicle_id,
        from_stop_id: routeForm.from_stop_id,
        to_stop_id: routeForm.to_stop_id,
        fare: routeForm.fare,
      };

      const isEdit = Boolean(routeForm.id);
      const url = isEdit
        ? `${API_BASE}/routes/${routeForm.id}`
        : `${API_BASE}/routes`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to save route");
      }

      setRouteForm({
        id: null,
        vehicle_id: "",
        from_stop_id: "",
        to_stop_id: "",
        fare: "",
      });
      await fetchAll();
    } catch (err) {
      console.error("Error saving route:", err);
      setError(err.message || "Failed to save route");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteEdit = (route) => {
    setRouteForm({
      id: route.id,
      vehicle_id: route.vehicle_id,
      from_stop_id: route.from_stop_id,
      to_stop_id: route.to_stop_id,
      fare: route.fare,
    });
  };

  const handleRouteDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/routes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete route");
      }
      await fetchAll();
    } catch (err) {
      console.error("Error deleting route:", err);
      setError(err.message || "Failed to delete route");
    } finally {
      setLoading(false);
    }
  };

  const handleProposedApprove = async (id) => {
    if (
      !window.confirm(
        "Approve this proposal? A new vehicle and route will be created and the contributor gets 1 reward point."
      )
    )
      return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/proposed-routes/${id}/approve`, {
        method: "PUT",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to approve");
      await fetchAll();
    } catch (err) {
      console.error("Error approving proposal:", err);
      setError(err.message || "Failed to approve");
    } finally {
      setLoading(false);
    }
  };

  const handleProposedDelete = async (id) => {
    if (!window.confirm("Delete this proposed route?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/proposed-routes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }
      await fetchAll();
    } catch (err) {
      console.error("Error deleting proposal:", err);
      setError(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintStatusChange = async (id, status) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to update complaint status");
      }
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: data.status } : c))
      );
    } catch (err) {
      console.error("Error updating complaint status:", err);
      setError(err.message || "Failed to update complaint status");
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete complaint");
      }
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
      setError(err.message || "Failed to delete complaint");
    } finally {
      setLoading(false);
    }
  };

  const proposedRouteLabel = (p) => {
    const from =
      stops.find((s) => s.id === p.from_stop_id)?.name ||
      `Stop #${p.from_stop_id}`;
    const to =
      stops.find((s) => s.id === p.to_stop_id)?.name ||
      `Stop #${p.to_stop_id}`;
    return { from, to };
  };

  return (
    <div className="page admin-page">
      <section className="card">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Curate vehicles, stops and routes that power Sajilo Yatra.
            </p>
          </div>

          {loading && <p className="admin-chip">Syncing with Supabase…</p>}
        </header>

        {error && <p className="error-text">{error}</p>}

        <div className="admin-sections-grid">
          <section className="admin-section">
            <h2>Vehicles</h2>
            <p className="admin-section-caption">
              Add buses, microbuses or tempos with images that show up in search
              results.
            </p>

            <form onSubmit={handleVehicleSubmit} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">
                  Name
                  <input
                    type="text"
                    value={vehicleForm.name}
                    onChange={(e) =>
                      setVehicleForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <div className="admin-field">
                <label className="admin-label">
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setVehicleForm((prev) => ({
                        ...prev,
                        image: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  {vehicleForm.id ? "Update vehicle" : "Add vehicle"}
                </button>
                {vehicleForm.id && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() =>
                      setVehicleForm({ id: null, name: "", image: null })
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <ul className="admin-list">
              {vehicles.map((v) => (
                <li key={v.id} className="admin-list-item">
                  <div className="admin-list-main">
                    <div>
                      <div className="admin-list-title">{v.name}</div>
                      {v.image_url && (
                        <div className="admin-list-sub">
                          Custom image uploaded
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="admin-list-meta">
                    {v.image_url && (
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="admin-thumb"
                      />
                    )}
                    <button
                      className="admin-icon-btn"
                      onClick={() => handleVehicleEdit(v)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-icon-btn admin-danger"
                      onClick={() => handleVehicleDelete(v.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="admin-section">
            <h2>Stops</h2>
            <p className="admin-section-caption">
              Define pickup and drop points with accurate coordinates for
              nearest-stop logic.
            </p>

            <form onSubmit={handleStopSubmit} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">
                  Name
                  <input
                    type="text"
                    value={stopForm.name}
                    onChange={(e) =>
                      setStopForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <div className="admin-field admin-field-inline">
                <label className="admin-label">
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={stopForm.latitude}
                    onChange={(e) =>
                      setStopForm((prev) => ({
                        ...prev,
                        latitude: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="admin-label">
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={stopForm.longitude}
                    onChange={(e) =>
                      setStopForm((prev) => ({
                        ...prev,
                        longitude: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  {stopForm.id ? "Update stop" : "Add stop"}
                </button>
                {stopForm.id && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() =>
                      setStopForm({
                        id: null,
                        name: "",
                        latitude: "",
                        longitude: "",
                      })
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <ul className="admin-list">
              {stops.map((s) => (
                <li key={s.id} className="admin-list-item">
                  <div className="admin-list-main">
                    <div className="admin-list-title">{s.name}</div>
                    <div className="admin-list-sub">
                      {s.latitude}, {s.longitude}
                    </div>
                  </div>
                  <div className="admin-list-meta">
                    <button
                      className="admin-icon-btn"
                      onClick={() => handleStopEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-icon-btn admin-danger"
                      onClick={() => handleStopDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="admin-section admin-section-wide">
            <h2>Routes</h2>
            <p className="admin-section-caption">
              Connect vehicles and stops with a fare. These are the routes users
              will see when they search.
            </p>

            <form onSubmit={handleRouteSubmit} className="admin-form">
              <div className="admin-field admin-field-inline">
                <label className="admin-label">
                  Vehicle
                  <select
                    value={routeForm.vehicle_id}
                    onChange={(e) =>
                      setRouteForm((prev) => ({
                        ...prev,
                        vehicle_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-label">
                  From stop
                  <select
                    value={routeForm.from_stop_id}
                    onChange={(e) =>
                      setRouteForm((prev) => ({
                        ...prev,
                        from_stop_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select stop</option>
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-label">
                  To stop
                  <select
                    value={routeForm.to_stop_id}
                    onChange={(e) =>
                      setRouteForm((prev) => ({
                        ...prev,
                        to_stop_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select stop</option>
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-label">
                  Fare (Rs)
                  <input
                    type="number"
                    step="any"
                    value={routeForm.fare}
                    onChange={(e) =>
                      setRouteForm((prev) => ({
                        ...prev,
                        fare: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  {routeForm.id ? "Update route" : "Add route"}
                </button>
                {routeForm.id && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() =>
                      setRouteForm({
                        id: null,
                        vehicle_id: "",
                        from_stop_id: "",
                        to_stop_id: "",
                        fare: "",
                      })
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <ul className="admin-list">
              {routes.map((r) => (
                <li key={r.id} className="admin-list-item">
                  <div className="admin-list-main">
                    <div className="admin-list-title">
                      {r.vehicles?.name || `Vehicle #${r.vehicle_id}`}
                    </div>
                    <div className="admin-list-sub">
                      {r.from_stop?.name || `Stop #${r.from_stop_id}`} →{" "}
                      {r.to_stop?.name || `Stop #${r.to_stop_id}`} (Rs {r.fare})
                    </div>
                  </div>
                  <div className="admin-list-meta">
                    <button
                      className="admin-icon-btn"
                      onClick={() => handleRouteEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-icon-btn admin-danger"
                      onClick={() => handleRouteDelete(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="admin-section admin-section-wide">
            <h2>Proposed routes</h2>
            <p className="admin-section-caption">
              User contributions. Approve (pending only) to create vehicle +
              route and give 1 reward point. Delete to remove from list
              (available even after approval).
            </p>
            <ul className="admin-list">
              {proposedRoutes.length === 0 ? (
                <li className="admin-list-item">No proposed routes.</li>
              ) : (
                proposedRoutes.map((p) => {
                  const { from, to } = proposedRouteLabel(p);
                  return (
                    <li key={p.id} className="admin-list-item">
                      <div className="admin-list-main">
                        <div className="admin-list-title">{p.bus_name}</div>
                        <div className="admin-list-sub">
                          {from} → {to}
                          {p.user_id && ` · User #${p.user_id}`}
                        </div>
                        {p.status !== "pending" && (
                          <span className="admin-list-sub">{p.status}</span>
                        )}
                        {p.remarks && (
                          <p className="admin-list-remarks">{p.remarks}</p>
                        )}
                      </div>
                      <div className="admin-list-meta">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt=""
                            className="admin-thumb"
                          />
                        )}
                        {p.status === "pending" && (
                          <button
                            className="admin-icon-btn"
                            onClick={() => handleProposedApprove(p.id)}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          className="admin-icon-btn admin-danger"
                          onClick={() => handleProposedDelete(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="admin-section admin-section-wide">
            <h2>Complaints</h2>
            <p className="admin-section-caption">
              View, update status, or delete user complaints submitted from the
              report form.
            </p>
            <ul className="admin-list">
              {complaints.length === 0 ? (
                <li className="admin-list-item">No complaints yet.</li>
              ) : (
                complaints.map((c) => (
                  <li key={c.id} className="admin-list-item">
                    <div className="admin-list-main">
                      <div className="admin-list-title">
                        {c.vehicle_number} – {c.organization}
                      </div>
                      <div className="admin-list-sub">
                        Type: {c.type} · Status: {c.status}
                      </div>
                      {c.description && (
                        <p className="admin-list-remarks">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <div className="admin-list-meta">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleComplaintStatusChange(c.id, e.target.value)
                        }
                      >
                        <option value="pending">pending</option>
                        <option value="solved">solved</option>
                        <option value="removed">removed</option>
                      </select>
                      <button
                        className="admin-icon-btn admin-danger"
                        onClick={() => handleComplaintDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
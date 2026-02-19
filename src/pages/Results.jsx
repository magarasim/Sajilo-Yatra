import { Link } from "react-router-dom";

function Results({ routeResult, fromValue, toValue }) {
  const hasResult = Boolean(routeResult);

  const fromDisplay = routeResult?.from_input || fromValue || "";
  const toDisplay = routeResult?.to_input || toValue || "";

  if (!hasResult) {
    return (
      <div className="page results-page">
        <section className="card">
          <h1>Results</h1>
          <p>No route data found. Please search again.</p>
          <Link to="/search">Go to search</Link>
        </section>
      </div>
    );
  }

  const {
    pickup,
    destination,
    vehicle,
    fare,
    vehicle_image,
    nearest_pickup_stop,
  } = routeResult;

  return (
    <div className="page results-page">
      <section className="card">
        <h1>Results</h1>

        <p>
          You searched for:{" "}
          <strong>
            {fromDisplay} → {toDisplay}
          </strong>
        </p>

        <p>
          Route found:{" "}
          <strong>
            {pickup} → {destination}
          </strong>
        </p>

        {nearest_pickup_stop && (
          <p>
            Nearest stop to your location:{" "}
            <strong>{nearest_pickup_stop.name}</strong>
          </p>
        )}

        <p>
          Vehicle: <strong>{vehicle}</strong>
        </p>
        <p>
          Fare: <strong>Rs {fare}</strong>
        </p>

        {vehicle_image && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={vehicle_image}
              alt={vehicle}
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          </div>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/search">Search another route</Link>
        </div>
      </section>
    </div>
  );
}

export default Results;

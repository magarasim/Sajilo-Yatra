import React from "react";
import "./ResultCard.css";

/**
 * PARENT COMPONENT: ResultsGrid
 * Renders routes in a responsive grid (2x2, 2x3, 3x3, etc.).
 */
export function ResultsGrid({ routes }) {
  if (!routes || routes.length === 0) {
    return <p className="no-results">No routes found.</p>;
  }

  return (
    <div className="result-grid">
      {routes.map((route, index) => (
        <ResultCard key={index} route={route} />
      ))}
    </div>
  );
}

/**
 * CHILD COMPONENT: ResultCard
 * Minimal side‑by‑side design for each route.
 */
function ResultCard({ route }) {
  return (
    <div className="result-card">
      {/* Left: image (optional) */}
      {route.vehicleImage && (
        <div className="result-image-container">
          <img
            src={route.vehicleImage}
            alt={route.vehicleType}
            className="result-image"
          />
        </div>
      )}

      {/* Right: content */}
      <div className="result-info">
        <h2 className="vehicle-name">{route.vehicleType}</h2>
        <p className="fare-highlight">Rs {route.estimatedFare}</p>

        <div className="route-divider" />

        <div className="route-section">
          <span className="route-label">Suggested Route</span>
          <p className="instruction">{route.instruction}</p>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;

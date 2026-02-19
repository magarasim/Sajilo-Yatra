import "./Legal.css";

function Terms() {
  return (
    <main className="legal-page">
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-subtitle">
            Sajilo Yatra is a hackathon prototype providing route guidance and
            estimated fares for Nepal’s public transport.
          </p>
          <p className="legal-meta">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <section className="legal-content">
        <div className="legal-card">
          <h2>1) Acceptance of terms</h2>
          <p>
            By using Sajilo Yatra, you agree to these Terms. If you do not
            agree, please do not use the app.
          </p>
        </div>

        <div className="legal-card">
          <h2>2) What the service provides</h2>
          <p>Sajilo Yatra helps users:</p>
          <ul>
            <li>Select pickup and destination points</li>
            <li>Get a suggested vehicle type and human-readable instruction</li>
            <li>See estimated fare and distance</li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>3) Important disclaimers</h2>
          <ul>
            <li>
              <strong>Fare estimates:</strong> Fares are estimates, not official.
              Actual fares may vary by route, time, vehicle, or operator.
            </li>
            <li>
              <strong>Limited coverage:</strong> The prototype currently covers
              selected areas (e.g., major stops in Kathmandu). Results may be
              incomplete.
            </li>
            <li>
              <strong>No real-time tracking:</strong> We do not provide real-time
              vehicle location or live service updates yet.
            </li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>4) User responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the app for personal, lawful purposes</li>
            <li>Verify route details when needed (ask operators if unsure)</li>
            <li>Not misuse the app or attempt to disrupt the service</li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>5) Data and privacy</h2>
          <p>
            Sajilo Yatra does not collect personal user data. See our{" "}
            <a className="legal-inline-link" href="/privacy">
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </div>

        <div className="legal-card">
          <h2>6) Intellectual property</h2>
          <p>
            The app UI, content structure, and code are owned by the Sajilo Yatra
            team unless stated otherwise. Maps may be powered by Google Maps or
            OpenStreetMap and are subject to their terms.
          </p>
        </div>

        <div className="legal-card">
          <h2>7) Limitation of liability</h2>
          <p>
            Sajilo Yatra is provided “as is.” To the maximum extent allowed by
            law, we are not liable for losses or damages arising from use of the
            app, including inaccurate fares, missed routes, delays, or any
            travel decisions you make.
          </p>
        </div>

        <div className="legal-card">
          <h2>8) Changes and termination</h2>
          <p>
            We may update or discontinue the prototype at any time. Continued
            use after updates means you accept revised terms.
          </p>
        </div>

        <div className="legal-card">
          <h2>9) Contact</h2>
          <p>
            Questions about these Terms? Contact the team:
          </p>
          <ul>
            <li>hello@sajiloyatra.com</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Terms;

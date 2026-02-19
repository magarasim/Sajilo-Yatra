import "./Legal.css";

function Privacy() {
  return (
    <main className="legal-page">
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">
            Sajilo Yatra is a hackathon prototype. We do not collect personal
            user data and we keep the experience lightweight and privacy-first.
          </p>
          <p className="legal-meta">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <section className="legal-content">
        <div className="legal-card">
          <h2>1) What we collect</h2>
          <p>
            Sajilo Yatra does <strong>not</strong> collect personally
            identifiable information (PII) such as your name, phone number, or
            precise location.
          </p>
          <ul>
            <li>
              We only process the <strong>route inputs</strong> you type (pickup
              and destination) to generate route suggestions.
            </li>
            <li>
              We may generate <strong>non-identifying</strong> technical logs
              (e.g., error logs) to keep the prototype working.
            </li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>2) How we use information</h2>
          <p>We use route inputs only to:</p>
          <ul>
            <li>Find a suggested vehicle and travel instruction</li>
            <li>Estimate fare and distance using our curated dataset and map services</li>
            <li>Improve performance and reliability of the prototype</li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>3) Data storage</h2>
          <p>
            Our current MVP uses a JSON dataset (hackathon MVP) containing:
          </p>
          <ul>
            <li>Stop names</li>
            <li>Vehicle type</li>
            <li>Estimated fares</li>
          </ul>
          <p>
            We do not store personal user profiles or user history as part of
            the prototype.
          </p>
        </div>

        <div className="legal-card">
          <h2>4) Third-party services</h2>
          <p>
            We may use map services (e.g., Google Maps or OpenStreetMap) to
            estimate distance. These services may collect data according to
            their own privacy policies.
          </p>
          <p className="legal-note">
            Tip: Review third-party privacy policies if you want details on how
            they handle requests.
          </p>
        </div>

        <div className="legal-card">
          <h2>5) Security</h2>
          <ul>
            <li>API keys are stored in environment variables</li>
            <li>HTTPS is used in production deployments</li>
          </ul>
          <p>
            No system is perfect, but we design the prototype to minimize data
            collection and reduce privacy risk.
          </p>
        </div>

        <div className="legal-card">
          <h2>6) Children’s privacy</h2>
          <p>
            Sajilo Yatra is not intended for children under 13. We do not
            knowingly collect personal data from children.
          </p>
        </div>

        <div className="legal-card">
          <h2>7) Changes to this policy</h2>
          <p>
            We may update this policy as the project evolves (e.g., adding more
            cities, multilingual support, or live tracking). Updates will appear
            on this page with a revised “Last updated” date.
          </p>
        </div>

        <div className="legal-card">
          <h2>8) Contact</h2>
          <p>
            If you have questions, contact the team:
          </p>
          <ul>
            <li>anchitgautam64@gmail.com</li>
            <li>bipenshakya239@gmail.com</li>
            <li>asimmagar20@gmail.com</li>
            <li>bhattanistee@gmail.com</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Privacy;

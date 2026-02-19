import "./Preloader.css";
import logo from "/images/logo.png";

function Preloader() {
  return (
    <div className="preloader-overlay" role="status" aria-live="polite">
      <div className="preloader-card">
        <div className="preloader-mark">
          <div className="preloader-spinner" aria-hidden="true" />
          <img src={logo} alt="Sajilo Yatra logo" className="preloader-logo" />
        </div>

        <div className="preloader-text">
          <div className="preloader-title">Sajilo Yatra</div>
          <div className="preloader-subtitle">Preparing your routes…</div>
        </div>

        <div className="preloader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default Preloader;

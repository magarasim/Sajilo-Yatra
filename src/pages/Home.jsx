import React from "react";
import ResultCard from "../components/ResultCard.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SYAssistant from "../components/SYAssistant.jsx";
import "./Home.css";

import CGnet from "../assets/images/CGnet.png";
import Fasto from "../assets/images/Fasto.png";
import Kailash from "../assets/images/Kailash.png";
import NepalTelecom from "../assets/images/DAJ.png";
import Nirvix from "../assets/images/Nirvix.png";
import Techpatro from "../assets/images/Tech Patro.png";

function Home({
  fromValue,
  toValue,
  setFromValue,
  setToValue,
  onSearch,
  routeResult,
  errorMessage,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const images = [CGnet, Fasto, Kailash, NepalTelecom, Nirvix, Techpatro];

  return (
    <div className="page home-page">
      <SYAssistant />

      {/* Hero */}
      <section className="hero">
        {/* gradient / overlay */}
        <div className="hero-bg" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              ᴛʀᴀᴠᴇʟ sᴍᴀʀᴛᴇʀ ɪɴ ɴᴇᴘᴀʟ • ᴛʀᴀɴsᴘᴀʀᴇɴᴛ ᴘʀɪᴄɪɴɢ
            </div>

            <h1 className="hero-title">
              Find the best{" "}
              <span className="hero-highlight">Transportation in Nepal</span>
            </h1>

            <p className="hero-subtitle">
              Enter your start and destination. We’ll show local route options,
              estimated fares, and distance — so you travel confidently and
              avoid overpaying.
            </p>

            <div className="trust-row" aria-label="Trust indicators">
              <span className="trust-pill">ᴠᴇʀɪғɪᴇᴅ ғᴀʀᴇs</span>
              <span className="trust-pill">200+ ʀᴏᴜᴛᴇs</span>
              <span className="trust-pill">ᴛᴏᴘ ᴅᴇsᴛɪɴᴀᴛɪᴏɴs</span>
            </div>
          </div>

          <section className="card search-card hero-card">
            <div className="card-head">
              <h3 className="card-title">Plan Your Trip With Us</h3>
              <p className="card-desc">
                Fast, simple, and local-price friendly.
              </p>
            </div>

            <ErrorMessage message={errorMessage} />

            <form className="travel" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Where your journey starts</label>
                <input
                  type="text"
                  placeholder="e.g: Kalanki"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label">Where your journey ends</label>
                <input
                  type="text"
                  placeholder="e.g: Koteshwor"
                  value={toValue}
                  onChange={(e) => setToValue(e.target.value)}
                />
              </div>

              <button
                className="primary-btn search-button cta-pulse"
                type="submit"
              >
                Search route
              </button>
            </form>
          </section>
        </div>
      </section>

      {/* Results */}
      {routeResult &&
        (Array.isArray(routeResult) ? (
          routeResult.map((route, i) => (
            <ResultCard
              key={`${route.vehicleType || "vehicle"}-${i}`}
              route={route}
            />
          ))
        ) : (
          <ResultCard route={routeResult} />
        ))}

      {/* Partners: continuous right-to-left loop */}
      <section className="offers">
        <div className="slider-3">
          <h1 className="offers-title">OUR PARTNERS</h1>

          <div className="slider-track-3 slider-track-3--marquee">
            {/* First set */}
            {images.map((img, i) => (
              <div className="slide-3" key={`a-${i}`}>
                <img src={img} alt={`partner-${i}`} />
              </div>
            ))}

            {/* Second set for seamless loop */}
            {images.map((img, i) => (
              <div className="slide-3" key={`b-${i}`}>
                <img src={img} alt={`partner-duplicate-${i}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

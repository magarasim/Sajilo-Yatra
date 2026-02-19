import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiMail,
  FiGithub,
  FiExternalLink,
  FiUsers,
  FiShield,
  FiFileText,
} from "react-icons/fi";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sy-footer" aria-label="Footer">
      <div className="sy-footer-inner">
        {/* Brand */}
        <div className="sy-footer-col">
          <div className="sy-footer-brand-row">
            <img
              src="/images/logo.png"
              alt="Sajilo Yatra"
              className="sy-footer-logo"
            />
            <div>
              <div className="sy-footer-tagline">
                Travel routes & fare guidance for Nepal
              </div>
            </div>
          </div>

          <p className="sy-footer-desc">
            Find local routes, estimated fares, and distance—designed to help
            travelers move confidently and avoid overpaying.
          </p>

          <div className="sy-footer-meta">
            <span className="sy-footer-meta-item">
              <FiMapPin size={16} />
              Nepal
            </span>
            <a
              className="sy-footer-meta-item"
              href="mailto:hello@sajiloyatra.com"
            >
              <FiMail size={16} />
              hello@sajiloyatra.com
            </a>
          </div>
        </div>

        <div className="sy-footer-col">
          <div className="sy-footer-heading">Quick Links</div>

          <Link className="sy-footer-link" to="/">
            Home
          </Link>
          <Link className="sy-footer-link" to="/contributors">
            <FiUsers size={16} />
            Contributions
          </Link>
          <Link className="sy-footer-link" to="/login">
            Get Started
          </Link>
        </div>

        <div className="sy-footer-col">
          <div className="sy-footer-heading">Resources</div>

          <a
            className="sy-footer-link"
            href="https://github.com/sankalpa-hackathon/402-3rror.git"
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub size={16} />
            GitHub <FiExternalLink size={14} className="sy-ext" />
          </a>

          <a
            className="sy-footer-link"
            href="https://www.figma.com/design/tgUw4hM7aj1LBkyLAzD31E/SANKALPA-Hackathon?node-id=13-8&t=DOpmG1pGoNDi2uQ1-1"
            target="_blank"
            rel="noreferrer"
          >
            Design (Figma) <FiExternalLink size={14} className="sy-ext" />
          </a>
        </div>

        <div className="sy-footer-col">
          <div className="sy-footer-heading">Legal</div>

          <Link className="sy-footer-link" to="/terms">
            <FiFileText size={16} />
            Terms
          </Link>
          <Link className="sy-footer-link" to="/privacy">
            <FiShield size={16} />
            Privacy
          </Link>

          <div className="sy-footer-note">
            Hackathon prototype — estimates may vary by season and provider.
          </div>
        </div>
      </div>

      <div className="sy-footer-bottom">
        <div className="sy-footer-bottom-inner">
          <p className="sy-footer-copy">
            © {year} Sajilo Yatra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

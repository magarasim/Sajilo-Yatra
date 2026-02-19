import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiArrowRight, FiMenu, FiX, FiLogOut, FiShield } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sy-nav">
      <div className="sy-nav-inner">
        <Link to="/" className="sy-brand" onClick={() => setOpen(false)}>
          <img
            src="/images/logo.png"
            alt="Sajilo Yatra logo"
            className="sy-brand-logo"
          />
        </Link>

        <nav className="sy-links">
          <NavLink to="/complains" className="sy-link">
            <FiShield size={16} />
            Complain
          </NavLink>

          <NavLink to="/contributors" className="sy-link">
            <FiUsers size={16} />
            Contributions
          </NavLink>

          {user ? (
            <button
              type="button"
              className="sy-link sy-link-primary"
              onClick={handleLogout}
            >
              <FiLogOut size={16} />
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="sy-link sy-link-primary">
              Get Started
              <FiArrowRight size={16} />
            </NavLink>
          )}
        </nav>

        <button
          className="sy-menu-btn"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sy-mobile">
          <NavLink
            to="/complains"
            className="sy-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiShield size={18} />
            Complain
          </NavLink>
          <NavLink
            to="/contributors"
            className="sy-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiUsers size={18} />
            Contributions
          </NavLink>

          {user ? (
            <button
              type="button"
              className="sy-mobile-link sy-mobile-primary"
              onClick={handleLogout}
            >
              <FiLogOut size={18} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="sy-mobile-link sy-mobile-primary"
              onClick={() => setOpen(false)}
            >
              Get Started
              <FiArrowRight size={18} />
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;

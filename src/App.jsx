import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Loader from "./components/Loader.jsx";
import Preloader from "./components/Preloader.jsx";

import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Contributors from "./pages/Contributors.jsx";
import Complain from "./pages/Complain.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

const STORAGE_KEY = "sajilo_user";

function App() {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // for search
  const [routeResult, setRouteResult] = useState(null);
  const [booting, setBooting] = useState(true); // for initial preloader
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // show Preloader when app first loads
  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800); // 0.8s feel
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSearch = async () => {
    if (!fromValue || !toValue) return;

    setIsLoading(true);
    setRouteResult(null);
    setErrorMessage("");

    try {
      const params = new URLSearchParams({
        from: fromValue,
        to: toValue,
      });

      const response = await fetch(
        `http://localhost:5000/api/route?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error ||
          "No route found for that combination. Please try different stops.";
        setErrorMessage(message);
        return;
      }

      // Map backend response into the shape expected by ResultCard (support single or multiple routes)
      const routes =
        data.routes && Array.isArray(data.routes) ? data.routes : [data];
      const mapped = routes.map((r) => ({
        from: r.pickup,
        to: r.destination,
        vehicleType: r.vehicle,
        estimatedFare: r.fare,
        vehicleImage: r.vehicle_image,
        instruction: `Take a ${r.vehicle} from ${r.pickup} to ${r.destination}. Fare ≈ Rs ${r.fare}.`,
      }));

      setRouteResult(mapped);
    } catch (error) {
      console.error("Error fetching route:", error);
      setErrorMessage(
        "Something went wrong while searching. Please try again in a moment.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // while booting, show full-screen preloader only
  if (booting) {
    return <Preloader />;
  }

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {/* overlay loader while searching */}
        {isLoading && <Loader />}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                fromValue={fromValue}
                toValue={toValue}
                setFromValue={setFromValue}
                setToValue={setToValue}
                onSearch={handleSearch}
                routeResult={routeResult}
                errorMessage={errorMessage}
              />
            }
          />

          <Route path="/results" element={<Results />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complains" element={<Complain />} />
          <Route
            path="/contributors"
            element={
              user ? (
                <Contributors user={user} onUserUpdate={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

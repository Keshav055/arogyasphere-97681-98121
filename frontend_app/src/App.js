import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import NotificationBanner from "./components/NotificationBanner";
import "./App.css";

// Pages (one per major module)
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OAuthPage from "./pages/OAuthPage";
import DashboardPage from "./pages/DashboardPage";
import WellnessPage from "./pages/WellnessPage";
import DiseasePage from "./pages/DiseasePage";
import TeleConsultPage from "./pages/TeleConsultPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import EducationPage from "./pages/EducationPage";
import AIChatPage from "./pages/AIChatPage";
import ResourceMapPage from "./pages/ResourceMapPage"; // new

// Auth
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Notification context for app-wide banners/notifications
export const NotificationContext = createContext(null);

// HeaderBar to show theme toggle and logout if authenticated
const HeaderBar = ({ theme, toggleTheme }) => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="App-header" style={{ minHeight: "64px" }}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <h3 style={{ margin: "0.4em", display: "inline" }}>ArogyaMitr</h3>
      {token && (
        <div style={{ position: "absolute", right: 28, top: 20 }}>
          <span style={{
            marginRight: 12,
            fontSize: 15,
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}>
            {user?.name ? `Hi, ${user.name}` : ""}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#e74c3c",
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Logout"
          >
            ⎋ Logout
          </button>
        </div>
      )}
    </header>
  );
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [banner, setBanner] = useState({ message: "", type: "info" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Set a global notification banner
  const notify = ({ message, type = "info", timeout = 3800 }) => {
    setBanner({ message, type });
    if (timeout) {
      setTimeout(() => setBanner({ message: "", type: "info" }), timeout);
    }
  };

  return (
    <AuthProvider>
      <NotificationContext.Provider value={notify}>
        <Router>
          <div className="App">
            <HeaderBar theme={theme} toggleTheme={toggleTheme} />
            <NotificationBanner
              message={banner.message}
              type={banner.type}
              onClose={() => setBanner({ message: "", type: "info" })}
            />
            <div style={{ paddingBottom: 64 }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/oauth" element={<OAuthPage />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/wellness/*" element={
                  <ProtectedRoute>
                    <WellnessPage />
                  </ProtectedRoute>
                } />
                <Route path="/chronic" element={
                  <ProtectedRoute>
                    <DiseasePage />
                  </ProtectedRoute>
                } />
                <Route path="/teleconsult" element={
                  <ProtectedRoute>
                    <TeleConsultPage />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                } />
                <Route path="/community/resource-map" element={
                  <ProtectedRoute>
                    <ResourceMapPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/education" element={
                  <ProtectedRoute>
                    <EducationPage />
                  </ProtectedRoute>
                } />
                <Route path="/ai" element={
                  <ProtectedRoute>
                    <AIChatPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <BottomNav />
          </div>
        </Router>
      </NotificationContext.Provider>
    </AuthProvider>
  );
}

export default App;

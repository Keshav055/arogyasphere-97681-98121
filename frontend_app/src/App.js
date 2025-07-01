import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
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

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // TODO: Plug in authentication state management (token, user).

  return (
    <Router>
      <div className="App">
        <header className="App-header" style={{ minHeight: "64px" }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <h3 style={{ margin: "0.4em" }}>ArogyaMitr</h3>
        </header>
        <div style={{ paddingBottom: 64 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/oauth" element={<OAuthPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wellness/*" element={<WellnessPage />} />
            <Route path="/chronic" element={<DiseasePage />} />
            <Route path="/teleconsult" element={<TeleConsultPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/ai" element={<AIChatPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;

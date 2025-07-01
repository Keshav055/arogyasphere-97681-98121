import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

/**
 * Bottom navigation bar for mobile-first layout.
 * Links correspond to primary app modules.
 */
const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        <span role="img" aria-label="Home">🏠</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/wellness" className="nav-item">
        <span role="img" aria-label="Wellness">🌿</span>
        <span>Wellness</span>
      </NavLink>
      <NavLink to="/chronic" className="nav-item">
        <span role="img" aria-label="Chronic">💉</span>
        <span>Disease</span>
      </NavLink>
      <NavLink to="/teleconsult" className="nav-item">
        <span role="img" aria-label="Consult">💬</span>
        <span>Consult</span>
      </NavLink>
      <NavLink to="/community" className="nav-item">
        <span role="img" aria-label="Forum">🧑‍🤝‍🧑</span>
        <span>Community</span>
      </NavLink>
      <NavLink to="/education" className="nav-item">
        <span role="img" aria-label="Education">📚</span>
        <span>Edu Hub</span>
      </NavLink>
      <NavLink to="/ai" className="nav-item">
        <span role="img" aria-label="AI Chat">🤖</span>
        <span>AI Chat</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        <span role="img" aria-label="User">👤</span>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

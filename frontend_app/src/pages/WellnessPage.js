import React, { useState } from "react";

/**
 * Wellness module landing page - tabs for diet, fitness, mindfulness, sleep.
 */
const tabNames = ["Diet", "Fitness", "Mindfulness", "Sleep"];
const WellnessPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <h2>Wellness</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {tabNames.map((name, i) => (
          <button
            key={name}
            style={{
              margin: 4,
              padding: "8px 16px",
              borderRadius: 6,
              background: tab === i ? "var(--button-bg)" : "var(--bg-secondary)",
              color: tab === i ? "#fff" : "var(--text-primary)"
            }}
            onClick={() => setTab(i)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="card" style={{ margin: "1em auto", maxWidth: 400 }}>
        <p>{tabNames[tab]} module will load here (connects with backend per route).</p>
      </div>
    </div>
  );
};

export default WellnessPage;

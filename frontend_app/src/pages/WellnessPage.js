import React, { useState, useEffect } from "react";
import { api } from "../api";

/**
 * Wellness module - Diet, Fitness, Mindfulness, Sleep.
 * Each tab fetches and posts relevant content to backend.
 */
const tabs = [
  { label: "Diet", key: "diet" },
  { label: "Fitness", key: "fitness" },
  { label: "Mindfulness", key: "mind" },
  { label: "Sleep", key: "sleep" },
];

const WellnessPage = () => {
  const [tab, setTab] = useState(0);
  const [widgets, setWidgets] = useState([]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  useEffect(() => {
    setLoading(true);
    const fetchWidgets = async () => {
      try {
        const res = await api.get(`/wellness/${tabs[tab].key}`);
        setWidgets(res.data.widgets || []);
        setLog(res.data.log || []);
      } catch {
        setWidgets([]);
        setLog([]);
      }
      setLoading(false);
    };
    fetchWidgets();
  }, [tab]);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        `/wellness/${tabs[tab].key}/log`,
        { value: input }
      );
      setInput("");
      // Re-fetch log
      const res = await api.get(`/wellness/${tabs[tab].key}`);
      setLog(res.data.log || []);
    } catch {}
  };

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <h2>Wellness</h2>
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        {tabs.map((t, i) => (
          <button
            key={t.key}
            style={{
              margin: 4,
              padding: "8px 16px",
              borderRadius: 6,
              background: tab === i ? "var(--button-bg)" : "var(--bg-secondary)",
              color: tab === i ? "#fff" : "var(--text-primary)"
            }}
            onClick={() => setTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="card" style={{ margin: "1em auto", maxWidth: 420, minHeight: 115 }}>
        {loading ? <p>Loading…</p> : (
          <div>
            {widgets.length === 0 ? <p>No info yet – log your first entry!</p> :
              widgets.map((w, idx) => (
                <div key={idx} style={{ margin: "8px 0", padding: 4 }}>
                  <strong>{w.title}</strong> <br />
                  {w.description}
                  {w.progress !== undefined && (
                    <progress value={w.progress} max={100} style={{ width: "85%" }}></progress>
                  )}
                </div>
              ))
            }
            <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Log your ${tabs[tab].label}...`}
                style={{ width: "70%", margin: "4px", borderRadius: 5 }}
              />
              <button className="btn" style={{ width: "24%" }} type="submit">Add</button>
            </form>
            <div style={{ marginTop: 7 }}>
              <strong>Your Entries:</strong>
              {log.length === 0 ? <span> (none)</span> : (
                <ul>
                  {log.map((l, i) => (
                    <li key={i} style={{ fontSize: 13 }}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessPage;

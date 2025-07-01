import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Main landing dashboard for ArogyaMitr with personalized widgets.
 * Includes profile snapshot, wellness goals, progress, recent activity, and quick AI chat.
 */
const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/dashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setDashboard(res.data);
      } catch {
        setDashboard(null);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  // PUBLIC_INTERFACE
  const sendAIChat = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiChat((prev) => [...prev, { user: aiInput, bot: "Loading..." }]);
    setAiInput("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/ai/assistant`,
        { message: aiInput },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setAiChat((prev) => [
        ...prev.slice(0, -1),
        { user: aiChat[aiChat.length]?.user || aiInput, bot: res.data.reply || "No response." },
      ]);
    } catch {
      setAiChat((prev) => [
        ...prev.slice(0, -1),
        { user: aiChat[aiChat.length]?.user || aiInput, bot: "AI unavailable." },
      ]);
    }
  };

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  return (
    <div className="container" style={{ marginTop: 30, maxWidth: 450 }}>
      <h2>Welcome, {dashboard?.user?.name || "User"}</h2>
      <div className="card" style={{ margin: "1em auto", padding: 16 }}>
        <strong>Goals & Progress</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
          {dashboard?.goals?.map((goal) => (
            <div key={goal.title} className="card" style={{ flex: "1 1 38%", padding: 8, minWidth: 110 }}>
              <span style={{ fontWeight: 500 }}>{goal.title}</span>
              <br /><progress value={goal.progress} max={100} style={{ width: "85%" }} />
              <div style={{ fontSize: 12 }}>{goal.progress}%</div>
            </div>
          )) || <span>No goals yet!</span>}
        </div>
      </div>
      <div className="card" style={{ margin: "1em auto", padding: 16 }}>
        <strong>Recent Activity</strong>
        <ul>
          {(dashboard?.recent_logs)?.map((log, i) => <li key={i}>{log}</li>) || <li>No activity</li>}
        </ul>
      </div>
      <div className="card" style={{ margin: "1em auto", padding: 16 }}>
        <strong>Quick AI Health Assistant</strong>
        <div style={{ minHeight: 80, maxHeight: 160, overflowY: "auto", background: "#f7f7fd", borderRadius: 6 }}>
          {aiChat.length === 0 ? (
            <div style={{ fontSize: 13, color: "#aaa" }}>Ask any quick health question!</div>
          ) : (
            aiChat.map((msg, idx) => (
              <div key={idx} style={{ margin: "3px 0" }}>
                <strong>You:</strong> {msg.user}
                <br />
                <strong>Bot:</strong> <span style={{ color: "#3c83af" }}>{msg.bot}</span>
              </div>
            ))
          )}
        </div>
        <form onSubmit={sendAIChat}>
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            placeholder="Type your health query…"
            style={{ width: "77%", margin: 3, padding: 6, borderRadius: 5 }}
          />
          <button className="btn" type="submit" style={{ width: "20%", padding: 7 }}>Ask</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useState } from "react";
import { api } from "../api";

/**
 * AI Health Assistant Chat Page – voice input placeholder, threaded chat UI.
 */
const AIChatPage = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // PUBLIC_INTERFACE
  const sendChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChat((prev) => [...prev, { role: "user", msg: input }, { role: "bot", msg: "..." }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post(
        "/ai/assistant",
        { message: input }
      );
      setChat((prev) => [...prev.slice(0, -1), { role: "bot", msg: res.data.reply || "No response." }]);
    } catch {
      setChat((prev) => [...prev.slice(0, -1), { role: "bot", msg: "AI unavailable." }]);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ marginTop: 22, maxWidth: 470 }}>
      <h2>
        AI Health Chat
        <span style={{ float: "right", fontSize: "24px", marginRight: 5 }}>🤖</span>
      </h2>
      <div className="card" style={{ minHeight: 260, maxHeight: 370, overflowY: "auto", background: "#f3fafd" }}>
        {chat.length === 0 ? (
          <span style={{ color: "#969696" }}>Say "Hello", ask about your health, habits, or next steps…</span>
        ) : (
          chat.map((msg, idx) => (
            <div key={idx} style={{
              textAlign: msg.role === "user" ? "left" : "right", padding: "5px 0"
            }}>
              <div style={{
                display: "inline-block",
                background: msg.role === "user" ? "#265e28" : "#3c83af",
                color: "#fff", padding: "7px 14px", borderRadius: 18,
                fontSize: 15, maxWidth: "83%"
              }}>
                {msg.msg}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendChat} style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question…"
          style={{ flex: 1, borderRadius: 12, padding: 9 }}
        />
        <button className="btn" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "..." : "Send"}
        </button>
        <button
          type="button"
          className="btn"
          title="Microphone (coming soon)"
          disabled
          style={{
            marginLeft: 8, borderRadius: "50%", width: 38, height: 38,
            padding: 0, background: "#eee", color: "#3c83af"
          }}
        >🎤</button>
      </form>
    </div>
  );
};

export default AIChatPage;

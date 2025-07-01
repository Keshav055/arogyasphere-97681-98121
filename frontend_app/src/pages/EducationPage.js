import React, { useEffect, useState } from "react";
import { api } from "../api";

/**
 * Health Education Hub – list articles/videos, detail modal, filter.
 */
const EducationPage = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/education", {
          params: query ? { q: query } : {},
        });
        setItems(res.data.items || []);
      } catch {
        setItems([]);
      }
    };
    fetchItems();
  }, [query]);

  return (
    <div className="container" style={{ marginTop: 28 }}>
      <h2>Education Hub</h2>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search topics, articles or videos..."
        style={{ width: "95%", margin: "0.8em 0", borderRadius: 8, padding: 8 }}
      />
      <div>
        {items.length === 0 ? <div>No educational resources yet.</div> : (
          items.map((item, i) =>
            <div key={i} className="card" style={{ margin: "12px auto", padding: 12, maxWidth: 430 }}>
              <b>{item.title}</b> <br />
              <span style={{ color: "#666", fontSize: 13 }}>{item.type}</span>
              <br />
              <span>{item.summary}</span>
              <br />
              <button
                className="btn"
                onClick={() => setModal(item)}
                style={{ marginTop: 7 }}
              >{item.type === "video" ? "Watch" : "Read"}</button>
            </div>
          )
        )}
      </div>
      {modal && (
        <div className="modal" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.29)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ padding: 22, maxWidth: 460, background: "#fff" }}>
            <button onClick={() => setModal(null)} style={{
              float: "right", background: "none", border: "none", color: "#333"
            }}>✖️</button>
            <h3>{modal.title}</h3>
            {modal.type === "video"
              ? <video controls style={{ width: "100%" }} src={modal.content_url}></video>
              : <div style={{ whiteSpace: "pre-line" }}>{modal.content}</div>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationPage;

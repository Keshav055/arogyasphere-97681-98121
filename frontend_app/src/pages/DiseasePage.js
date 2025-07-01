import React, { useEffect, useState, useRef } from "react";
import { api } from "../api";

/**
 * Chronic Disease Dashboard with data widgets, reminders, record upload.
 */
const DiseasePage = () => {
  const [metrics, setMetrics] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/chronic");
        setMetrics(res.data.metrics || []);
        setReminders(res.data.reminders || []);
      } catch {
        setMetrics([]);
        setReminders([]);
      }
    };
    fetchData();
  }, []);

  // PUBLIC_INTERFACE
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/chronic/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadStatus("Uploaded successfully!");
      setFile(null);
      fileRef.current.value = "";
    } catch {
      setUploadStatus("Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="container" style={{ marginTop: 28, maxWidth: 440 }}>
      <h2>Chronic Disease Dashboard</h2>
      <div className="card" style={{ margin: "1em auto", padding: 12 }}>
        <strong>Disease Metrics</strong>
        {metrics.length === 0
          ? <p>No metrics yet.</p>
          : metrics.map((m, idx) => (
              <div key={idx} style={{ margin: "6px 0" }}>
                <b>{m.label}:</b> {m.value} {m.unit || ""}
              </div>
            ))}
      </div>
      <div className="card" style={{ margin: "1em auto", padding: 12 }}>
        <strong>Medication Reminders</strong>
        <ul>
          {reminders.length === 0 ? <li>None scheduled.</li> :
            reminders.map((rem, i) => <li key={i}>{rem}</li>)
          }
        </ul>
      </div>
      <div className="card" style={{ margin: "1em auto", padding: 12 }}>
        <strong>Upload Medical Record</strong>
        <form onSubmit={handleFileUpload}>
          <input type="file" ref={fileRef} onChange={e => setFile(e.target.files[0])} />
          <button className="btn" type="submit" disabled={uploading} style={{ marginLeft: 10 }}>
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
        {uploadStatus && <div style={{ fontSize: 12, marginTop: 4 }}>{uploadStatus}</div>}
      </div>
    </div>
  );
};

export default DiseasePage;

import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Tele-consultation, appointment booking, session list, and prescription download.
 */
const TeleConsultPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState({ doctor: "", date: "", reason: "" });
  const [prescriptions, setPrescriptions] = useState([]);
  const [status, setStatus] = useState("");
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConsults = async () => {
      try {
        const res = await axios.get(`${API_BASE}/teleconsult`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAppointments(res.data.appointments || []);
        setPrescriptions(res.data.prescriptions || []);
      } catch {
        setAppointments([]);
        setPrescriptions([]);
      }
    };
    fetchConsults();
  }, [showModal, status]);

  // PUBLIC_INTERFACE
  const handleBook = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post(`${API_BASE}/teleconsult/book`, booking, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setStatus("Appointment booked!");
      setShowModal(false);
    } catch {
      setStatus("Booking failed.");
    }
  };

  // PUBLIC_INTERFACE
  const handlePrescriptionDownload = async (fileId) => {
    setStatus("");
    try {
      const res = await axios.get(
        `${API_BASE}/teleconsult/prescriptions/${fileId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {}, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${fileId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setStatus("Download successful!");
    } catch {
      setStatus("Download failed.");
    }
  };

  return (
    <div className="container" style={{ marginTop: 28, maxWidth: 440 }}>
      <h2>Tele-Consultation</h2>
      <div className="card" style={{ padding: 10, margin: "1em auto" }}>
        <button className="btn" onClick={() => setShowModal(true)} style={{ float: "right" }}>Book New</button>
        <strong>Upcoming Appointments</strong>
        <ul>
          {appointments.length === 0 ? <li>None yet.</li> :
            appointments.map((a, i) =>
              <li key={i}>
                Dr. {a.doctor} on {a.date} ({a.reason})
              </li>
            )}
        </ul>
      </div>
      <div className="card" style={{ padding: 10, margin: "1em auto" }}>
        <strong>Prescriptions</strong>
        <ul>
          {prescriptions.length === 0 ? <li>None.</li> : prescriptions.map((p, i) =>
            <li key={i}>
              {p.label || `Prescription #${i + 1}`}
              <button className="btn" style={{ marginLeft: 8, padding: "3px 9px", fontSize: "90%" }}
                onClick={() => handlePrescriptionDownload(p.id)}>
                Download
              </button>
            </li>
          )}
        </ul>
      </div>
      {showModal && (
        <div className="modal" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ padding: 24, maxWidth: 320, background: "#fff" }}>
            <h3>Book Appointment</h3>
            <form onSubmit={handleBook}>
              <input
                type="text"
                placeholder="Doctor"
                value={booking.doctor}
                onChange={e => setBooking(b => ({ ...b, doctor: e.target.value }))}
                required style={{ width: "100%", margin: "7px 0" }}
              />
              <input
                type="date"
                value={booking.date}
                onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}
                required style={{ width: "100%", margin: "7px 0" }}
              />
              <input
                type="text"
                placeholder="Reason"
                value={booking.reason}
                onChange={e => setBooking(b => ({ ...b, reason: e.target.value }))}
                required style={{ width: "100%", margin: "7px 0" }}
              />
              <button className="btn" type="submit" style={{ width: "100%" }}>Book</button>
            </form>
            <button onClick={() => setShowModal(false)} className="btn" style={{ marginTop: 8, width: "100%" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {status && <div style={{ marginTop: 10, color: "#3c83af" }}>{status}</div>}
    </div>
  );
};

export default TeleConsultPage;

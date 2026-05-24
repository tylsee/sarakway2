import React, { useState, useEffect } from "react";
import { apiFetch } from "../../api";
import "../../styles/alerts.css";

export default function AdminAlerts() {
  const [viewAlert, setViewAlert] = useState(null);
  const [iotAlerts, setIotAlerts] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [showDismissed, setShowDismissed] = useState(false);

  /* ================= LOAD DATA ================= */
useEffect(() => {
  fetchIoTData();

  const interval = setInterval(() => {
    fetchIoTData();
  }, 4000);

  return () => clearInterval(interval);

}, []);

  const fetchIoTData = async () => {
    try {
      const [aRes, sRes] = await Promise.all([
        apiFetch("/api/iot/alerts"),
        apiFetch("/api/iot/status"),
      ]);

      if (aRes.ok) {
        const data = await aRes.json();
        setIotAlerts(data);
      }

      if (sRes.ok) {
        const status = await sRes.json();
        setIsOnline(status.online);
      }

    } catch (err) {
      console.error(err);
    }
  };
  
const updateStatus = async (id, newStatus) => {
  try {
    await apiFetch(`/api/iot/alerts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchIoTData();

  } catch (err) {
    console.error(err);
  }
};

  /* ================= FILTER ================= */
const filteredAlerts = showDismissed
  ? iotAlerts
  : iotAlerts.filter((a) => a.status !== "Dismissed");
  

  /* ================= COUNTS ================= */
const total = iotAlerts.length;
const reviewing = iotAlerts.filter(a => a.status === "Reviewing").length;
const active = iotAlerts.filter(a => a.status === "New").length;
const resolved = iotAlerts.filter(a => a.status === "Resolved").length;

  return (
    <div className="admin-alerts-page">

      {/* HEADER */}
      <header className="page-header">
        <div className={`status-dot ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "🟢 System Live" : "🔴 System Offline"}
        </div>
        
        <div>
          <h1>Alert Monitoring</h1>
          <p>Real-time safety monitoring</p>
        </div>

        <div className="header-actions">

          <button
            className="dismissed-btn"
            onClick={() => setShowDismissed(!showDismissed)}
          >
            {showDismissed ? "Hide Dismissed" : "Show Dismissed"}
          </button>
        </div>
      </header>

      {/* STATUS CARDS */}
      <div className="status-boxes">
        <div className="status-card">
          <h3>{total}</h3>
          <p>Alerts</p>
        </div>

        <div className="status-card">
          <h3>{reviewing}</h3>
          <p>Reviewing</p>
        </div>

        <div className="status-card">
          <h3>{active}</h3>
          <p>New</p>
        </div>

        <div className="status-card">
          <h3>{resolved}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* ALERT LIST */}
      <div className="alert-list">
        {filteredAlerts.map((a) => (
          <div
            key={a.alert_id || a.id}
            className="alert-item"
            onClick={() => setViewAlert(a)}
          >
            <div className="left-info">
              <b>{a.sensor_type}</b>
              <small>IoT Sensor Zone</small>
              <small className="time">{new Date(a.triggered_at).toLocaleString()}</small>
            </div>

            <div className="right-info">
              <span className={`badge ${(a.severity || "Low").toLowerCase()}`}>
                {a.severity || "IoT"}
              </span>
              <span className={`status ${a.status?.toLowerCase()}`}>
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewAlert && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewAlert.sensor_type}</h2>
            <p>{viewAlert.alert_message}</p>

            <p><b>Location:</b> {viewAlert.location || "IoT Sensor Zone"}</p>

            <label>Status:</label>
            <select
              value={viewAlert.status}
              onChange={(e) => {
                updateStatus(viewAlert.alert_id || viewAlert.id, e.target.value);
                setViewAlert({
                  ...viewAlert,
                  status: e.target.value,
                });
              }}
            >
              <option>New</option>
              <option>Reviewing</option>
              <option>Resolved</option>
              <option>Dismissed</option>
            </select>

            <button onClick={() => setViewAlert(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

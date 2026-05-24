import React, { useState, useEffect } from "react";
import { apiFetch } from "../../api";
import "../../styles/alerts.css";

export default function GuideAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [viewAlert, setViewAlert] = useState(null);

  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // ⭐ GET LOGGED IN USER
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= LOAD ALERTS ================= */
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await apiFetch(`/alerts/user/${user.user_id}`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredAlerts = alerts
    // optional: hide dismissed by default
    .filter((a) => a.status !== "Dismissed")
    .filter((a) => {
      const matchSeverity =
        severityFilter === "All" || a.severity === severityFilter;

      const matchType =
        typeFilter === "All" || a.activity_type === typeFilter;

      return matchSeverity && matchType;
    });

  return (
    <div className="admin-alerts-page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Alerts</h1>
          <p>View and respond to assigned alerts</p>
        </div>
      </header>

      {/* FILTERS */}
      <div className="header-actions">
        <select
          className="filter-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="All">All Severity</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option>Plant Damage</option>
          <option>Wildlife Disturbance</option>
          <option>Regulation Violation</option>
        </select>
      </div>

      {/* ALERT LIST */}
      <div className="alert-list">
        {filteredAlerts.length === 0 && (
          <p style={{ color: "#888" }}>No alerts found</p>
        )}

        {filteredAlerts.map((a) => (
          <div
            key={a.alert_id}
            className="alert-item"
            onClick={() => setViewAlert(a)}
          >
            <div className="left-info">
              <b>{a.activity_type}</b>

              {/* ⭐ SHOW TYPE OF ALERT */}
              <small>
                {a.is_broadcast ? "broadcast alert" : "assigned to you"}
              </small>

              <small>{a.location}</small>
              <small className="time">{a.timestamp}</small>
            </div>

            <div className="right-info">
              <span className={`badge ${a.severity.toLowerCase()}`}>
                {a.severity}
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
            <h2>{viewAlert.activity_type}</h2>

            <p>{viewAlert.description}</p>

            <p>
              <b>Location:</b> {viewAlert.location}
            </p>

            <p>
              <b>Severity:</b> {viewAlert.severity}
            </p>

            <p>
              <b>Status:</b> {viewAlert.status}
            </p>

            <button onClick={() => setViewAlert(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

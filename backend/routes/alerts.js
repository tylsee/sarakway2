const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= CREATE ALERT ================= */
router.post("/", (req, res) => {
  const {
    type,
    severity,
    description,
    location,
    video_url,
    assigned_to,
    is_broadcast
  } = req.body;

  if (!type || !severity || !description || !location) {
    return res.status(400).json({ message: "missing required fields" });
  }

  const query = `
    INSERT INTO alerts 
    (activity_type, severity, description, location, video_url, assigned_to, is_broadcast)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      type,
      severity,
      description,
      location,
      video_url || null,
      assigned_to || null,
      is_broadcast || false
    ],
    (err, result) => {
      if (err) {
        console.error("CREATE ALERT ERROR:", err);
        return res.status(500).json({ message: "failed to create alert" });
      }

      res.json({
        message: "alert created",
        alert_id: result.insertId
      });
    }
  );
});

/* ================= GET ALL ALERTS ================= */
router.get("/", (req, res) => {
  const query = `
    SELECT 
      a.*,
      u.user_name AS guide_name
    FROM alerts a
    LEFT JOIN users u ON a.assigned_to = u.user_id
    ORDER BY a.timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("GET ALERTS ERROR:", err);
      return res.status(500).json({ message: "failed to fetch alerts" });
    }

    res.json(results);
  });
});

/* ================= UPDATE STATUS ================= */
router.put("/:id", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "status required" });
  }

  const query = `
    UPDATE alerts 
    SET status = ? 
    WHERE alert_id = ?
  `;

  db.query(query, [status, req.params.id], (err) => {
    if (err) {
      console.error("UPDATE STATUS ERROR:", err);
      return res.status(500).json({ message: "failed to update status" });
    }

    res.json({ message: "status updated" });
  });
});

/* ================= GET ALERTS FOR GUIDE ================= */
router.get("/user/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT 
      a.*,
      u.user_name AS guide_name
    FROM alerts a
    LEFT JOIN users u ON a.assigned_to = u.user_id
    WHERE a.is_broadcast = 1
       OR a.assigned_to = ?
    ORDER BY a.timestamp DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("GET GUIDE ALERTS ERROR:", err);
      return res.status(500).json({ message: "failed to fetch alerts" });
    }

    res.json(results);
  });
});

module.exports = router;
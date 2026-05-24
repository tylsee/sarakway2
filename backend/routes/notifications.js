const express = require("express");
const router = express.Router();
const db = require("../db");

// --- CREATE NOTIFICATION ---
router.post("/", (req, res) => {
  const { title, type, message, is_broadcast, assigned_to } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `INSERT INTO notifications (title, type, message, is_broadcast, assigned_to) VALUES (?, ?, ?, ?, ?)`;
  
  db.query(query, [title, type, message, is_broadcast || false, assigned_to || null], (err, result) => {
    if (err) {
      console.error("CREATE NOTI ERROR:", err);
      return res.status(500).json({ message: "Failed to create notification" });
    }
    res.json({ message: "Notification sent", id: result.insertId });
  });
});

// --- GET ALL NOTIFICATIONS (ADMIN) ---
router.get("/", (req, res) => {
  const query = `
    SELECT n.*, u.user_name as guide_name 
    FROM notifications n 
    LEFT JOIN users u ON n.assigned_to = u.user_id 
    ORDER BY n.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// --- GET NOTIFICATIONS FOR SPECIFIC GUIDE ---
router.get("/user/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT * FROM notifications 
    WHERE is_broadcast = 1 OR assigned_to = ? 
    ORDER BY created_at DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// --- DELETE NOTIFICATION (ADMIN) ---
router.delete("/:id", (req, res) => {
  db.query(`DELETE FROM notifications WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete" });
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;
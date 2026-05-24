const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Required for your secure profile updates
const db = require("../db");

/* ================= GET ALL GUIDES WITH PROGRESS ================= */
router.get("/guides", (req, res) => {
  const query = `
    SELECT
      u.user_id,
      u.user_name,
      u.email,

      (
        SELECT COUNT(*)
        FROM user_course_progress p
        WHERE p.user_id = u.user_id
      ) AS total_courses,

      (
        SELECT COUNT(*)
        FROM user_course_progress p
        WHERE p.user_id = u.user_id
        AND p.is_completed = 1
      ) AS completed_courses,

      (
        SELECT COUNT(*)
        FROM user_course_progress p
        WHERE p.user_id = u.user_id
        AND p.progress_percentage > 0
        AND p.progress_percentage < 100
      ) AS in_progress_courses,

      (
        SELECT COUNT(*)
        FROM certificates c
        WHERE c.user_id = u.user_id
        AND c.status = 'Approved'
      ) AS certificates,

      (
        SELECT COUNT(*)

        FROM quiz_attempts qa

        WHERE qa.user_id = u.user_id

        AND qa.passed = 0
      ) AS failed_quizzes

    FROM users u
    WHERE u.role_id = 2
    ORDER BY u.user_name ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("GET GUIDES ERROR:", err);
      return res.status(500).json({ message: "failed guides" });
    }
    res.json(results);
  });
});

/* ================= UPDATE USER PROFILE ================= */
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, newPassword } = req.body;

  try {
    // If the user typed a new password in the edit box, hash it and update everything
    if (newPassword && newPassword.trim() !== '') {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = "UPDATE users SET user_name = ?, email = ?, phone = ?, password_hash = ? WHERE user_id = ?";
      
      db.query(query, [name, email, phone, hashedPassword, userId], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Profile and password updated successfully" });
      });
    } 
    // If they left the password blank, just update their name, email, and phone
    else {
      const query = "UPDATE users SET user_name = ?, email = ?, phone = ? WHERE user_id = ?";
      
      db.query(query, [name, email, phone, userId], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Profile updated successfully" });
      });
    }
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET SINGLE GUIDE ================= */

router.get(
  "/guides/:id",

  (req, res) => {

    const summaryQuery = `
      SELECT
        u.user_id,
        u.user_name,
        u.email,

        (
          SELECT COUNT(*)
          FROM user_course_progress p
          WHERE p.user_id = u.user_id
        ) AS total_courses,

        (
          SELECT COUNT(*)
          FROM user_course_progress p
          WHERE p.user_id = u.user_id
          AND p.is_completed = 1
        ) AS completed_courses,

        (
          SELECT COUNT(*)
          FROM certificates c
          WHERE c.user_id = u.user_id
          AND c.status = 'Approved'
        ) AS certificates,

        (
          SELECT COUNT(*)
          FROM quiz_attempts qa
          WHERE qa.user_id = u.user_id
          AND qa.passed = 0
        ) AS failed_quizzes

      FROM users u

      WHERE u.user_id = ?
    `;

    const coursesQuery = `
      SELECT

        c.course_name,

        p.progress_percentage,

        p.is_completed

      FROM user_course_progress p

      JOIN courses c
        ON p.course_id = c.course_id

      WHERE p.user_id = ?

      ORDER BY p.progress_percentage DESC
    `;

    db.query(
      summaryQuery,
      [req.params.id],

      (summaryErr, summaryResults) => {

        if (summaryErr) {

          console.error(
            "GUIDE SUMMARY ERROR:",
            summaryErr
          );

          return res.status(500).json({
            message:
              "failed summary",
          });
        }

        if (
          summaryResults.length === 0
        ) {

          return res.status(404).json({
            message:
              "guide not found",
          });
        }

        db.query(
          coursesQuery,
          [req.params.id],

          (
            coursesErr,
            courseResults
          ) => {

            if (coursesErr) {

              console.error(
                "GUIDE COURSES ERROR:",
                coursesErr
              );

              return res.status(500).json({
                message:
                  "failed courses",
              });
            }

            res.json({

              ...summaryResults[0],

              courses:
                courseResults,
            });
          }
        );
      }
    );
  }
);

/* ================= GET USER PROFILE (NEW FIX!) ================= */
router.get("/profile/:id", (req, res) => {
  const query = "SELECT user_name, email, phone FROM users WHERE user_id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results[0] || {});
  });
});

module.exports = router;

router.get('/by-email/:email', async (req, res) => {
  try {

    const { email } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

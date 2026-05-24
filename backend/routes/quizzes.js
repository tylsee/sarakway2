const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET QUIZ BY MODULE ================= */
router.get("/:moduleId", (req, res) => {

  const query = `
    SELECT *
    FROM quizzes
    WHERE module_id = ?
  `;

  db.query(
    query,
    [req.params.moduleId],
    (err, results) => {

      if (err) {
        console.error(
          "GET QUIZ ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to fetch quiz",
        });
      }

      res.json(results);
    }
  );
});

/* ================= CREATE QUIZ ================= */
router.post("/", (req, res) => {

  const {
    module_id,
    quiz_title,
    passing_score,
  } = req.body;

  if (!module_id) {
    return res.status(400).json({
      message:
        "module id required",
    });
  }

  const query = `
    INSERT INTO quizzes
    (
      module_id,
      quiz_title,
      passing_score
    )

    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [
      module_id,
      quiz_title || "Module Quiz",
      passing_score || 70,
    ],

    (err, result) => {

      if (err) {
        console.error(
          "CREATE QUIZ ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to create quiz",
        });
      }

      res.json({
        message:
          "quiz created",

        quiz_id:
          result.insertId,
      });
    }
  );
});

/* ================= UPDATE QUIZ ================= */
router.put("/:quizId", (req, res) => {

  const {
    quiz_title,
    passing_score,
  } = req.body;

  const query = `
    UPDATE quizzes

    SET
      quiz_title = ?,
      passing_score = ?

    WHERE quiz_id = ?
  `;

  db.query(
    query,
    [
      quiz_title,
      passing_score,
      req.params.quizId,
    ],

    (err) => {

      if (err) {
        console.error(
          "UPDATE QUIZ ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to update quiz",
        });
      }

      res.json({
        message:
          "quiz updated",
      });
    }
  );
});

/* ================= DELETE QUIZ ================= */
router.delete("/:quizId", (req, res) => {

  const query = `
    DELETE FROM quizzes
    WHERE quiz_id = ?
  `;

  db.query(
    query,
    [req.params.quizId],

    (err) => {

      if (err) {
        console.error(
          "DELETE QUIZ ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to delete quiz",
        });
      }

      res.json({
        message:
          "quiz deleted",
      });
    }
  );
});

module.exports = router;
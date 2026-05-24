const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET QUESTIONS BY QUIZ ================= */
router.get("/:quizId", (req, res) => {

  const query = `
    SELECT *
    FROM quiz_questions
    WHERE quiz_id = ?
    ORDER BY question_id ASC
  `;

  db.query(
    query,
    [req.params.quizId],

    (err, results) => {

      if (err) {

        console.error(
          "GET QUESTIONS ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to fetch questions",
        });
      }

      res.json(results);
    }
  );
});

/* ================= CREATE QUESTION ================= */
router.post("/", (req, res) => {

  const {
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
  } = req.body;

  if (
    !quiz_id ||
    !question_text
  ) {
    return res.status(400).json({
      message:
        "quiz id and question required",
    });
  }

  const query = `
    INSERT INTO quiz_questions
    (
      quiz_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    )

    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      quiz_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    ],

    (err, result) => {

      if (err) {

        console.error(
          "CREATE QUESTION ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to create question",
        });
      }

      res.json({
        message:
          "question created",

        question_id:
          result.insertId,
      });
    }
  );
});

/* ================= UPDATE QUESTION ================= */
router.put("/:questionId", (req, res) => {

  const {
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
  } = req.body;

  const query = `
    UPDATE quiz_questions

    SET
      question_text = ?,
      option_a = ?,
      option_b = ?,
      option_c = ?,
      option_d = ?,
      correct_answer = ?

    WHERE question_id = ?
  `;

  db.query(
    query,
    [
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      req.params.questionId,
    ],

    (err) => {

      if (err) {

        console.error(
          "UPDATE QUESTION ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to update question",
        });
      }

      res.json({
        message:
          "question updated",
      });
    }
  );
});

/* ================= DELETE QUESTION ================= */
router.delete("/:questionId", (req, res) => {

  const query = `
    DELETE FROM quiz_questions
    WHERE question_id = ?
  `;

  db.query(
    query,
    [req.params.questionId],

    (err) => {

      if (err) {

        console.error(
          "DELETE QUESTION ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to delete question",
        });
      }

      res.json({
        message:
          "question deleted",
      });
    }
  );
});

module.exports = router;
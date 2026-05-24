const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= CREATE ATTEMPT ================= */

router.post("/", (req, res) => {

  const {
    user_id,
    quiz_id,
    score,
    passed,
  } = req.body;

  /* ================= SAVE ATTEMPT ================= */

  const attemptQuery = `
    INSERT INTO quiz_attempts
    (
      user_id,
      quiz_id,
      score,
      passed
    )

    VALUES (?, ?, ?, ?)
  `;

  db.query(
    attemptQuery,

    [
      user_id,
      quiz_id,
      score,
      passed,
    ],

    (attemptErr, result) => {

      if (attemptErr) {

        console.error(
          "CREATE ATTEMPT ERROR:",
          attemptErr
        );

        return res.status(500).json({
          message:
            "failed to save attempt",
        });
      }

      /* ================= GET COURSE ID ================= */

      const getCourseQuery = `
        SELECT
          c.course_id

        FROM quizzes q

        JOIN modules m
          ON q.module_id = m.module_id

        JOIN courses c
          ON m.course_id = c.course_id

        WHERE q.quiz_id = ?
      `;

      db.query(
        getCourseQuery,
        [quiz_id],

        (courseErr, courseResults) => {

          if (courseErr) {

            console.error(
              "GET COURSE ERROR:",
              courseErr
            );

            return res.status(500).json({
              message:
                "failed to get course",
            });
          }

          if (
            courseResults.length === 0
          ) {

            return res.status(404).json({
              message:
                "course not found",
            });
          }

          const course_id =
            courseResults[0].course_id;

          /* ================= TOTAL QUIZZES ================= */

          const totalQuizQuery = `
            SELECT COUNT(*) AS total_quizzes

            FROM quizzes q

            JOIN modules m
              ON q.module_id = m.module_id

            WHERE m.course_id = ?
          `;

          db.query(
            totalQuizQuery,
            [course_id],

            (
              totalErr,
              totalResults
            ) => {

              if (totalErr) {

                console.error(
                  "TOTAL QUIZ ERROR:",
                  totalErr
                );

                return res.status(500).json({
                  message:
                    "failed total quizzes",
                });
              }

              const total_quizzes =
                totalResults[0]
                  .total_quizzes;

              /* ================= PASSED QUIZZES ================= */

              const passedQuizQuery = `
                SELECT COUNT(DISTINCT qa.quiz_id)
                AS quizzes_passed

                FROM quiz_attempts qa

                JOIN quizzes q
                  ON qa.quiz_id = q.quiz_id

                JOIN modules m
                  ON q.module_id = m.module_id

                WHERE qa.user_id = ?
                AND qa.passed = 1
                AND m.course_id = ?
              `;

              db.query(
                passedQuizQuery,

                [
                  user_id,
                  course_id,
                ],

                (
                  passedErr,
                  passedResults
                ) => {

                  if (passedErr) {

                    console.error(
                      "PASSED QUIZ ERROR:",
                      passedErr
                    );

                    return res.status(500).json({
                      message:
                        "failed passed count",
                    });
                  }

                  const quizzes_passed =
                    passedResults[0]
                      .quizzes_passed;

                  /* ================= CALCULATE PROGRESS ================= */

                  const progress_percentage =
                    total_quizzes === 0
                      ? 0
                      : (
                          quizzes_passed /
                          total_quizzes
                        ) * 100;

                  const is_completed =
                    progress_percentage === 100;

                  /* ================= SAVE PROGRESS ================= */

                  const progressQuery = `
                    INSERT INTO user_course_progress
                    (
                      user_id,
                      course_id,
                      quizzes_passed,
                      total_quizzes,
                      progress_percentage,
                      is_completed,
                      completed_at
                    )

                    VALUES (?, ?, ?, ?, ?, ?, ?)

                    ON DUPLICATE KEY UPDATE

                      quizzes_passed =
                        VALUES(quizzes_passed),

                      total_quizzes =
                        VALUES(total_quizzes),

                      progress_percentage =
                        VALUES(progress_percentage),

                      is_completed =
                        VALUES(is_completed),

                      completed_at =
                        VALUES(completed_at)
                  `;

                  db.query(
                    progressQuery,

                    [
                      user_id,

                      course_id,

                      quizzes_passed,

                      total_quizzes,

                      progress_percentage,

                      is_completed,

                      is_completed
                        ? new Date()
                        : null,
                    ],

                    (progressErr) => {

                      if (progressErr) {

                        console.error(
                          "SAVE PROGRESS ERROR:",
                          progressErr
                        );

                        return res.status(500).json({
                          message:
                            "failed save progress",
                        });
                      }

                      res.json({

                        message:
                          "attempt + progress saved",

                        attempt_id:
                          result.insertId,

                        progress_percentage,

                        quizzes_passed,

                        total_quizzes,

                        is_completed,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

/* ================= GET USER ATTEMPTS ================= */

router.get("/user/:userId", (req, res) => {

  const query = `
    SELECT *
    FROM quiz_attempts
    WHERE user_id = ?
    ORDER BY attempted_at DESC
  `;

  db.query(
    query,
    [req.params.userId],

    (err, results) => {

      if (err) {

        console.error(
          "GET USER ATTEMPTS ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to fetch attempts",
        });
      }

      res.json(results);
    }
  );
});

/* ================= GET QUIZ ATTEMPTS ================= */

router.get("/quiz/:quizId", (req, res) => {

  const query = `
    SELECT *
    FROM quiz_attempts
    WHERE quiz_id = ?
    ORDER BY attempted_at DESC
  `;

  db.query(
    query,
    [req.params.quizId],

    (err, results) => {

      if (err) {

        console.error(
          "GET QUIZ ATTEMPTS ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to fetch attempts",
        });
      }

      res.json(results);
    }
  );
});

module.exports = router;
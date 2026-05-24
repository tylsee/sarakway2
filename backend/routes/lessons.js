const express = require("express");
const router = express.Router();
const db = require("../db");

const updateCourseDuration = (courseId) => {

  const query = `
    UPDATE courses
    SET total_duration = (

      SELECT COALESCE(SUM(l.duration), 0)

      FROM lessons l

      INNER JOIN modules m
        ON l.module_id = m.module_id

      WHERE m.course_id = ?

    )

    WHERE course_id = ?
  `;

  db.query(query, [courseId, courseId], (err) => {

    if (err) {
      console.error(
        "UPDATE DURATION ERROR:",
        err
      );
    }

  });
};

/* ================= GET LESSONS BY MODULE ================= */
router.get("/:moduleId", (req, res) => {

  const query = `
    SELECT *
    FROM lessons
    WHERE module_id = ?
    ORDER BY lesson_id ASC
  `;

  db.query(query, [req.params.moduleId], (err, results) => {

    if (err) {
      console.error("GET LESSONS ERROR:", err);

      return res.status(500).json({
        message: "failed to fetch lessons",
      });
    }

    res.json(results);

  });
});

/* ================= DELETE LESSON ================= */
router.delete("/:id", (req, res) => {

  const lessonId = req.params.id;

  const getCourseQuery = `
    SELECT m.course_id

    FROM lessons l

    INNER JOIN modules m
      ON l.module_id = m.module_id

    WHERE l.lesson_id = ?
  `;

  db.query(
    getCourseQuery,
    [lessonId],

    (courseErr, courseResult) => {

      if (courseErr) {
        console.error(courseErr);

        return res.status(500).json({
          message: "failed",
        });
      }

      const query = `
        DELETE FROM lessons
        WHERE lesson_id = ?
      `;

      db.query(query, [lessonId], (err) => {

        if (err) {
          console.error(
            "DELETE LESSON ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed to delete lesson",
          });
        }

        if (courseResult.length > 0) {

          updateCourseDuration(
            courseResult[0].course_id
          );
        }

        res.json({
          message: "lesson deleted",
        });

      });

    }
  );
});

/* ================= UPDATE LESSON ================= */
router.put("/:id", (req, res) => {

  const {
    lesson_title,
    lesson_content,
    duration,
    video_url,
  } = req.body;

  const query = `
    UPDATE lessons
    SET
      lesson_title = ?,
      lesson_content = ?,
      duration = ?,
      video_url = ?
    WHERE lesson_id = ?
  `;

  db.query(
    query,
    [
      lesson_title,
      lesson_content,
      duration,
      video_url,
      req.params.id,
    ],

    (err) => {

      if (err) {
        console.error(
          "UPDATE LESSON ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to update lesson",
        });
      }

const getCourseQuery = `
  SELECT course_id
  FROM modules
  WHERE module_id = (
    SELECT module_id
    FROM lessons
    WHERE lesson_id = ?
  )
`;

db.query(
  getCourseQuery,
  [req.params.id],

  (courseErr, courseResult) => {

    if (
      !courseErr &&
      courseResult.length > 0
    ) {

      updateCourseDuration(
        courseResult[0].course_id
      );
    }

    res.json({
      message: "lesson updated",
    });

  }
);

    }
  );
});

/* ================= CREATE LESSON ================= */
router.post("/", (req, res) => {

  const {
    module_id,
    lesson_title,
    lesson_content,
    duration,
    video_url,
  } = req.body;

  if (!module_id || !lesson_title) {
    return res.status(400).json({
      message: "missing required fields",
    });
  }

  const query = `
    INSERT INTO lessons
    (
      module_id,
      lesson_title,
      lesson_content,
      duration,
      video_url
    )

    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      module_id,

      lesson_title,

      lesson_content || null,

      duration || 0,

      video_url || null,
    ],

    (err, result) => {

      if (err) {
        console.error("CREATE LESSON ERROR:", err);

        return res.status(500).json({
          message: "failed to create lesson",
        });
      }

    const getCourseQuery = `
    SELECT course_id
    FROM modules
    WHERE module_id = ?
    `;

    db.query(
    getCourseQuery,
    [module_id],
    (courseErr, courseResult) => {

        if (
        !courseErr &&
        courseResult.length > 0
        ) {

        updateCourseDuration(
            courseResult[0].course_id
        );
        }

        res.json({
        message: "lesson created",
        lesson_id: result.insertId,
        });

    }
    );

    }
  );
});

module.exports = router;
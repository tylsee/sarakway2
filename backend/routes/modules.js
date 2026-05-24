const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET MODULES BY COURSE ================= */
router.get("/:courseId", (req, res) => {

  const query = `
    SELECT *
    FROM modules
    WHERE course_id = ?
    ORDER BY order_index ASC
  `;

  db.query(query, [req.params.courseId], (err, results) => {

    if (err) {
      console.error("GET MODULES ERROR:", err);

      return res.status(500).json({
        message: "failed to fetch modules",
      });
    }

    res.json(results);

  });
});

/* ================= DELETE MODULE ================= */
router.delete("/:id", (req, res) => {

  const moduleId = req.params.id;

  /* DELETE LESSONS FIRST */
  const deleteLessonsQuery = `
    DELETE FROM lessons
    WHERE module_id = ?
  `;

  db.query(deleteLessonsQuery, [moduleId], (lessonErr) => {

    if (lessonErr) {
      console.error("DELETE LESSONS ERROR:", lessonErr);

      return res.status(500).json({
        message: "failed to delete lessons",
      });
    }

    /* DELETE MODULE */
    const deleteModuleQuery = `
      DELETE FROM modules
      WHERE module_id = ?
    `;

    db.query(deleteModuleQuery, [moduleId], (moduleErr) => {

      if (moduleErr) {
        console.error("DELETE MODULE ERROR:", moduleErr);

        return res.status(500).json({
          message: "failed to delete module",
        });
      }

      res.json({
        message: "module deleted",
      });

    });

  });

});

/* ================= UPDATE MODULE ================= */
router.put("/:id", (req, res) => {

  const {
    module_title,
    module_description,
  } = req.body;

  const query = `
    UPDATE modules
    SET
      module_title = ?,
      module_description = ?
    WHERE module_id = ?
  `;

  db.query(
    query,
    [
      module_title,
      module_description,
      req.params.id,
    ],

    (err) => {

      if (err) {
        console.error(
          "UPDATE MODULE ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to update module",
        });
      }

      res.json({
        message: "module updated",
      });

    }
  );
});

/* ================= CREATE MODULE ================= */
router.post("/", (req, res) => {

  const {
    course_id,
    module_title,
    module_description,
    order_index,
  } = req.body;

  if (!course_id || !module_title) {
    return res.status(400).json({
      message: "missing required fields",
    });
  }

  const query = `
    INSERT INTO modules
    (
      course_id,
      module_title,
      module_description,
      order_index
    )

    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      course_id,

      module_title,

      module_description || null,

      order_index || 1,
    ],

    (err, result) => {

      if (err) {
        console.error("CREATE MODULE ERROR:", err);

        return res.status(500).json({
          message: "failed to create module",
        });
      }

      res.json({
        message: "module created",
        module_id: result.insertId,
      });

    }
  );
});

module.exports = router;
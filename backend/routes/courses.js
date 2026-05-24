const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET ALL COURSES ================= */
router.get("/", (req, res) => {
  const query = `
    SELECT 
      c.*,
      cat.category_name,
      p.park_name

    FROM courses c

    LEFT JOIN categories cat
      ON c.category_id = cat.category_id

    LEFT JOIN parks p
      ON c.park_id = p.park_id

    ORDER BY c.course_id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("GET COURSES ERROR:", err);

      return res.status(500).json({
        message: "failed to fetch courses",
      });
    }

    res.json(results);
  });
});

/* ================= GET PUBLISHED COURSES ================= */
router.get("/published/all", (req, res) => {

  const query = `
    SELECT 
      c.*,
      cat.category_name,
      p.park_name

    FROM courses c

    LEFT JOIN categories cat
      ON c.category_id = cat.category_id

    LEFT JOIN parks p
      ON c.park_id = p.park_id

    WHERE c.status = 'Published'

    ORDER BY c.course_id DESC
  `;

  db.query(query, (err, results) => {

    if (err) {

      console.error(
        "GET PUBLISHED COURSES ERROR:",
        err
      );

      return res.status(500).json({
        message:
          "failed to fetch published courses",
      });
    }

    res.json(results);
  });
});

/* ================= GET USER COURSE PROGRESS ================= */

router.get(
  "/progress/:userId",

  (req, res) => {

    const query = `
      SELECT

        c.*,

        COALESCE(
          ucp.progress_percentage,
          0
        ) AS progress_percentage,

        COALESCE(
          ucp.is_completed,
          0
        ) AS is_completed

      FROM courses c

      LEFT JOIN user_course_progress ucp
        ON c.course_id = ucp.course_id

      AND ucp.user_id = ?

      ORDER BY c.course_id DESC
    `;

    db.query(
      query,
      [req.params.userId],

      (err, results) => {

        if (err) {

          console.error(
            "GET PROGRESS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed to fetch progress",
          });
        }

        res.json(results);
      }
    );
  }
);

/* ================= CHECK CERTIFICATE ELIGIBILITY ================= */

router.post(
  "/check-certificate",

  (req, res) => {

    const {
      user_id,
      park_id,
    } = req.body;

    /* ================= GENERAL COURSE ================= */

    const generalQuery = `
      SELECT COUNT(*) AS completed

      FROM user_course_progress ucp

      JOIN courses c
        ON ucp.course_id = c.course_id

      WHERE ucp.user_id = ?

      AND c.park_id IS NULL

      AND ucp.is_completed = 1
    `;

    db.query(
      generalQuery,
      [user_id],

      (
        generalErr,
        generalResults
      ) => {

        if (generalErr) {

          console.error(
            "GENERAL COURSE ERROR:",
            generalErr
          );

          return res.status(500).json({
            message:
              "failed general check",
          });
        }

        const generalCompleted =
          generalResults[0]
            .completed > 0;

        /* ================= TOTAL PARK COURSES ================= */

        const totalParkQuery = `
          SELECT COUNT(*) AS total

          FROM courses

          WHERE park_id = ?
        `;

        db.query(
          totalParkQuery,
          [park_id],

          (
            totalErr,
            totalResults
          ) => {

            if (totalErr) {

              console.error(
                "TOTAL PARK ERROR:",
                totalErr
              );

              return res.status(500).json({
                message:
                  "failed total park",
              });
            }

            const totalCourses =
              totalResults[0].total;

            /* ================= COMPLETED PARK COURSES ================= */

            const completedParkQuery = `
              SELECT COUNT(*) AS completed

              FROM user_course_progress ucp

              JOIN courses c
                ON ucp.course_id = c.course_id

              WHERE ucp.user_id = ?

              AND c.park_id = ?

              AND ucp.is_completed = 1
            `;

            db.query(
              completedParkQuery,

              [
                user_id,
                park_id,
              ],

              (
                completedErr,
                completedResults
              ) => {

                if (completedErr) {

                  console.error(
                    "COMPLETED PARK ERROR:",
                    completedErr
                  );

                  return res.status(500).json({
                    message:
                      "failed completed park",
                  });
                }

                const completedCourses =
                  completedResults[0]
                    .completed;

                const eligible =
                  generalCompleted &&
                  completedCourses ===
                    totalCourses;

                /* ================= IF ELIGIBLE ================= */

                if (!eligible) {

                  return res.json({
                    eligible: false,
                  });
                }

                /* ================= CHECK EXISTING ================= */

                const existingQuery = `
                  SELECT *
                  FROM certificates

                  WHERE user_id = ?
                  AND park_id = ?
                `;

                db.query(
                  existingQuery,

                  [
                    user_id,
                    park_id,
                  ],

                  (
                    existingErr,
                    existingResults
                  ) => {

                    if (existingErr) {

                      console.error(
                        existingErr
                      );

                      return res.status(500).json({
                        message:
                          "failed existing cert",
                      });
                    }

                    /* ALREADY EXISTS */

                    if (
                      existingResults.length > 0
                    ) {

                      return res.json({
                        eligible: true,

                        alreadyRequested:
                          true,
                      });
                    }

                    /* CREATE CERTIFICATE */

                    const insertQuery = `
                      INSERT INTO certificates
                      (
                        user_id,
                        park_id,
                        status
                      )

                      VALUES (?, ?, 'Pending')
                    `;

                    db.query(
                      insertQuery,

                      [
                        user_id,
                        park_id,
                      ],

                      (insertErr) => {

                        if (insertErr) {

                          console.error(
                            insertErr
                          );

                          return res.status(500).json({
                            message:
                              "failed create cert",
                          });
                        }

                        res.json({

                          eligible: true,

                          certificateRequested:
                            true,
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
  }
);

/* ================= GET USER CERTIFICATES ================= */

router.get(
  "/certificates/:userId",

  (req, res) => {

    const query = `
      SELECT

        cert.*,

        p.park_name

      FROM certificates cert

      LEFT JOIN parks p
        ON cert.park_id = p.park_id

      WHERE cert.user_id = ?

      ORDER BY cert.requested_at DESC
    `;

    db.query(
      query,
      [req.params.userId],

      (err, results) => {

        if (err) {

          console.error(
            "GET CERTIFICATES ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed certificates",
          });
        }

        res.json(results);
      }
    );
  }
);

/* ================= GET ALL CERTIFICATES ================= */

router.get(
  "/admin/certificates",

  (req, res) => {

    const query = `
      SELECT

        cert.*,

        u.user_name,

        p.park_name

      FROM certificates cert

      LEFT JOIN users u
        ON cert.user_id = u.user_id

      LEFT JOIN parks p
        ON cert.park_id = p.park_id

      ORDER BY cert.requested_at DESC
    `;

    db.query(
      query,

      (err, results) => {

        if (err) {

          console.error(
            "GET CERTIFICATES ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed certificates",
          });
        }

        res.json(results);
      }
    );
  }
);

/* ================= UPDATE CERTIFICATE STATUS ================= */

router.put(
  "/admin/certificates/:id",

  (req, res) => {

    const {
      status,
      approved_by,
    } = req.body;

    const query = `
      UPDATE certificates

      SET
        status = ?,

        approved_by = ?,

        approved_at =
          CASE
            WHEN ? = 'Approved'
            THEN NOW()
            ELSE NULL
          END

      WHERE certificate_id = ?
    `;

    db.query(
      query,

      [
        status,
        approved_by,
        status,
        req.params.id,
      ],

      (err) => {

        if (err) {

          console.error(
            "UPDATE CERT ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed update cert",
          });
        }

        res.json({
          message:
            "certificate updated",
        });
      }
    );
  }
);

/* ================= GUIDE AVAILABLE COURSES ================= */

router.get(
  "/guide/:userId",

  (req, res) => {

    const userId =
      req.params.userId;

    /* ================= CHECK MANDATORY ================= */

    const mandatoryQuery = `
      SELECT *

      FROM user_course_progress ucp

      JOIN courses c
        ON ucp.course_id = c.course_id

      WHERE ucp.user_id = ?

      AND c.is_mandatory = 1

      AND ucp.is_completed = 1
    `;

    db.query(
      mandatoryQuery,
      [userId],

      (mandatoryErr, mandatoryResults) => {

        if (mandatoryErr) {

          console.error(
            "MANDATORY CHECK ERROR:",
            mandatoryErr
          );

          return res.status(500).json({
            message:
              "failed mandatory check",
          });
        }

        /* ================= IF NOT COMPLETED ================= */

        const hasCompletedMandatory =
          mandatoryResults.length > 0;

        let query = "";

        if (!hasCompletedMandatory) {

          query = `
            SELECT

              c.*,

              COALESCE(
                ucp.progress_percentage,
                0
              ) AS progress_percentage,

              COALESCE(
                ucp.is_completed,
                0
              ) AS is_completed

            FROM courses c

            LEFT JOIN user_course_progress ucp
              ON c.course_id = ucp.course_id

            AND ucp.user_id = ?

            WHERE c.status = 'Published'

            AND c.is_mandatory = 1

            ORDER BY c.course_id DESC
          `;

        } else {

          /* ================= SHOW ALL ================= */

          query = `
            SELECT

              c.*,

              COALESCE(
                ucp.progress_percentage,
                0
              ) AS progress_percentage,

              COALESCE(
                ucp.is_completed,
                0
              ) AS is_completed

            FROM courses c

            LEFT JOIN user_course_progress ucp
              ON c.course_id = ucp.course_id

            AND ucp.user_id = ?

            WHERE c.status = 'Published'

            ORDER BY c.course_id DESC
          `;
        }

        db.query(
          query,
          [userId],

          (err, results) => {

            if (err) {

              console.error(
                "GUIDE COURSES ERROR:",
                err
              );

              return res.status(500).json({
                message:
                  "failed guide courses",
              });
            }

            res.json(results);
          }
        );
      }
    );
  }
);

/* ================= UPDATE COURSE ================= */
router.put("/:id", (req, res) => {

  const {
    course_name,
    description,
    category_id,
    park_id,
    image_url,
    status,
    is_mandatory,
  } = req.body;

  const query = `
    UPDATE courses

    SET
      course_name = ?,
      description = ?,
      category_id = ?,
      park_id = ?,
      image_url = ?,
      status = ?,
      is_mandatory = ?

    WHERE course_id = ?
  `;

  db.query(
    query,
    [
      course_name,
      description || null,
      category_id || null,
      park_id || null,
      image_url || null,
      status,
      is_mandatory ? 1 : 0,
      req.params.id,
    ],

    (err) => {

      if (err) {

        console.error(
          "UPDATE COURSE ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "failed to update course",
        });
      }

      res.json({
        message:
          "course updated",
      });
    }
  );
});

/* ================= GET SINGLE COURSE ================= */
router.get("/:id", (req, res) => {

  const query = `
    SELECT *
    FROM courses
    WHERE course_id = ?
  `;

  db.query(query, [req.params.id], (err, results) => {

    if (err) {
      console.error("GET COURSE ERROR:", err);

      return res.status(500).json({
        message: "failed to fetch course",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "course not found",
      });
    }

    res.json(results[0]);

  });
});

/* ================= CREATE COURSE ================= */
router.post("/", (req, res) => {
  const {
    course_name,
    description,
    park_id,
    category_id,
    is_mandatory,
    image_url,
    status,
    created_by,
  } = req.body;

  if (!course_name) {
    return res.status(400).json({
      message: "course name required",
    });
  }

  // GENERATE COURSE ID
  const course_id = `COURSE_${Date.now()}`;

  const query = `
    INSERT INTO courses
    (
      course_id,
      course_name,
      description,
      park_id,
      created_by,
      is_mandatory,
      image_url,
      category_id,
      status
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      course_id,

      course_name,

      description || null,

      park_id || null,

      created_by || 1,

      is_mandatory || false,

      image_url || null,

      category_id || null,

      status || "Draft",
    ],

    (err, result) => {
      if (err) {
        console.error("CREATE COURSE ERROR:", err);

        return res.status(500).json({
          message: "failed to create course",
        });
      }

      res.json({
        message: "course created",
        course_id,
      });
    }
  );
});

router.get(
  "/admin/training-overview",
  async (req, res) => {
    try {
      /* ================= SUMMARY ================= */
      // UPDATED: Added failed_quizzes and aliased pending_certs to match the frontend
      const summaryQuery = `
        SELECT
          (
            SELECT COUNT(*)
            FROM courses
          ) AS total_courses,

          (
            SELECT COUNT(*)
            FROM users
            WHERE role_id = 2
          ) AS total_guides,

          (
            SELECT COUNT(*)
            FROM user_course_progress
            WHERE is_completed = 1
          ) AS completed_courses,

          (
            SELECT COUNT(*)
            FROM certificates
            WHERE status = 'Pending'
          ) AS pending_certs,

          (
            SELECT COUNT(*) 
            FROM quiz_attempts 
            WHERE passed = 0
          ) AS failed_quizzes
      `;

      /* ================= COURSE PERFORMANCE ================= */
      const performanceQuery = `
        SELECT
          c.course_id,
          c.course_name,

          COUNT(
            DISTINCT p.user_id
          ) AS enrolled_guides,

          SUM(
            CASE
              WHEN p.is_completed = 1
              THEN 1
              ELSE 0
            END
          ) AS completed_guides,

          ROUND(
            AVG(p.progress_percentage),
            0
          ) AS average_progress

        FROM courses c

        LEFT JOIN user_course_progress p
          ON c.course_id = p.course_id

        GROUP BY c.course_id

        ORDER BY average_progress DESC
      `;

      /* ================= WEEKLY COMPLETION TREND ================= */
      // UPDATED: Formatted to return 'week' and 'completions' so the LineChart renders!
      const trendQuery = `
        SELECT
          CONCAT('W', WEEK(completed_at) - WEEK(DATE_SUB(NOW(), INTERVAL 1 MONTH)) + 1) AS week,
          COUNT(*) AS completions
        FROM user_course_progress
        WHERE is_completed = 1 AND completed_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        GROUP BY WEEK(completed_at)
        ORDER BY week ASC
      `;

      /* ================= QUIZ PERFORMANCE ================= */
      const quizStatsQuery = `
        SELECT
          ROUND(AVG(score), 0)
            AS average_score,

          COUNT(
            CASE
              WHEN passed = 0
              THEN 1
            END
          ) AS failed_attempts,

          COUNT(*) AS total_attempts

        FROM quiz_attempts
      `;

      db.query(
        summaryQuery,
        (summaryErr, summaryResults) => {
          if (summaryErr) {
            console.error(summaryErr);
            return res.status(500).json({
              message: "summary error",
            });
          }

          db.query(
            performanceQuery,
            (performanceErr, performanceResults) => {
              if (performanceErr) {
                console.error(performanceErr);
                return res.status(500).json({
                  message: "performance error",
                });
              }

              db.query(
                trendQuery,
                (trendErr, trendResults) => {
                  if (trendErr) {
                    console.error(trendErr);
                    return res.status(500).json({
                      message: "trend error",
                    });
                  }

                  db.query(
                    quizStatsQuery,
                    (quizErr, quizResults) => {
                      if (quizErr) {
                        console.error(quizErr);
                        return res.status(500).json({
                          message: "quiz stats error",
                        });
                      }

                      res.json({
                        summary: summaryResults[0],
                        performance: performanceResults,
                        trends: trendResults,
                        quizStats: quizResults[0],
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "server error",
      });
    }
  }
);

/* ================= COMPLETE LESSON ================= */
router.post(
  "/lessons/complete",

  (req, res) => {

    const {
      user_id,
      lesson_id,
    } = req.body;

    /* ================= SAVE LESSON ================= */

    const saveQuery = `
      INSERT INTO user_lesson_progress
      (
        user_id,
        lesson_id,
        is_completed
      )

      VALUES (?, ?, 1)
    `;

    db.query(
      saveQuery,

      [user_id, lesson_id],

      (saveErr) => {

        if (saveErr) {

          console.error(
            "SAVE LESSON ERROR:",
            saveErr
          );

          return res.status(500).json({
            message:
              "failed lesson save",
          });
        }

        /* ================= GET COURSE ================= */

        const courseQuery = `
          SELECT m.course_id

          FROM lessons l

          JOIN modules m
            ON l.module_id = m.module_id

          WHERE l.lesson_id = ?
        `;

        db.query(
          courseQuery,

          [lesson_id],

          (
            courseErr,
            courseResults
          ) => {

            if (
              courseErr ||
              courseResults.length === 0
            ) {

              return res.status(500).json({
                message:
                  "failed course lookup",
              });
            }

            const course_id =
              courseResults[0]
                .course_id;

            /* ================= TOTAL LESSONS ================= */

            const totalLessonsQuery = `
              SELECT COUNT(*) AS total

              FROM lessons l

              JOIN modules m
                ON l.module_id = m.module_id

              WHERE m.course_id = ?
            `;

            db.query(
              totalLessonsQuery,

              [course_id],

              (
                totalErr,
                totalResults
              ) => {

                if (totalErr) {

                  return res.status(500).json({
                    message:
                      "failed total lessons",
                  });
                }

                const totalLessons =
                  totalResults[0]
                    .total;

                /* ================= COMPLETED LESSONS ================= */

                const completedLessonsQuery = `
                  SELECT COUNT(*) AS completed

                  FROM user_lesson_progress ulp

                  JOIN lessons l
                    ON ulp.lesson_id = l.lesson_id

                  JOIN modules m
                    ON l.module_id = m.module_id

                  WHERE ulp.user_id = ?

                  AND m.course_id = ?

                  AND ulp.is_completed = 1
                `;

                db.query(
                  completedLessonsQuery,

                  [
                    user_id,
                    course_id,
                  ],

                  (
                    completedErr,
                    completedResults
                  ) => {

                    if (
                      completedErr
                    ) {

                      return res.status(500).json({
                        message:
                          "failed completed lessons",
                      });
                    }

                    const completedLessons =
                      completedResults[0]
                        .completed;

                    const progress =
                      Math.round(
                        (
                          completedLessons /
                          totalLessons
                        ) * 100
                      );

                    const is_completed =
                      progress === 100;

                    /* ================= SAVE COURSE PROGRESS ================= */

                    const progressQuery = `
                      INSERT INTO user_course_progress
                      (
                        user_id,
                        course_id,
                        progress_percentage,
                        is_completed
                      )

                      VALUES (?, ?, ?, ?)

                      ON DUPLICATE KEY UPDATE
                      progress_percentage = ?,
                      is_completed = ?
                    `;

                    db.query(
                      progressQuery,

                      [
                        user_id,
                        course_id,
                        progress,
                        is_completed,

                        progress,
                        is_completed,
                      ],

                      (
                        progressErr
                      ) => {

                        if (
                          progressErr
                        ) {

                          console.error(
                            progressErr
                          );

                          return res.status(500).json({
                            message:
                              "failed progress save",
                          });
                        }

                        res.json({

                          message:
                            "lesson completed",

                          progress,
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
  }
);
/* ================= GET COMPLETED LESSONS ================= */

router.get(
  "/lessons/completed/:userId",

  (req, res) => {

    const query = `
      SELECT lesson_id

      FROM user_lesson_progress

      WHERE user_id = ?
      AND is_completed = 1
    `;

    db.query(
      query,
      [req.params.userId],

      (err, results) => {

        if (err) {

          console.error(
            "GET LESSON PROGRESS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "failed to fetch lesson progress",
          });
        }

        res.json(results);
      }
    );
  }
);

/* ================= DELETE COURSE ================= */

router.delete("/:id", (req, res) => {

  const courseId = req.params.id;

  /* ================= DELETE QUIZ QUESTIONS ================= */

  const deleteQuestionsQuery = `
    DELETE qq

    FROM quiz_questions qq

    JOIN quizzes q
      ON qq.quiz_id = q.quiz_id

    JOIN modules m
      ON q.module_id = m.module_id

    WHERE m.course_id = ?
  `;

  db.query(
    deleteQuestionsQuery,
    [courseId],

    (questionErr) => {

      if (questionErr) {

        console.error(
          "DELETE QUESTIONS ERROR:",
          questionErr
        );

        return res.status(500).json({
          message:
            "failed deleting questions",
        });
      }

      /* ================= DELETE QUIZZES ================= */

      const deleteQuizzesQuery = `
        DELETE q

        FROM quizzes q

        JOIN modules m
          ON q.module_id = m.module_id

        WHERE m.course_id = ?
      `;

      db.query(
        deleteQuizzesQuery,
        [courseId],

        (quizErr) => {

          if (quizErr) {

            console.error(
              "DELETE QUIZZES ERROR:",
              quizErr
            );

            return res.status(500).json({
              message:
                "failed deleting quizzes",
            });
          }

          /* ================= DELETE LESSONS ================= */

          const deleteLessonsQuery = `
            DELETE l

            FROM lessons l

            JOIN modules m
              ON l.module_id = m.module_id

            WHERE m.course_id = ?
          `;

          db.query(
            deleteLessonsQuery,
            [courseId],

            (lessonErr) => {

              if (lessonErr) {

                console.error(
                  "DELETE LESSONS ERROR:",
                  lessonErr
                );

                return res.status(500).json({
                  message:
                    "failed deleting lessons",
                });
              }

              /* ================= DELETE MODULES ================= */

              const deleteModulesQuery = `
                DELETE FROM modules
                WHERE course_id = ?
              `;

              db.query(
                deleteModulesQuery,
                [courseId],

                (moduleErr) => {

                  if (moduleErr) {

                    console.error(
                      "DELETE MODULES ERROR:",
                      moduleErr
                    );

                    return res.status(500).json({
                      message:
                        "failed deleting modules",
                    });
                  }

                  /* ================= DELETE COURSE ================= */

                  const deleteCourseQuery = `
                    DELETE FROM courses
                    WHERE course_id = ?
                  `;

                  db.query(
                    deleteCourseQuery,
                    [courseId],

                    (courseErr) => {

                      if (courseErr) {

                        console.error(
                          "DELETE COURSE ERROR:",
                          courseErr
                        );

                        return res.status(500).json({
                          message:
                            "failed deleting course",
                        });
                      }

                      res.json({
                        message:
                          "course deleted",
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

module.exports = router;
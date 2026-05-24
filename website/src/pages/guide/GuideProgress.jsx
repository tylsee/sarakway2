import React, {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "../../api";

export default function GuideProgress() {

  const [courses, setCourses] =
    useState([]);

  const [stats, setStats] =
    useState({
      total: 0,
      inProgress: 0,
      completed: 0,
    });

const [certificates, setCertificates] =
  useState([]);

  /* ================= FETCH PROGRESS ================= */

  useEffect(() => {

    fetchProgress();

  }, []);

  const fetchProgress = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await apiFetch(`/courses/progress/${user.user_id}`);

      const data = await res.json();

      const publishedCourses =
        data.filter(
          (course) =>
            course.status === "Published"
        );

      setCourses(publishedCourses);

/* ================= FETCH CERTIFICATES ================= */

const certRes = await apiFetch(`/courses/certificates/${user.user_id}`);

const certData =
  await certRes.json();

setCertificates(certData);

      /* ================= STATS ================= */

      const completed =
        publishedCourses.filter(
          (course) =>
            Number(
              course.is_completed
            ) === 1
        ).length;

      const inProgress =
        publishedCourses.filter(
          (course) => {

            const progress =
              Number(
                course.progress_percentage
              );

            return (
              progress > 0 &&
              progress < 100
            );
          }
        ).length;

      setStats({
        total:
          publishedCourses.length,

        completed,

        inProgress,
      });

    } catch (err) {

      console.error(err);
    }
  };

  return (

    <div
      style={{
        padding: "40px",
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
          }}
        >
          My Progress
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          Track your learning journey
          and certifications.
        </p>

      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: "20px",

          marginBottom: "40px",
        }}
      >

        {/* TOTAL */}

        <div style={cardStyle}>
          <h2 style={numberStyle}>
            {stats.total}
          </h2>

          <p style={labelStyle}>
            Total Courses
          </p>
        </div>

        {/* IN PROGRESS */}

        <div style={cardStyle}>
          <h2 style={numberStyle}>
            {stats.inProgress}
          </h2>

          <p style={labelStyle}>
            In Progress
          </p>
        </div>

        {/* COMPLETED */}

        <div style={cardStyle}>
          <h2 style={numberStyle}>
            {stats.completed}
          </h2>

          <p style={labelStyle}>
            Completed
          </p>
        </div>

        {/* CERTIFICATES */}

        <div style={cardStyle}>
<h2 style={numberStyle}>
  {
    certificates.filter(
      (cert) =>
        cert.status === "Approved"
    ).length
  }
</h2>

          <p style={labelStyle}>
            Certificates
          </p>
        </div>

      </div>

      {/* ================= COURSES ================= */}

      <div>

        <h2
          style={{
            marginBottom: "20px",
            fontSize: "28px",
          }}
        >
          My Courses
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          {courses.map((course) => {

            const progress =
              Math.round(
                course.progress_percentage || 0
              );

            return (

              <div
                key={course.course_id}

                style={{
                  background: "#fff",

                  border:
                    "1px solid #e5e7eb",

                  borderRadius: "18px",

                  padding: "25px",
                }}
              >

                {/* TOP */}

                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom: "12px",
                  }}
                >

                  <div>

                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                      }}
                    >
                      {course.course_name}
                    </h3>

                    <p
                      style={{
                        color: "#6b7280",
                        marginTop: "6px",
                      }}
                    >
                      {course.category_name ||
                        "General"}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div>

                    {progress === 0 && (
                      <span style={notStartedStyle}>
                        Not Started
                      </span>
                    )}

                    {progress > 0 &&
                      progress < 100 && (
                      <span style={progressStyle}>
                        In Progress
                      </span>
                    )}

                    {progress === 100 && (
                      <span style={completedStyle}>
                        Completed
                      </span>
                    )}

                  </div>

                </div>

                {/* PROGRESS */}

                <div
                  style={{
                    marginTop: "18px",
                  }}
                >

                  <div
                    style={{
                      width: "100%",
                      height: "12px",

                      background:
                        "#e5e7eb",

                      borderRadius:
                        "999px",

                      overflow:
                        "hidden",
                    }}
                  >

                    <div
                      style={{
                        width:
                          `${progress}%`,

                        height: "100%",

                        background:
                          progress === 100
                            ? "#22c55e"
                            : "#3b82f6",

                        transition:
                          "width 0.4s ease",
                      }}
                    />

                  </div>

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      marginTop: "10px",

                      fontSize: "14px",
                    }}
                  >

                    <span>
                      {progress}% Complete
                    </span>

                    <span>
                      {course.total_duration || 0}
                      {" "}mins
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

{/* ================= CERTIFICATES ================= */}

<div
  style={{
    marginTop: "60px",
  }}
>

  <h2
    style={{
      marginBottom: "20px",
      fontSize: "28px",
    }}
  >
    Certificates
  </h2>

  {certificates.length === 0 ? (

    <div
      style={{
        background: "#fff",

        border:
          "1px solid #e5e7eb",

        borderRadius: "18px",

        padding: "30px",

        color: "#6b7280",
      }}
    >
      No certificates yet.
    </div>

  ) : (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >

      {certificates.map((cert) => (

        <div
          key={cert.certificate_id}

          style={{
            background: "#fff",

            border:
              "1px solid #e5e7eb",

            borderRadius: "18px",

            padding: "25px",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",
          }}
        >

          <div>

            <h3
              style={{
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              {cert.park_name}
            </h3>

            <p
              style={{
                color: "#6b7280",
                marginTop: "6px",
              }}
            >
              Park Guide Certification
            </p>

          </div>

          {/* STATUS */}

          <div>

            {cert.status ===
              "Pending" && (

              <span
                style={{
                  background:
                    "#fef3c7",

                  color:
                    "#92400e",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  fontWeight:
                    "600",
                }}
              >
                Pending Approval
              </span>
            )}

            {cert.status ===
              "Approved" && (

              <span
                style={{
                  background:
                    "#dcfce7",

                  color:
                    "#166534",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  fontWeight:
                    "600",
                }}
              >
                Approved
              </span>
            )}

            {cert.status ===
              "Rejected" && (

              <span
                style={{
                  background:
                    "#fee2e2",

                  color:
                    "#991b1b",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  fontWeight:
                    "600",
                }}
              >
                Rejected
              </span>
            )}

          </div>

        </div>
      ))}

    </div>
  )}

</div>

    </div>
  );
}

/* ================= STYLES ================= */

const cardStyle = {
  background: "#fff",

  border: "1px solid #e5e7eb",

  borderRadius: "18px",

  padding: "30px",

  textAlign: "center",
};

const numberStyle = {
  fontSize: "42px",
  fontWeight: "700",
};

const labelStyle = {
  color: "#6b7280",
  marginTop: "10px",
};

const notStartedStyle = {
  background: "#f3f4f6",

  color: "#374151",

  padding: "8px 14px",

  borderRadius: "999px",

  fontSize: "14px",

  fontWeight: "600",
};

const progressStyle = {
  background: "#dbeafe",

  color: "#1d4ed8",

  padding: "8px 14px",

  borderRadius: "999px",

  fontSize: "14px",

  fontWeight: "600",
};

const completedStyle = {
  background: "#dcfce7",

  color: "#166534",

  padding: "8px 14px",

  borderRadius: "999px",

  fontSize: "14px",

  fontWeight: "600",
};

import React, { useEffect, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import "../../styles/adminCourses.css";

export default function GuideCourses() {

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const navigate = useNavigate();

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    fetchCourses();
  }, []);

const fetchCourses = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const res = await apiFetch(`/courses/guide/${user.user_id}`);

    const data = await res.json();

    setCourses(data);

  } catch (err) {

    console.error(err);
  }
};

  /* ================= SEARCH FILTER ================= */
  const filteredCourses =
    courses.filter((course) =>
      course.course_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="admin-courses-page">

      {/* HEADER */}
      <div className="courses-header">

        <div>
          <h1>Training Courses</h1>

          <p>
            Complete your assigned learning
            modules and quizzes
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="courses-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* COURSE GRID */}
      <div className="courses-grid">

        {filteredCourses.map((course) => (

          <div
            className="course-card"
            key={course.course_id}

            onClick={() =>
              navigate(
                `/guide/courses/${course.course_id}`
              )
            }
          >

            {/* IMAGE */}
            <div className="course-image">

              {course.image_url ? (

                <img
                  src={course.image_url}
                  alt="course"
                />

              ) : (

                <BookOpen size={48} />

              )}

            </div>

            {/* CONTENT */}
            <div className="course-content">

              <div className="course-tags">

                <span className="category-tag">
                  {course.category_name ||
                    "General"}
                </span>

              </div>

              <h3>
                {course.course_name}
              </h3>

              <p>
                {course.description ||
                  "No description"}
              </p>

            {/* ================= PROGRESS BAR ================= */}

            <div
            style={{
                marginTop: "15px",
            }}
            >

            <div
                style={{
                width: "100%",
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                }}
            >

                <div
                style={{
                    width: `${course.progress_percentage || 0}%`,
                    height: "100%",

                    background:
                    course.is_completed
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

                marginTop: "6px",

                fontSize: "13px",
                }}
            >

                <span>
                {Math.round(
                    course.progress_percentage || 0
                )}% Complete
                </span>

                {course.is_completed === 1 && (
                <span
                    style={{
                    color: "#22c55e",
                    fontWeight: "600",
                    }}
                >
                    Completed
                </span>
                )}

            </div>

            </div>

              <div className="course-footer">

                <span>
                  {course.total_duration || 0}
                  {" "}mins
                </span>

                {course.is_mandatory === 1 && (
                  <span className="mandatory-badge">
                    Mandatory
                  </span>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

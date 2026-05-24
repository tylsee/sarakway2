import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  BookOpen,
  Award,
  ChartColumn,
} from "lucide-react";

import { apiFetch } from "../../api";

import "../../styles/adminGuides.css";

export default function AdminGuideDetails() {

  const { id } = useParams();

  const [guide, setGuide] =
    useState(null);

  useEffect(() => {

    fetchGuide();

  }, []);

  const fetchGuide = async () => {

    try {

      const res = await apiFetch(`/users/guides/${id}`);

      const data = await res.json();

      setGuide(data);

    } catch (err) {

      console.error(err);
    }
  };

  if (!guide) {

    return <p>Loading...</p>;
  }

  const overallProgress =
    guide.total_courses > 0
      ? Math.round(
          (
            guide.completed_courses /
            guide.total_courses
          ) * 100
        )
      : 0;

  return (

    <div className="guide-details-page">

      {/* ================= HEADER ================= */}

      <div className="guide-profile-card">

        <div className="guide-profile-left">

          <div className="guide-profile-avatar">

            {guide.user_name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <div>

            <h1>
              {guide.user_name}
            </h1>

            <p>
              {guide.email}
            </p>

          </div>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="guide-stats-grid">

        <div className="guide-stat-card">

          <BookOpen size={28} />

          <h2>
            {guide.total_courses}
          </h2>

          <p>Total Courses</p>

        </div>

        <div className="guide-stat-card">

          <ChartColumn size={28} />

          <h2>
            {guide.completed_courses}
          </h2>

          <p>Completed</p>

        </div>

        <div className="guide-stat-card">

          <Award size={28} />

          <h2>
            {guide.certificates}
          </h2>

          <p>Badges Earned</p>

        </div>

      </div>

      {/* ================= PROGRESS ================= */}

      <div className="guide-progress-card">

        <div className="progress-header">

          <h2>
            Overall Training Progress
          </h2>

          <span>
            {overallProgress}%
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"

            style={{
              width:
                `${overallProgress}%`,
            }}
          />

        </div>

      </div>

    {/* ================= COURSE PROGRESS ================= */}

    <div className="guide-courses-card">

    <h2>
        Course Progress
    </h2>

    {guide?.courses?.length === 0 ? (

        <p className="no-courses">
        No course activity yet.
        </p>

    ) : (

        <div className="guide-courses-list">

        {guide?.courses?.map(
            (course, index) => (

            <div
            key={index}
            className="guide-course-item"
            >

            <div>

                <h3>
                {course.course_name}
                </h3>

                <p>
                Progress:
                {" "}
                {course.progress_percentage}%
                </p>

            </div>

            {course.is_completed ? (

                <span className="status-completed">
                Completed
                </span>

            ) : (

                <span className="status-progress">
                In Progress
                </span>

            )}

            </div>
        ))}

        </div>
    )}

    </div>

    </div>
  );
}

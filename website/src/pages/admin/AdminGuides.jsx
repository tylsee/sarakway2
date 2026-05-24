import React, {
  useEffect,
  useState,
} from "react";

import {
  Search,
  BookOpen,
  Award,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { apiFetch } from "../../api";

import "../../styles/adminGuides.css";

export default function AdminGuides() {

  const navigate = useNavigate();

  const [guides, setGuides] =
    useState([]);

  const [search, setSearch] =
    useState("");

  /* ================= FETCH GUIDES ================= */

  useEffect(() => {

    fetchGuides();

  }, []);

  const fetchGuides = async () => {

    try {

      const res = await apiFetch("/users/guides");

      const data = await res.json();

      setGuides(data);

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= FILTER ================= */

  const filteredGuides =
    guides.filter((guide) =>

      guide.user_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const getGuideRiskStatus = (
    guide
  ) => {

    const lowProgress =
      guide.total_courses > 0 &&
      (
        guide.completed_courses /
        guide.total_courses
      ) < 0.3;

    const tooManyFails =
      guide.failed_quizzes >= 3;

    const noCourses =
      guide.total_courses === 0;

    if (
      lowProgress ||
      tooManyFails ||
      noCourses
    ) {

      return "risk";
    }

    return "good";
  };

  const getRiskReason = (guide) => {

    if (guide.total_courses === 0) {
      return "No training started";
    }

    if (guide.failed_quizzes >= 3) {
      return `${guide.failed_quizzes} failed quizzes`;
    }

    const completionRate =
      guide.completed_courses /
      guide.total_courses;

    if (completionRate < 0.3) {
      return "Very low completion rate";
    }

    return "Good progress";
  };

  return (

    <div className="admin-guides-page">

      {/* ================= HEADER ================= */}

      <div className="guides-header">

        <h1>Park Guides</h1>

        <p>
          Manage registered park guides
          and monitor training progress.
        </p>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="guides-search">

        <Search
          size={20}
          className="guides-search-icon"
        />

        <input
          type="text"
          placeholder="Search guides..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ================= TABLE ================= */}

      <div className="guides-table">

        {/* HEADER */}

        <div className="guides-table-header">

          <div>Guide</div>

          <div>Courses</div>

          <div>Completed</div>

          <div>In Progress</div>

          <div>Badges</div>

          <div>Risk Status</div>

        </div>

        {/* ROWS */}

        {filteredGuides.map((guide) => (

          <div
            key={guide.user_id}
            className="guide-row"

            onClick={() =>
              navigate(
                `/admin/users/${guide.user_id}`
              )
            }
          >

            {/* GUIDE INFO */}

            <div className="guide-info">

              <div className="guide-avatar">

                {guide.user_name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              <div className="guide-details">

                <h3>
                  {guide.user_name}
                </h3>

                <p>
                  {guide.email}
                </p>

              </div>

            </div>

            {/* STATS WRAPPER */}

            <div className="guides-stat-wrapper">

              <div className="mobile-stat">

                <span className="mobile-label">
                  Courses
                </span>

                <div className="guides-stat">

                  <BookOpen size={18} />

                  <span>
                    {guide.total_courses || 0}
                  </span>

                </div>

              </div>

              <div className="mobile-stat">

                <span className="mobile-label">
                  Completed
                </span>

                <div className="completed-count">

                  {guide.completed_courses || 0}

                </div>

              </div>

              <div className="mobile-stat">

                <span className="mobile-label">
                  In Progress
                </span>

                <div className="progress-count">

                  {guide.in_progress_courses || 0}

                </div>

              </div>

              <div className="mobile-stat">

                <span className="mobile-label">
                  Badges
                </span>

                <div className="badges-count">

                  <Award size={18} />

                  <span>
                    {guide.certificates || 0}
                  </span>

                </div>

              </div>

            </div>

            {/* RISK STATUS */}

            <div className="risk-section">

              {getGuideRiskStatus(
                guide
              ) === "risk" ? (

                <span className="risk-badge">
                  ⚠ Needs Attention
                </span>

              ) : (

                <span className="good-badge">
                  ✅ On Track
                </span>

              )}

              <p className="risk-reason">
                {getRiskReason(guide)}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

import React, {
  useEffect,
  useState,
} from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { apiFetch } from "../../api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../../styles/AdminTrainingOverview.css";

export default function AdminTrainingOverview() {

  const [summary, setSummary] =
    useState({});

  const [performance, setPerformance] =
    useState([]);
  
  const [trends, setTrends] =
    useState([]);

  const [quizStats, setQuizStats] =
    useState({});

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    fetchOverview();

  }, []);

  const fetchOverview = async () => {

    try {

      const res = await apiFetch("/courses/admin/training-overview");
      const data = await res.json();

      setSummary(data.summary);

      setPerformance(
        data.performance
      );

      setTrends(
        data.trends
      );

      setQuizStats(
        data.quizStats
      );

    } catch (err) {

      console.error(err);
    }
  };

  const COLORS = [
    "#16a34a",
    "#f59e0b",
    "#3b82f6",
  ];

  const completionStatusData = [
    {
      name: "Completed",
      value:
        summary.completed_courses || 0,
    },

    {
      name: "Pending Badges",
      value:
        summary.pending_certificates || 0,
    },

    {
      name: "Failed Quizzes",
      value:
        quizStats.failed_attempts || 0,
    },
  ];

const downloadReport = () => {

  const pdf =
    new jsPDF("p", "mm", "a4");

  /* ================= TITLE ================= */

  pdf.setFontSize(24);

  pdf.text(
    "Training Analytics Report",
    20,
    20
  );

  pdf.setFontSize(11);

  pdf.setTextColor(100);

  pdf.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    20,
    30
  );

  /* ================= SUMMARY ================= */

  pdf.setFontSize(16);

  pdf.setTextColor(0);

  pdf.text(
    "Overview Summary",
    20,
    45
  );

  pdf.setFontSize(12);

  pdf.text(
    `Total Courses: ${summary.total_courses || 0}`,
    20,
    58
  );

  pdf.text(
    `Total Guides: ${summary.total_guides || 0}`,
    20,
    68
  );

  pdf.text(
    `Completed Courses: ${summary.completed_courses || 0}`,
    20,
    78
  );

  pdf.text(
    `Pending Badges: ${summary.pending_certificates || 0}`,
    20,
    88
  );

  pdf.text(
    `Failed Quizzes: ${quizStats.failed_attempts || 0}`,
    20,
    98
  );

  /* ================= PERFORMANCE TABLE ================= */

  pdf.setFontSize(16);

  pdf.text(
    "Course Performance",
    20,
    118
  );

  autoTable(pdf, {

    startY: 125,

    head: [[
      "Course",
      "Enrolled",
      "Completed",
      "Average Progress"
    ]],

    body: performance.map(
      (course) => [

        course.course_name,

        course.enrolled_guides,

        course.completed_guides,

        `${course.average_progress || 0}%`,
      ]
    ),

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    headStyles: {
      fillColor: [22, 163, 74],
    },
  });

  /* ================= AI INSIGHTS ================= */

  const riskyCourses =
    performance.filter(
      (course) =>
        course.average_progress < 50
    );

  let finalY =
    pdf.lastAutoTable.finalY + 20;

  /* ================= AUTO PAGE BREAK ================= */

  if (finalY > 240) {

    pdf.addPage();

    finalY = 20;
  }

  pdf.setFontSize(18);

  pdf.text(
    "AI Insights",
    20,
    finalY
  );

  pdf.setFontSize(12);

  pdf.text(
    `• ${riskyCourses.length} course(s) have below 50% average progress.`,
    20,
    finalY + 15
  );

  if (riskyCourses.length > 0) {

    riskyCourses.forEach(
      (course, index) => {

        pdf.text(
          `• ${course.course_name} (${course.average_progress}%)`,
          25,
          finalY + 30 + (index * 10)
        );
      }
    );
  }

  const failedQuizY =
    finalY + 30 +
    (riskyCourses.length * 10) + 15;

  pdf.text(
    `• Total failed quizzes: ${quizStats.failed_attempts || 0}`,
    20,
    failedQuizY
  );

  pdf.text(
    `• Guides may require additional intervention and retraining.`,
    20,
    failedQuizY + 15
  );

  /* ================= SAVE ================= */

  pdf.save(
    "training-analytics-report.pdf"
  );
};

  return (

    <div className="training-overview-page">

      {/* ================= HEADER ================= */}

      <div className="training-header">
        <button onClick={downloadReport}>
          Export PDF
        </button>

        <h1>
          Training Analytics
        </h1>

        <p>
          Monitor training performance,
          guide progress, and learning
          analytics across all park guides.
        </p>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="summary-grid">

        <SummaryCard
          title="Total Courses"
          value={
            summary.total_courses || 0
          }
        />

        <SummaryCard
          title="Total Guides"
          value={
            summary.total_guides || 0
          }
        />

        <SummaryCard
          title="Completed Courses"
          value={
            summary.completed_courses || 0
          }
        />

        <SummaryCard
          title="Pending Badges"
          value={
            summary.pending_certificates || 0
          }
        />

      </div>

      {/* ================= CHARTS ================= */}

      <div className="analytics-charts-grid">

        {/* LINE CHART */}

        <div className="analytics-chart-card">

          <h2>
            Weekly Completion Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={trends.map((item) => ({
                day: new Date(
                  item.completion_day
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                }),

                completed:
                  item.completed_count,
              }))}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="completed"
                stroke="#16a34a"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="analytics-chart-card">

          <h2>
            Training Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={
                  completionStatusData
                }

                cx="50%"
                cy="50%"

                outerRadius={100}

                dataKey="value"

                label
              >

                {completionStatusData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}

                      fill={
                        COLORS[index]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= PERFORMANCE TABLE ================= */}

      <div className="performance-table">

        {/* HEADER */}

        <div className="performance-header">

          <div>Course</div>

          <div>Enrolled</div>

          <div>Completed</div>

          <div>
            Average Progress
          </div>

        </div>

        {/* ROWS */}

        {performance.map((course) => (

          <div
            key={course.course_id}
            className="performance-row"
          >

            <div className="course-name">
              {course.course_name}
            </div>

            <div>
              {course.enrolled_guides}
            </div>

            <div>
              {course.completed_guides}
            </div>

            <div>

              <div className="progress-bar">

                <div
                  className="progress-fill"

                  style={{
                    width:
                      `${course.average_progress || 0}%`,
                  }}
                />

              </div>

              <span className="progress-text">

                {course.average_progress || 0}%

              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ================= SUMMARY CARD ================= */

function SummaryCard({
  title,
  value,
}) {

  return (

    <div className="summary-card">

      <h2>
        {value}
      </h2>

      <p>
        {title}
      </p>

    </div>
  );
}

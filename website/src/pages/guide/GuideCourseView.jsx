import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "../../styles/guideCourses.css";

import CourseModulesSection from "../admin/courses/components/CourseModulesSection";

import { apiFetch } from "../../api";

export default function GuideCourseView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] =
    useState(null);

    const [modules, setModules] =
    useState([]);

    const [lessons, setLessons] =
    useState({});

    const [quizzes, setQuizzes] =
    useState({});

    const [questions, setQuestions] =
    useState({});

    const [answers, setAnswers] =
    useState({});

    const [activeQuiz, setActiveQuiz] =
    useState(null);

    const [expandedLessons, setExpandedLessons] =
    useState({});

    const [completedLessons, setCompletedLessons] =
    useState({});
    
    const [quizResult, setQuizResult] =
    useState(null);

    const [completedQuizzes, setCompletedQuizzes] =
    useState({});

    const [expandedModules, setExpandedModules] =
    useState({});
     

  useEffect(() => {

    fetchCourse();
    fetchModules();

  }, []);

  useEffect(() => {

  const fetchCompletedLessons =
    async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem("user")
          );

        const response =
          await apiFetch(
            `/courses/lessons/completed/${user.user_id}`
          );

        const data =
          await response.json();

        const completedMap = {};

        data.forEach((lesson) => {

          completedMap[
            lesson.lesson_id
          ] = true;
        });

        setCompletedLessons(
          completedMap
        );

      } catch (error) {

        console.error(
          "FETCH LESSON PROGRESS ERROR:",
          error
        );
      }
    };

  fetchCompletedLessons();

}, []);

  /* ================= COURSE ================= */

  const fetchCourse = async () => {

    try {

      const res = await apiFetch(
        `/courses/${id}`
      );

      const data = await res.json();

      setCourse(data);

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= MODULES ================= */

  const fetchModules = async () => {

    try {

      const res = await apiFetch(
        `/modules/${id}`
      );

      const data = await res.json();

      setModules(data);

      data.forEach((module) => {

        fetchLessons(
          module.module_id
        );

        fetchQuizzes(
          module.module_id
        );

      });

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= LESSONS ================= */

  const fetchLessons = async (
    moduleId
  ) => {

    try {

      const res = await apiFetch(
        `/lessons/${moduleId}`
      );

      const data = await res.json();

      setLessons((prev) => ({
        ...prev,
        [moduleId]: data,
      }));

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= QUIZZES ================= */

  const fetchQuizzes = async (
    moduleId
  ) => {

    try {

      const res = await apiFetch(
        `/quizzes/${moduleId}`
      );

      const data = await res.json();

      setQuizzes((prev) => ({
        ...prev,
        [moduleId]: data,
      }));

      data.forEach((quiz) => {

        fetchQuestions(
          quiz.quiz_id
        );

      });

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= QUESTIONS ================= */

  const fetchQuestions = async (
    quizId
  ) => {

    try {

      const res = await apiFetch(
        `/quiz-questions/${quizId}`
      );

      const data = await res.json();

      setQuestions((prev) => ({
        ...prev,
        [quizId]: data,
      }));

    } catch (err) {

      console.error(err);
    }
  };

    const handleSubmitQuiz = async (
    quiz
    ) => {

    const quizQuestions =
        questions[quiz.quiz_id] || [];

    let correct = 0;

    quizQuestions.forEach((question) => {

        if (
        answers[question.question_id] ===
        question.correct_answer
        ) {
        correct++;
        }

    });



    const score = Math.round(
        (correct / quizQuestions.length) * 100
    );

    const passed =
        score >= quiz.passing_score;

    const user = JSON.parse(
    localStorage.getItem("user")
    );

const result = await apiFetch(
  "/quiz-attempts",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      user_id: user.user_id,
      quiz_id: quiz.quiz_id,
      score,
      passed,
    }),
  }
);

const data = await result.json();

setQuizResult({

  score,

  passed,

  progress:
    Math.round(
      data.progress_percentage || 0
    ),

  is_completed:
    data.is_completed,
});

setCompletedQuizzes((prev) => ({
  ...prev,

  [quiz.quiz_id]: {
    score,
    passed,
  },
}));

setActiveQuiz(null);
setAnswers({});
/* ================= CHECK CERTIFICATE ================= */

if (data.is_completed) {

  if (course.park_id) {

    const certRes = await apiFetch(
      "/courses/check-certificate",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          user_id: user.user_id,
          park_id: course.park_id,
        }),
      }
    );

    const certData =
      await certRes.json();

    if (
      certData.certificateRequested
    ) {

      setQuizResult((prev) => ({
        ...prev,

        certificateRequested: true,
      }));
    }
  }
}

    };

  if (!course) {

    return <p>Loading...</p>;
  }

  return (

    <div className="guide-course-page">

      <button
        className="back-btn"
        onClick={() =>
          navigate("/guide/courses")
        }
      >
        ← Back to Courses
      </button>

      <div className="guide-course-hero">

        <h1 className="guide-course-title">
          {course.course_name}
        </h1>

        <p className="guide-course-description">
          {course.description}
        </p>

      </div>

      <CourseModulesSection
        mode="guide"

        modules={modules}
        lessons={lessons}
        quizzes={quizzes}
        questions={questions}

        answers={answers}
        setAnswers={setAnswers}

        handleSubmitQuiz={handleSubmitQuiz}

        activeQuiz={activeQuiz}
        setActiveQuiz={setActiveQuiz}

        expandedLessons={expandedLessons}
        setExpandedLessons={setExpandedLessons}

        completedQuizzes={completedQuizzes}
        setCompletedQuizzes={setCompletedQuizzes}

        completedLessons={completedLessons}
        setCompletedLessons={setCompletedLessons}

        expandedModules={expandedModules}
        setExpandedModules={setExpandedModules}
      />

      {/* ================= QUIZ RESULT MODAL ================= */}

      {quizResult && (

      <div
        style={{
          position: "fixed",
          inset: 0,

          background:
            "rgba(0,0,0,0.5)",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          zIndex: 999,
        }}
      >

        <div
          style={{
            background: "white",

            padding: "30px",

            borderRadius: "16px",

            width: "400px",

            maxWidth: "90%",
          }}
        >

          <h2>
            Quiz Completed
          </h2>

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <h1
              style={{
                fontSize: "48px",
                margin: 0,
              }}
            >
              {quizResult.score}%
            </h1>

            <p
              style={{
                fontWeight: "600",

                color:
                  quizResult.passed
                    ? "#16a34a"
                    : "#dc2626",
              }}
            >

              {quizResult.passed
                ? "PASSED ✅"
                : "FAILED ❌"}

            </p>

            <p>
              Course Progress:
              {" "}
              {quizResult.progress}%
            </p>

            {quizResult.certificateRequested && (

              <div
                style={{
                  marginTop: "16px",

                  padding: "12px",

                  background: "#dcfce7",

                  borderRadius: "10px",
                }}
              >

                Certificate request submitted
                for admin approval.

              </div>
            )}

          </div>

          <button
            onClick={() =>
              setQuizResult(null)
            }

            style={{
              marginTop: "20px",

              width: "100%",

              padding: "12px",
            }}
          >

            Close

          </button>

        </div>

      </div>
      )}

    </div>
  );
}

import React from "react";
import { apiFetch } from "../../../../api";
import "../../../../styles/courseditor.css";

export default function CourseModulesSection({
    mode,
    modules,
    lessons,
    quizzes,
    questions,

    setSelectedQuizModule,
    setShowQuizModal,

    setDeleteType,
    setDeleteId,
    setDeleteModuleId,
    setShowDeleteModal,

    setEditingModule,
    setEditModuleForm,
    setShowEditModuleModal,

    setSelectedModule,
    setShowLessonModal,

    setEditingLesson,
    setEditLessonForm,
    setShowEditLessonModal,

    setSelectedQuiz,
    setShowQuestionModal,

    setEditingQuiz,
    setEditQuizForm,
    setShowEditQuizModal,

    answers,
    setAnswers,

    handleSubmitQuiz,

    activeQuiz,
    setActiveQuiz,

    expandedLessons,
    setExpandedLessons,

    completedQuizzes,
    setCompletedQuizzes,

    completedLessons,
    setCompletedLessons,

    expandedModules,
    setExpandedModules,

    setEditQuestionForm,
    setShowEditQuestionModal,
}) {

return(
<div style={{ marginTop: "20px" }}>

{modules.map((module) => {

const moduleLessons =
  lessons[module.module_id] || [];

const allLessonsCompleted =
  moduleLessons.every(
    (lesson) =>
      completedLessons?.[
        lesson.lesson_id
      ]
  );

return (

<div
    key={module.module_id}
    className="guide-module-card"
>

    {/* MODULE HEADER */}

    <div
    className="guide-module-header"

    onClick={() => {

        setExpandedModules((prev) => ({
        ...prev,

        [module.module_id]:
            !prev[module.module_id],
        }));

    }}

    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        cursor: "pointer",

        paddingBottom: "10px",
    }}
    >

    <h3 style={{ margin: 0 }}>
        Module {module.order_index}:{" "}
        {module.module_title}
    </h3>

    <span
        style={{
        fontSize: "20px",
        fontWeight: "bold",
        }}
    >

        {expandedModules?.[
        module.module_id
        ]
        ? "−"
        : "+"}

    </span>

    </div>

{expandedModules?.[
    module.module_id
    ] && (

        <div>

    {/* ADMIN MODULE ACTIONS */}
    {mode === "admin" && (
    <div style={{ marginTop: "10px" }}>

        <button
            onClick={() => {

            setDeleteType("module");

            setDeleteId(module.module_id);

            setShowDeleteModal(true);

            }}
        >
            Delete Module
        </button>

        <button
        onClick={() => {

            setEditingModule(module);

            setEditModuleForm({
            module_title: module.module_title,
            module_description:
                module.module_description,
            });

            setShowEditModuleModal(true);

        }}
        >
            Edit Module
        </button>

    </div>
    )}

    <p>
        {module.module_description}
    </p>

    <hr></hr>

    {/* ADMIN ADD LESSON */}
    {mode === "admin" && (
    <button
    onClick={() => {

        setSelectedModule(
        module.module_id
        );

        setShowLessonModal(true);

    }}
    >
        + Add Lesson
    </button>
    )}

    {/* LESSONS */}
    <div style={{ marginTop: "20px" }}>

    {(lessons[module.module_id] || []).map((lesson) => (

    <div
        key={lesson.lesson_id}
        className="guide-lesson-card"
    >

        <h4>
            {lesson.lesson_title}
        </h4>

        <small>
        {lesson.duration} mins
        </small>

        {completedLessons?.[
        lesson.lesson_id
        ] && (

        <p
            style={{
            color: "#16a34a",
            fontWeight: "600",
            marginTop: "8px",
            }}
        >
            Completed ✅
        </p>
        )}

    {/* ADMIN LESSON PREVIEW */}
    {mode === "admin" && (

    <div style={{ marginTop: "12px" }}>

    <div
    className="lesson-content-display"
    dangerouslySetInnerHTML={{
        __html: lesson.lesson_content,
    }}
    />

        {lesson.video_url && (

        <iframe
            width="100%"
            height="315"

            src={lesson.video_url
            .replace(
                "watch?v=",
                "embed/"
            )
            .replace(
                "youtu.be/",
                "youtube.com/embed/"
            )
            }

            title="Lesson Video"

            frameBorder="0"

            allowFullScreen

            style={{
            marginTop: "12px",
            borderRadius: "12px",
            }}
        />
        )}

    </div>
    )}

    {/* GUIDE LESSON BUTTON */}
    {mode === "guide" && (

    <div style={{ marginTop: "10px" }}>

    <button
        onClick={() => {

        setExpandedLessons((prev) => ({
            ...prev,

            [lesson.lesson_id]:
            !prev[lesson.lesson_id],
        }));

        setCompletedLessons((prev) => ({
        ...prev,
        [lesson.lesson_id]: true,
        }));

        apiFetch(
        "/courses/lessons/complete",
        {
            method: "POST",

            headers: {
            "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

            user_id:
                JSON.parse(
                localStorage.getItem("user")
                ).user_id,

            lesson_id:
                lesson.lesson_id,
            }),
        }
        );

        }}
    >

        {expandedLessons?.[
        lesson.lesson_id
        ]
        ? "Hide Lesson"
        : "Start Lesson"}

    </button>

    {expandedLessons?.[
        lesson.lesson_id
    ] && (

        <div style={{ marginTop: "16px" }}>

        <p
        style={{
            whiteSpace: "pre-line",
        }}
        >
            {lesson.lesson_content}
        </p>
        
        {lesson.video_url && (

            <iframe
            width="100%"
            height="315"

            src={lesson.video_url
            .replace(
                "watch?v=",
                "embed/"
            )
            .replace(
                "youtu.be/",
                "youtube.com/embed/"
            )
            }

            title="Lesson Video"

            frameBorder="0"

            allowFullScreen

            style={{
                marginTop: "16px",
                borderRadius: "12px",
            }}
            />
        )}

        </div>
    )}

    </div>
    )}

        {/* ADMIN LESSON ACTIONS */}
        {mode === "admin" && (
        <div style={{ marginTop: "10px" }}>

            <button
                onClick={() => {

                setDeleteType("lesson");

                setDeleteId(lesson.lesson_id);

                setDeleteModuleId(module.module_id);

                setShowDeleteModal(true);

                }}
            >
                Delete Lesson
            </button>

            <button
            onClick={() => {

                setEditingLesson(lesson);

                setEditLessonForm({
                lesson_title:
                    lesson.lesson_title,

                lesson_content:
                    lesson.lesson_content,

                duration:
                    lesson.duration,

                video_url:
                    lesson.video_url || "",
                });

                setShowEditLessonModal(true);

            }}
            >
                Edit Lesson
            </button>

        </div>
        )}

    </div>

    ))}

    </div>

    <hr style={{ margin: "20px 0" }} />

    {/* QUIZZES */}
    <h4>Quizzes</h4>

    {/* ADMIN ADD QUIZ */}
    {mode === "admin" && (
    <button
    onClick={() => {

        setSelectedQuizModule(
        module.module_id
        );

        setShowQuizModal(true);

    }}
    >
        + Add Quiz
    </button>
    )}

    <div style={{ marginTop: "16px" }}>

    {(quizzes[module.module_id] || []).map(
    (quiz) => (

    <div
        key={quiz.quiz_id}
        className="guide-quiz-card"
    >
        <h4>
            {quiz.quiz_title}
        </h4>

        <p>
            Passing Score:
            {" "}
            {quiz.passing_score}%
        </p>

        { /* GUIDE QUIZ STATE */}
        {mode === "guide" && (

        <div style={{ marginTop: "10px" }}>

        {!completedQuizzes?.[
            quiz.quiz_id
        ] ? (

            <button className="primary-btn"
            disabled={!allLessonsCompleted}

            onClick={() => {

                if (!allLessonsCompleted)
                return;

                setAnswers({});

                setActiveQuiz(
                quiz.quiz_id
                );

            }}

            style={{
                opacity:
                allLessonsCompleted ? 1 : 0.5,

                cursor:
                allLessonsCompleted
                    ? "pointer"
                    : "not-allowed",
            }}
            >

            {!allLessonsCompleted && (

                <p
                style={{
                    marginTop: "8px",
                    color: "#dc2626",
                    fontSize: "14px",
                }}
                >
                Complete all lessons first
                </p>

            )}

            {activeQuiz === quiz.quiz_id
                ? "Quiz In Progress"
                : "Start Quiz"}

            </button>



        ) : (

            <div
            style={{
                padding: "12px",

                background: "#f0fdf4",

                borderRadius: "10px",

                marginTop: "10px",
            }}
            >

            <p
                style={{
                fontWeight: "600",
                color: "#16a34a",
                }}
            >

                Completed ✅

            </p>

            <p>
                Score:
                {" "}
                {
                completedQuizzes[
                    quiz.quiz_id
                ].score
                }%
            </p>

            <button
                onClick={() => {

                setCompletedQuizzes(
                    (prev) => {

                    const updated = {
                    ...prev,
                    };

                    delete updated[
                    quiz.quiz_id
                    ];

                    return updated;
                });

                setActiveQuiz(
                    quiz.quiz_id
                );
                }}
            >

                Retry Quiz

            </button>

            </div>
        )}

        </div>
        )}

        {/* ADMIN QUIZ ACTIONS */}
        {mode === "admin" && (
        <div style={{ marginTop: "10px" }}>

            <button
                onClick={() => {

                setEditingQuiz(quiz);

                setEditQuizForm({
                    quiz_title:
                    quiz.quiz_title,

                    passing_score:
                    quiz.passing_score,
                });

                setShowEditQuizModal(true);

                }}
            >
                Edit Quiz
            </button>


            <button
                onClick={() => {

                setDeleteType("quiz");

                setDeleteId(quiz.quiz_id);

                setDeleteModuleId(
                    module.module_id
                );

                setShowDeleteModal(true);

                }}
            >
                Delete Quiz
            </button>

                        <hr></hr>

        </div>
        )}

        {/* ADMIN ADD QUESTION */}
        {mode === "admin" && (
        <button
        onClick={() => {

            setSelectedQuiz(
            quiz.quiz_id
            );

            setShowQuestionModal(true);

        }}
        >
            + Add Question
        </button>
        )}

        {/* QUESTIONS */}
        {(mode === "admin" ||
        activeQuiz === quiz.quiz_id) && (

        <div style={{ marginTop: "16px" }}>

        {(questions[quiz.quiz_id] || []).map(
        (question) => (

        <div
            key={question.question_id}
            className="guide-question-card"
        >

            <p>
            <strong>
                Question:
            </strong>
            {" "}
            {question.question_text}
            </p>

            {["A", "B", "C", "D"].map(
            (option) => {

                const optionText =
                question[
                    `option_${option.toLowerCase()}`
                ];

                return (

                <button
                    key={option}

                    className={`quiz-option-btn ${
                        answers?.[
                            question.question_id
                        ] === option
                        ? "selected"
                        : ""
                    }`}

                    onClick={() => {

                    if (mode === "guide") {

                        setAnswers((prev) => ({
                        ...prev,

                        [question.question_id]:
                            option,
                        }));
                    }
                    }}
                >

                    {option}. {optionText}

                </button>

                );
            }
            )}

            {/* ADMIN SHOW CORRECT ANSWER */}
            {mode === "admin" && (
            <p> Correct Answer: {question.correct_answer}
            </p>
            )}

            <div className="question-actions">

            <button
                className="edit-question-btn"

                onClick={() => {

                setEditQuestionForm({
                    question_id: question.question_id,

                    question_text:
                    question.question_text,

                    option_a:
                    question.option_a,

                    option_b:
                    question.option_b,

                    option_c:
                    question.option_c,

                    option_d:
                    question.option_d,

                    correct_answer:
                    question.correct_answer,
                });

                setShowEditQuestionModal(true);
                }}
            >
                Edit Question
            </button>

            </div>

        </div>

        )
        )}

        {mode === "guide" && (
        <button
            onClick={() =>
            handleSubmitQuiz(quiz)
            }
            style={{
            marginTop: "16px",
            }}
        >
            Submit Quiz
        </button>
        )}

        </div>

        )}
        

    </div>

    )
    )}

    </div>

    </div>

)}

</div>

);
})}

</div>
);
}

import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import CourseModulesSection from "./components/CourseModulesSection";
import BaseModal from "./components/BaseModal";
import "../../../styles/courseditor.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { apiFetch } from "../../../api";

export default function CourseEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showEditModuleModal, setShowEditModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
    const [editModuleForm, setEditModuleForm] = useState({
      
    module_title: "",
    module_description: "",
    });
    const [moduleForm, setModuleForm] = useState({
    module_title: "",
    module_description: "",
    });
    const [courseForm, setCourseForm] = useState({
      course_name: "",
      description: "",
      category_id: "",
      park_id: "",
      image_url: "",
      status: "Draft",
      is_mandatory: false,
    });
    const [lessons, setLessons] = useState([]);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showEditLessonModal, setShowEditLessonModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editLessonForm, setEditLessonForm] = useState({
    lesson_title: "",
    lesson_content: "",
    duration: "",
    video_url: "",
    });

    const [showEditQuizModal,
    setShowEditQuizModal] =
    useState(false);

    const [editingQuiz, setEditingQuiz] =
    useState(null);

    const [editQuizForm, setEditQuizForm] =
    useState({
        quiz_title: "",
        passing_score: 70,
    });
    const [quizzes, setQuizzes] = useState({});
    const [showQuizModal, setShowQuizModal] =
    useState(false);

    const [selectedQuizModule, setSelectedQuizModule] =
    useState(null);

    const [quizForm, setQuizForm] = useState({
    quiz_title: "",
    passing_score: 70,
    });

    const [questions, setQuestions] =
    useState({});

    const [showQuestionModal, setShowQuestionModal] =
    useState(false);

    const [selectedQuiz, setSelectedQuiz] =
    useState(null);

    const [questionForm, setQuestionForm] =
    useState({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
    });

    const [editQuestionForm, setEditQuestionForm] = useState({
      question_id: null,
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    });

    const handleEditQuestion = async () => {

      try {

        await apiFetch(
          `/quizQuestions/${editQuestionForm.question_id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              question_text:
                editQuestionForm.question_text,

              option_a:
                editQuestionForm.option_a,

              option_b:
                editQuestionForm.option_b,

              option_c:
                editQuestionForm.option_c,

              option_d:
                editQuestionForm.option_d,

              correct_answer:
                editQuestionForm.correct_answer,
            }),
          }
        );

    setShowEditQuestionModal(false);

    await fetchModules();

      } catch (err) {

        console.error(err);

        alert("Failed to update question");
      }
    };

    const [selectedModule, setSelectedModule] = useState(null);
    const [lessonForm, setLessonForm] = useState({
    lesson_title: "",
    lesson_content: "",
    duration: "",
    video_url: "",
    });

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteType, setDeleteType] =
        useState("");

    const [deleteId, setDeleteId] =
        useState(null);

    const [deleteModuleId, setDeleteModuleId] =
        useState(null);

    const [expandedModules, setExpandedModules] =
        useState({});

    useEffect(() => {
    fetchCourse();
    fetchModules();
    }, []);

    const fetchCourse = async () => {
        try {
        const res = await apiFetch(
            `/courses/${id}`
        );

        const data = await res.json();

        setCourse(data);
        setCourseForm({
            course_name: data.course_name || "",
            description: data.description || "",
            category_id: data.category_id || "",
            park_id: data.park_id || "",
            image_url: data.image_url || "",
            status: data.status || "Draft",
            is_mandatory: data.is_mandatory === 1,
        });

        } catch (err) {
        console.error(err);
        }
    };

    const fetchModules = async () => {

        try {

            const res = await apiFetch(
            `/modules/${id}`
            );

            const data = await res.json();

            setModules(data);
            data.forEach((module) => {
            fetchLessons(module.module_id);
            fetchQuizzes(module.module_id);
            });

        } catch (err) {
            console.error(err);
        }
    };  

    const fetchLessons = async (moduleId) => {

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

    const fetchQuizzes = async (moduleId) => {

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

    const handleCreateQuestion =
    async () => {

    try {

        const res = await apiFetch(
        "/quiz-questions",
        {
            method: "POST",

            headers: {
            "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
            quiz_id: selectedQuiz,

            question_text:
                questionForm.question_text,

            option_a:
                questionForm.option_a,

            option_b:
                questionForm.option_b,

            option_c:
                questionForm.option_c,

            option_d:
                questionForm.option_d,

            correct_answer:
                questionForm.correct_answer,
            }),
        }
        );

        const data = await res.json();

        if (!res.ok) {

        alert(
            data.message || "failed"
        );

        return;
        }

        await fetchQuestions(
        selectedQuiz
        );

        setShowQuestionModal(false);

        setQuestionForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        });

    } catch (err) {

        console.error(err);
    }
    };

    const handleEditQuiz = async () => {

    try {

        await apiFetch(
        `/quizzes/${editingQuiz.quiz_id}`,
        {
            method: "PUT",

            headers: {
            "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
            quiz_title:
                editQuizForm.quiz_title,

            passing_score:
                editQuizForm.passing_score,
            }),
        }
        );

        await fetchModules();

        setShowEditQuizModal(false);

    } catch (err) {

        console.error(err);
    }
    };

    const handleDeleteQuiz = async (
    quizId,
    moduleId
    ) => {

    try {

        await apiFetch(
        `/quizzes/${quizId}`,
        {
            method: "DELETE",
        }
        );

        await fetchQuizzes(moduleId);

    } catch (err) {

        console.error(err);
    }
    };

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

    const handleCreateModule = async () => {

        try {

            const res = await apiFetch(
            "/modules",
            {
                method: "POST",

                headers: {
                "Content-Type": "application/json",
                },

                body: JSON.stringify({
                course_id: id,

                module_title: moduleForm.module_title,

                module_description:
                    moduleForm.module_description,

                order_index: modules.length + 1,
                }),
            }
            );

            const data = await res.json();

            if (!res.ok) {
            alert(data.message || "failed");
            return;
            }

            await fetchModules();

            setShowModuleModal(false);

            setModuleForm({
            module_title: "",
            module_description: "",
            });

        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateLesson = async () => {

    try {

        const res = await apiFetch(
        "/lessons",
        {
            method: "POST",

            headers: {
            "Content-Type": "application/json",
            },

            body: JSON.stringify({
            module_id: selectedModule,

            lesson_title: lessonForm.lesson_title,

            lesson_content:
                lessonForm.lesson_content,

            duration: lessonForm.duration,

            video_url: lessonForm.video_url,
            }),
        }
        );

        const data = await res.json();

        if (!res.ok) {
        alert(data.message || "failed");
        return;
        }

        await fetchLessons(selectedModule);

        setShowLessonModal(false);

        setLessonForm({
        lesson_title: "",
        lesson_content: "",
        duration: "",
        video_url: "",
        });

    } catch (err) {
        console.error(err);
    }
    };

    const handleCreateQuiz = async () => {

    try {

        const res = await apiFetch(
        "/quizzes",
        {
            method: "POST",

            headers: {
            "Content-Type": "application/json",
            },

            body: JSON.stringify({
            module_id: selectedQuizModule,

            quiz_title: quizForm.quiz_title,

            passing_score:
                quizForm.passing_score,
            }),
        }
        );

        const data = await res.json();

        if (!res.ok) {
        alert(data.message || "failed");
        return;
        }

        await fetchQuizzes(selectedQuizModule);

        setShowQuizModal(false);

        setQuizForm({
        quiz_title: "",
        passing_score: 70,
        });

    } catch (err) {
        console.error(err);
    }
    };

    const handleEditLesson = async () => {

    try {

        await apiFetch(
        `/lessons/${editingLesson.lesson_id}`,
        {
            method: "PUT",

            headers: {
            "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
            lesson_title:
                editLessonForm.lesson_title,

            lesson_content:
                editLessonForm.lesson_content,

            duration:
                editLessonForm.duration,

            video_url:
                editLessonForm.video_url,
            }),
        }
        );

        await fetchModules();

        setShowEditLessonModal(false);

    } catch (err) {
        console.error(err);
    }
    };

    const handleDeleteLesson = async (
    lessonId,
    moduleId
    ) => {

    try {

        await apiFetch(
        `/lessons/${lessonId}`,
        {
            method: "DELETE",
        }
        );

        await fetchLessons(moduleId);

    } catch (err) {
        console.error(err);
    }
    };

    const handleDeleteModule = async (
    moduleId
    ) => {

    try {

        await apiFetch(
        `/modules/${moduleId}`,
        {
            method: "DELETE",
        }
        );

        await fetchModules();

    } catch (err) {
        console.error(err);
    }
    };

    const handleEditModule = async () => {

    try {

        await apiFetch(
        `/modules/${editingModule.module_id}`,
        {
            method: "PUT",

            headers: {
            "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
            module_title:
                editModuleForm.module_title,

            module_description:
                editModuleForm.module_description,
            }),
        }
        );

        await fetchModules();

        setShowEditModuleModal(false);

    } catch (err) {
        console.error(err);
    }
    };

const handleImageUpload =
async (e) => {

  const file =
    e.target.files[0];

  if (!file) return;

  const formData =
    new FormData();

  formData.append(
    "image",
    file
  );

  try {

    const res = await apiFetch(
      "/uploads-api/course-image",
      {
        method: "POST",

        body: formData,
      }
    );

    const data =
      await res.json();

    setCourseForm((prev) => ({
      ...prev,

      image_url:
        data.imageUrl,
    }));

  } catch (err) {

    console.error(
      "IMAGE UPLOAD ERROR:",
      err
    );
  }
};

const handleUpdateCourse = async () => {

  try {

    const res = await apiFetch(
      `/courses/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(courseForm),
      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(data.message || "failed");

      return;
    }

    alert("Course updated");

    fetchCourse();

  } catch (err) {

    console.error(err);
  }
};

const handleDeleteCourse = async () => {

  const confirmDelete =
    window.confirm(
      "Delete this course permanently?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    await apiFetch(
      `/courses/${id}`,
      {
        method: "DELETE",
      }
    );

    alert("Course deleted");

    navigate("/admin/courses");

  } catch (err) {

    console.error(err);
  }
};

const handleConfirmDelete = async () => {

  try {

    if (deleteType === "lesson") {

      await handleDeleteLesson(
        deleteId,
        deleteModuleId
      );

    } else if (deleteType === "module") {

      await handleDeleteModule(
        deleteId
      );
    } else if (deleteType === "quiz") {

        await handleDeleteQuiz(
            deleteId,
            deleteModuleId
  );
}

    setShowDeleteModal(false);

  } catch (err) {
    console.error(err);
  }
};

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="course-editor-page">

<button
  className="back-btn"
  onClick={() =>
    navigate("/admin/courses")
  }
>
  ← Back to Courses
</button>

<div className="course-settings-card">

<h1 className="course-editor-title">
  Course Settings
</h1>

<div className="course-settings-form">

  {/* COURSE NAME */}

  <div className="form-group">

    <label>
      Course Name
    </label>

    <input
      className="editor-input"

      type="text"

      placeholder="Course Name"

      value={courseForm.course_name}

      onChange={(e) =>
        setCourseForm({
          ...courseForm,
          course_name: e.target.value,
        })
      }
    />

  </div>

  {/* DESCRIPTION */}

  <div className="form-group">

    <label>
      Course Description
    </label>

    <ReactQuill
      theme="snow"

      value={courseForm.description}

      onChange={(value) =>
        setCourseForm({
          ...courseForm,

          description: value,
        })
      }

      className="lesson-editor"
    />

  </div>

  {/* CATEGORY */}

  <div className="form-group">

    <label>
      Course Category
    </label>

    <select
      className="editor-select"

      value={courseForm.category_id}

      onChange={(e) =>
        setCourseForm({
          ...courseForm,
          category_id: e.target.value,
        })
      }
    >

      <option value="">
        General Course
      </option>

      <option value="1">
        Conservation
      </option>

      <option value="2">
        Biodiversity
      </option>

      <option value="3">
        Eco-tourism
      </option>

      <option value="4">
        Legislation
      </option>

      <option value="5">
        Safety
      </option>

    </select>

  </div>

  {/* NATIONAL PARK */}

  <div className="form-group">

    <label>
      National Park
    </label>

    <select
      className="editor-select"

      value={courseForm.park_id}

      onChange={(e) =>
        setCourseForm({
          ...courseForm,
          park_id: e.target.value,
        })
      }
    >

      <option value="">
        All Parks
      </option>

      <option value="1">
        Bako National Park
      </option>

      <option value="2">
        Gunung Mulu National Park
      </option>

      <option value="3">
        Kubah National Park
      </option>

      <option value="4">
        Niah National Park
      </option>

    </select>

  </div>

  {/* COURSE STATUS */}

  <div className="form-group">

    <label>
      Course Status
    </label>

    <select
      className="editor-select"

      value={courseForm.status}

      onChange={(e) =>
        setCourseForm({
          ...courseForm,
          status: e.target.value,
        })
      }
    >

      <option>
        Draft
      </option>

      <option>
        Published
      </option>

      <option>
        Archived
      </option>

    </select>

  </div>

  {/* IMAGE URL */}

<div className="form-group">

  <label>
    Course Cover Image
  </label>

  <input
    className="editor-file-input"

    type="file"

    accept="image/*"

    onChange={handleImageUpload}
  />

  {courseForm.image_url && (

    <img
      className="course-cover-preview"

      src={
        `${import.meta.env.VITE_API_URL}${courseForm.image_url}`
      }

      alt="Course Cover"
    />

  )}

</div>

  {/* MANDATORY COURSE */}

  <label className="checkbox-group">

    <input
      className="editor-checkbox"

      type="checkbox"

      checked={courseForm.is_mandatory}

      onChange={(e) =>
        setCourseForm({
          ...courseForm,
          is_mandatory: e.target.checked,
        })
      }
    />

    Mandatory Course

  </label>

  {/* ACTION BUTTONS */}

  <div className="course-actions">

    <button
      onClick={handleUpdateCourse}

      className="save-course-btn"
    >
      Save Course Settings
    </button>

    <button
      className="delete-course-btn"

      onClick={handleDeleteCourse}
    >
      Delete Course
    </button>

  </div>

</div>


</div>

<hr className="editor-divider" />

<h2>Modules</h2>

<button
  className="add-module-btn"
  onClick={() => setShowModuleModal(true)}
>
  + Add Module
</button>

<CourseModulesSection
    mode="admin"
    modules={modules}
    lessons={lessons}

    setDeleteType={setDeleteType}
    setDeleteId={setDeleteId}
    setDeleteModuleId={setDeleteModuleId}
    setShowDeleteModal={setShowDeleteModal}

    setEditingModule={setEditingModule}
    setEditModuleForm={setEditModuleForm}
    setShowEditModuleModal={
    setShowEditModuleModal
    }

    setSelectedModule={setSelectedModule}
    setShowLessonModal={
    setShowLessonModal
    }

    setEditingLesson={setEditingLesson}
    setEditLessonForm={setEditLessonForm}
    setShowEditLessonModal={
    setShowEditLessonModal
    }

    quizzes={quizzes}

    setSelectedQuizModule={
    setSelectedQuizModule
    }

    setShowQuizModal={
    setShowQuizModal
    }

    questions={questions}

    setSelectedQuiz={
    setSelectedQuiz
    }

    setShowQuestionModal={
    setShowQuestionModal
    }

    setEditingQuiz={setEditingQuiz}

    setEditQuizForm={setEditQuizForm}

    setShowEditQuizModal={
    setShowEditQuizModal}

    expandedModules={expandedModules}
    setExpandedModules={setExpandedModules}

    setEditQuestionForm={setEditQuestionForm}

    setShowEditQuestionModal={
      setShowEditQuestionModal
    }
/>

{/* CREATE MODULE MODAL */}
{showModuleModal && (
  <BaseModal
    title="Create Module"
    onClose={() =>
      setShowModuleModal(false)
    }
    onSubmit={handleCreateModule}
    submitLabel="Create Module"
  >

    <input
      className="editor-input"
      type="text"
      placeholder="Module Title"
      value={moduleForm.module_title}
      onChange={(e) =>
        setModuleForm({
          ...moduleForm,
          module_title: e.target.value,
        })
      }
    />

    <textarea
      className="editor-textarea"
      placeholder="Module Description"
      value={moduleForm.module_description}
      onChange={(e) =>
        setModuleForm({
          ...moduleForm,
          module_description:
            e.target.value,
        })
      }
    />

  </BaseModal>
)}

{/* CREATE LESSON MODAL */}
{showLessonModal && (
  <BaseModal
    title="Create Lesson"
    onClose={() =>
      setShowLessonModal(false)
    }
    onSubmit={handleCreateLesson}
    submitLabel="Create Lesson"
  >

    <input
      className="editor-input"
      type="text"
      placeholder="Lesson Title"
      value={lessonForm.lesson_title}
      onChange={(e) =>
        setLessonForm({
          ...lessonForm,
          lesson_title: e.target.value,
        })
      }
    />

    <ReactQuill
      theme="snow"

      value={editLessonForm.lesson_content}

      onChange={(value) =>
        setEditLessonForm({
          ...editLessonForm,

          lesson_content: value,
        })
      }

      className="lesson-editor"
    />

    <input
      className="editor-input"
      type="number"
      placeholder="Duration (mins)"
      value={lessonForm.duration}
      onChange={(e) =>
        setLessonForm({
          ...lessonForm,
          duration: e.target.value,
        })
      }
    />

    <input
      className="editor-input"
      type="text"
      placeholder="Video URL"
      value={lessonForm.video_url}
      onChange={(e) =>
        setLessonForm({
          ...lessonForm,
          video_url: e.target.value,
        })
      }
    />

  </BaseModal>
)}

{/* EDIT MODULE MODAL */}
{showEditModuleModal && (
  <BaseModal
    title="Edit Module"
    onClose={() =>
      setShowEditModuleModal(false)
    }
    onSubmit={handleEditModule}
    submitLabel="Save Changes"
  >

    <input
      className="editor-input"
      type="text"
      placeholder="Module Title"
      value={editModuleForm.module_title}
      onChange={(e) =>
        setEditModuleForm({
          ...editModuleForm,
          module_title: e.target.value,
        })
      }
    />

    <textarea
      className="editor-textarea"
      placeholder="Module Description"
      value={editModuleForm.module_description}
      onChange={(e) =>
        setEditModuleForm({
          ...editModuleForm,
          module_description:
            e.target.value,
        })
      }
    />

  </BaseModal>
)}
{/* EDIT LESSON MODAL */}
{showEditLessonModal && (

  <BaseModal
    title="Edit Lesson"

    onClose={() =>
      setShowEditLessonModal(false)
    }

    onSubmit={handleEditLesson}

    submitLabel="Save Changes"
  >

    {/* LESSON TITLE */}
    <div className="form-group">

      <label>
        Lesson Title
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="Lesson Title"

        value={editLessonForm.lesson_title}

        onChange={(e) =>
          setEditLessonForm({
            ...editLessonForm,

            lesson_title:
              e.target.value,
          })
        }
      />

    </div>

    {/* LESSON CONTENT */}
    <div className="form-group">

      <label>
        Lesson Content
      </label>

    <ReactQuill
      theme="snow"

      value={editLessonForm.lesson_content}

      onChange={(value) =>
        setEditLessonForm({
          ...editLessonForm,
          lesson_content: value,
        })
      }

      className="lesson-editor"
    />

    </div>

    {/* DURATION */}
    <div className="form-group">

      <label>
        Duration (Minutes)
      </label>

      <input
        className="editor-input"

        type="number"

        placeholder="Duration"

        value={editLessonForm.duration}

        onChange={(e) =>
          setEditLessonForm({
            ...editLessonForm,

            duration:
              e.target.value,
          })
        }
      />

    </div>

    {/* VIDEO URL */}
    <div className="form-group">

      <label>
        YouTube Video URL
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="https://youtube.com/..."

        value={editLessonForm.video_url}

        onChange={(e) =>
          setEditLessonForm({
            ...editLessonForm,

            video_url:
              e.target.value,
          })
        }
      />

    </div>

  </BaseModal>
)}

{/* DELETE MODAL */}
{showDeleteModal && (
  <BaseModal
    title={`Delete ${deleteType}`}
    onClose={() =>
      setShowDeleteModal(false)
    }
    onSubmit={handleConfirmDelete}
    submitLabel="Delete"
  >

    <p>
      Are you sure you want to delete
      this {deleteType}?
    </p>

    {deleteType === "module" && (
      <p>
        All lessons inside will also
        be deleted.
      </p>
    )}

  </BaseModal>
)}

{/* EDIT QUESTION MODAL */}
{showEditQuestionModal && (

  <BaseModal
    title="Edit Question"

    onClose={() =>
      setShowEditQuestionModal(false)
    }

    onSubmit={handleEditQuestion}

    submitLabel="Save Changes"
  >

    {/* QUESTION */}
    <div className="form-group">

      <label>
        Question
      </label>

      <textarea
        className="editor-textarea"

        placeholder="Enter question"

        value={
          editQuestionForm.question_text
        }

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            question_text:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION A */}
    <div className="form-group">

      <label>
        Option A
      </label>

      <input
        className="editor-input"

        type="text"

        value={editQuestionForm.option_a}

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            option_a:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION B */}
    <div className="form-group">

      <label>
        Option B
      </label>

      <input
        className="editor-input"

        type="text"

        value={editQuestionForm.option_b}

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            option_b:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION C */}
    <div className="form-group">

      <label>
        Option C
      </label>

      <input
        className="editor-input"

        type="text"

        value={editQuestionForm.option_c}

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            option_c:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION D */}
    <div className="form-group">

      <label>
        Option D
      </label>

      <input
        className="editor-input"

        type="text"

        value={editQuestionForm.option_d}

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            option_d:
              e.target.value,
          })
        }
      />

    </div>

    {/* CORRECT ANSWER */}
    <div className="form-group">

      <label>
        Correct Answer
      </label>

      <select
        className="editor-select"

        value={
          editQuestionForm.correct_answer
        }

        onChange={(e) =>
          setEditQuestionForm({
            ...editQuestionForm,

            correct_answer:
              e.target.value,
          })
        }
      >

        <option value="A">
          A
        </option>

        <option value="B">
          B
        </option>

        <option value="C">
          C
        </option>

        <option value="D">
          D
        </option>

      </select>

    </div>

  </BaseModal>
)}

{showQuizModal && (
  <BaseModal
    title="Create Quiz"

    onClose={() =>
      setShowQuizModal(false)
    }

    onSubmit={handleCreateQuiz}

    submitLabel="Create Quiz"
  >

    <input 
      type="text"
      placeholder="Quiz Title"
      className="editor-input"
      value={quizForm.quiz_title}

      onChange={(e) =>
        setQuizForm({
          ...quizForm,
          quiz_title: e.target.value,
        })
      }
    />

    <input className= "editor-input" 
      type="number"
      placeholder="Passing Score"

      value={quizForm.passing_score}

      onChange={(e) =>
        setQuizForm({
          ...quizForm,
          passing_score:
            e.target.value,
        })
      }
    />

  </BaseModal>
)}


{showQuestionModal && (
  <BaseModal
    title="Create Question"

    onClose={() =>
      setShowQuestionModal(false)
    }

    onSubmit={handleCreateQuestion}

    submitLabel="Create Question"
  >

    {/* QUESTION */}

    <div className="form-group">

      <label>
        Question
      </label>

      <textarea
        className="editor-textarea"

        placeholder="Enter question"

        value={
          questionForm.question_text
        }

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            question_text:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION A */}

    <div className="form-group">

      <label>
        Option A
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="Enter option A"

        value={questionForm.option_a}

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            option_a:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION B */}

    <div className="form-group">

      <label>
        Option B
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="Enter option B"

        value={questionForm.option_b}

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            option_b:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION C */}

    <div className="form-group">

      <label>
        Option C
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="Enter option C"

        value={questionForm.option_c}

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            option_c:
              e.target.value,
          })
        }
      />

    </div>

    {/* OPTION D */}

    <div className="form-group">

      <label>
        Option D
      </label>

      <input
        className="editor-input"

        type="text"

        placeholder="Enter option D"

        value={questionForm.option_d}

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            option_d:
              e.target.value,
          })
        }
      />

    </div>

    {/* CORRECT ANSWER */}

    <div className="form-group">

      <label>
        Correct Answer
      </label>

      <select
        className="editor-select"

        value={
          questionForm.correct_answer
        }

        onChange={(e) =>
          setQuestionForm({
            ...questionForm,
            correct_answer:
              e.target.value,
          })
        }
      >

        <option value="">
          Select Correct Answer
        </option>

        <option value="A">
          A
        </option>

        <option value="B">
          B
        </option>

        <option value="C">
          C
        </option>

        <option value="D">
          D
        </option>

      </select>

    </div>

  </BaseModal>
)}

{showEditQuizModal && (
  <BaseModal
    title="Edit Quiz"

    onClose={() =>
      setShowEditQuizModal(false)
    }

    onSubmit={handleEditQuiz}

    submitLabel="Save Changes"
  >

<div className="form-group">

  <label>
    Quiz Title
  </label>

  <input
    className="editor-input"

    type="text"

    value={editQuizForm.quiz_title}

    onChange={(e) =>
      setEditQuizForm({
        ...editQuizForm,
        quiz_title:
          e.target.value,
      })
    }
  />

</div>

<div className="form-group">

  <label>
    Passing Score
  </label>

  <input
    className="editor-input"

    type="number"

    value={
      editQuizForm.passing_score
    }

    onChange={(e) =>
      setEditQuizForm({
        ...editQuizForm,
        passing_score:
          e.target.value,
      })
    }
  />

</div>
  </BaseModal>
)}

</div>
);
}

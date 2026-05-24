import React, { useEffect, useState } from "react";
import { Plus, Search, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import "../../../styles/adminCourses.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    course_name: "",
    description: "",
    park_id: "",
    category_id: "",
    image_url: "",
    status: "Draft",
    is_mandatory: false,
  });

  const navigate = useNavigate();

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await apiFetch("/courses");
      const data = await res.json();

      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

/* ================= CREATE COURSE ================= */
  const handleCreateCourse = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
          alert("Please login again");
          return;
        }

      const res = await apiFetch("/courses", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,
          created_by: user.user_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "failed to create course");
        return;
      }

      await fetchCourses();

      setShowModal(false);

      setForm({
        course_name: "",
        description: "",
        park_id: "",
        category_id: "",
        image_url: "",
        status: "Draft",
        is_mandatory: false,
      });

    } catch (err) {
      console.error(err);
      alert("server error");
    }
  };

  /* ================= FILTERS ================= */
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.course_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      course.category_name === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      course.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="admin-courses-page">
      {/* HEADER */}
      <div className="courses-header">
        <div>
          <h1>Training Courses</h1>
          <p>Manage learning programs for park guides</p>
        </div>

        <button
          className="new-course-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          New Course
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="courses-toolbar">
        {/* SEARCH */}
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option>Conservation</option>
          <option>Biodiversity</option>
          <option>Eco-tourism</option>
          <option>Legislation</option>
          <option>Safety</option>
        </select>

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Archived</option>
        </select>
      </div>

      {/* COURSE GRID */}
      <div className="courses-grid">
        {filteredCourses.map((course) => (
            <div
            className="course-card"
            key={course.course_id}
            onClick={() =>
                navigate(`/admin/courses/${course.course_id}`)
            }
            >
            {/* IMAGE */}
            <div className="course-image">
              {course.image_url ? (
                <img
                    src={
                      course.image_url?.startsWith("http")
                        ? course.image_url
                        : `${import.meta.env.VITE_API_URL}${course.image_url}`
                    }

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
                  {course.category_name || "General"}
                </span>

                <span className={`status-tag ${course.status?.toLowerCase()}`}>
                  {course.status}
                </span>
              </div>

              <h3>{course.course_name}</h3>

              <p>
                {course.description || "No description"}
              </p>


              <div className="course-footer">
                <span>
                  {course.total_duration || 0} mins
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
    
      {/* ================= CREATE COURSE MODAL ================= */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Course</h2>

            {/* COURSE NAME */}
            <input
              type="text"
              placeholder="Course Name"
              value={form.course_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  course_name: e.target.value,
                })
              }
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            {/* CATEGORY */}
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">General Course</option>

              <option value="1">Conservation</option>
              <option value="2">Biodiversity</option>
              <option value="3">Eco-tourism</option>
              <option value="4">Legislation</option>
              <option value="5">Safety</option>
            </select>

            {/* PARK */}
            <select
              value={form.park_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  park_id: e.target.value,
                })
              }
            >
              <option value="">All Parks</option>

              <option value="1">Bako National Park</option>
              <option value="2">Gunung Mulu National Park</option>
              <option value="3">Kubah National Park</option>
              <option value="4">Niah National Park</option>
            </select>

            {/* STATUS */}
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>

            {/* IMAGE */}
            <input
              type="text"
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  image_url: e.target.value,
                })
              }
            />

            {/* MANDATORY */}
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.is_mandatory}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_mandatory: e.target.checked,
                  })
                }
              />

              Mandatory Course
            </label>

            {/* BUTTONS */}
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={handleCreateCourse}>
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}   
    </div>
  );
}

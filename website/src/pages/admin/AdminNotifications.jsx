// website/src/pages/admin/AdminNotifications.jsx

import React, { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Send,
  X,
} from "lucide-react";

import { apiFetch } from "../../api";

export default function AdminNotifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [guides, setGuides] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "Announcement",
    target: "all",
    assigned_to: "",
  });

  /* ================= FETCH NOTIFICATIONS ================= */

  useEffect(() => {

    fetchNotifications();
    fetchGuides();

  }, []);

  const fetchNotifications = async () => {

    try {

      const res = await apiFetch("/notifications")

      const data = await res.json();

      setNotifications(data);

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= FETCH GUIDES ================= */

  const fetchGuides = async () => {

    try {

      const res = await apiFetch("/users/guides")
      const data = await res.json();

      setGuides(data);

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= SEND NOTIFICATION ================= */

  const handleSendNotification =
    async () => {

      try {

        const res = await apiFetch(
          "/notifications",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title: form.title,

              message: form.message,

              type: form.type,

              is_broadcast:
                form.target === "all",

              assigned_to:
                form.target === "specific"
                  ? form.assigned_to
                  : null,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "failed"
          );

          return;
        }

        fetchNotifications();

        setShowModal(false);

        setForm({
          title: "",
          message: "",
          type: "Announcement",
          target: "all",
          assigned_to: "",
        });

      } catch (err) {

        console.error(err);
      }
    };

  /* ================= DELETE ================= */

  const handleDelete =
    async (id) => {

      try {

        await apiFetch(
          `/notifications/${id}`,
          {
            method: "DELETE",
          }
        );

        fetchNotifications();

      } catch (err) {

        console.error(err);
      }
    };

  /* ================= FILTER ================= */

  const filteredNotifications =
    notifications.filter((notification) =>

      notification.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div style={{ padding: "40px" }}>

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
          Notifications
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          Send announcements and reminders
          to park guides.
        </p>

      </div>

      {/* ================= ACTION BAR ================= */}

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "30px",
        }}
      >

        <button
          onClick={() =>
            setShowModal(true)
          }

          style={{
            background: "#059669",
            color: "#fff",
            border: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",

            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <Plus size={18} />
          New Notification

        </button>

        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >

          <Search
            size={18}

            style={{
              position: "absolute",
              top: "50%",
              left: "16px",
              transform:
                "translateY(-50%)",
              color: "#6b7280",
            }}
          />

          <input
            type="text"

            placeholder="Search notifications..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            style={{
              width: "100%",

              padding:
                "14px 18px 14px 48px",

              border:
                "1px solid #d1d5db",

              borderRadius: "12px",

              outline: "none",
            }}
          />

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div
        style={{
          background: "#fff",

          border:
            "1px solid #e5e7eb",

          borderRadius: "20px",

          overflow: "hidden",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "2fr 1fr 1fr 1fr 120px",

            padding: "22px 30px",

            background: "#f9fafb",

            fontWeight: "600",
          }}
        >

          <div>Notification</div>
          <div>Type</div>
          <div>Recipient</div>
          <div>Date</div>
          <div>Actions</div>

        </div>

        {/* ROWS */}

        {filteredNotifications.map((notification) => (

          <div
            key={notification.id}

            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr 1fr 1fr 120px",

              padding: "24px 30px",

              borderTop:
                "1px solid #f3f4f6",

              alignItems: "center",
            }}
          >

            <div>

              <h3
                style={{
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                {notification.title}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                }}
              >
                {notification.message}
              </p>

            </div>

            <div>
              {notification.type}
            </div>

            <div>
              {notification.is_broadcast
                ? "All Guides"
                : notification.guide_name}
            </div>

            <div>
              {new Date(
                notification.created_at
              ).toLocaleDateString()}
            </div>

            <button
              onClick={() =>
                handleDelete(
                  notification.id
                )
              }

              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#dc2626",
              }}
            >

              <Trash2 size={18} />

            </button>

          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="modal">

          <div
            className="modal-content"

            style={{
              width: "500px",
            }}
          >

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                marginBottom: "20px",
              }}
            >

              <h2>
                Send Notification
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }

                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >

                <X size={22} />

              </button>

            </div>
<input
  type="text"
  placeholder="Notification title"
  value={form.title}
  onChange={(e) =>
    setForm({
      ...form,
      title: e.target.value,
    })
  }

  style={{
    width: "100%",
    padding: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  }}
/> 

            <textarea
              placeholder="Write your message..."

              value={form.message}

              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }

              style={{
                marginTop: "16px",
              }}
            />

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap: "16px",

                marginTop: "16px",
              }}
            >

              <select
                value={form.type}

                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >

                <option>
                  Announcement
                </option>

                <option>
                  Update
                </option>

                <option>
                  Reminder
                </option>

              </select>

              <select
                value={form.target}

                onChange={(e) =>
                  setForm({
                    ...form,
                    target: e.target.value,
                  })
                }
              >

                <option value="all">
                  All Guides
                </option>

                <option value="specific">
                  Specific Guide
                </option>

              </select>

            </div>

            {form.target ===
              "specific" && (

              <select
                value={form.assigned_to}

                onChange={(e) =>
                  setForm({
                    ...form,
                    assigned_to:
                      e.target.value,
                  })
                }

                style={{
                  marginTop: "16px",
                }}
              >

                <option value="">
                  Select Guide
                </option>

                {guides.map((guide) => (

                  <option
                    key={guide.user_id}

                    value={guide.user_id}
                  >
                    {guide.user_name}
                  </option>
                ))}

              </select>
            )}

            <button
              onClick={
                handleSendNotification
              }

              style={{
                width: "100%",
                marginTop: "20px",

                background: "#059669",

                color: "#fff",

                border: "none",

                padding: "14px",

                borderRadius: "12px",

                fontWeight: "600",

                cursor: "pointer",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                gap: "10px",
              }}
            >

              <Send size={18} />

              Send Notification

            </button>

          </div>

        </div>
      )}

    </div>
  );
}

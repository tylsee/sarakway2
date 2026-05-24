// website/src/pages/guide/GuideNotifications.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Megaphone,
} from "lucide-react";

import { apiFetch } from "../../api";

export default function GuideNotifications() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const res = await apiFetch(`/notifications/user/${user.user_id}`);

        const data =
          await res.json();

        setNotifications(data);

      } catch (err) {

        console.error(err);
      }
    };

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
          Stay updated with announcements
          from the admin team.
        </p>

      </div>

      {/* ================= CARDS ================= */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        {notifications.map((notification) => (

          <div
            key={notification.id}

            style={{
              background: "#fff",

              border:
                "1px solid #e5e7eb",

              borderRadius: "20px",

              padding: "24px",

              display: "flex",

              gap: "20px",

              alignItems: "flex-start",
            }}
          >

            <div
              style={{
                width: "50px",
                height: "50px",

                borderRadius: "50%",

                background: "#ecfdf5",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                color: "#059669",
              }}
            >

              {notification.type ===
              "Announcement" ? (

                <Megaphone size={22} />

              ) : (

                <Bell size={22} />

              )}

            </div>

            <div style={{ flex: 1 }}>

              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems: "center",

                  marginBottom: "8px",
                }}
              >

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {notification.title}
                </h2>

                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {new Date(
                    notification.created_at
                  ).toLocaleDateString()}
                </span>

              </div>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "10px",
                }}
              >
                {notification.type}
              </p>

              <p>
                {notification.message}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

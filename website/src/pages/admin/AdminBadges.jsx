import React, {
  useEffect,
  useState,
} from "react";
import { apiFetch } from "../../api";
import "../../styles/adminBadges.css";

export default function AdminBadges() {

  const [badges, setBadges] =
    useState([]);

  /* ================= FETCH BADGES ================= */

  useEffect(() => {

    fetchBadges();

  }, []);

  const fetchBadges = async () => {

    try {

      const res = await apiFetch(
        "/courses/admin/certificates"
      );
      
      const data = await res.json();

      setBadges(data);

    } catch (err) {

      console.error(err);
    }
  };

  return (

    <div className="admin-badges-page">

      {/* ================= HEADER ================= */}

      <div className="badges-header">

        <h1>
          Training Badges
        </h1>

        <p>
          Monitor earned training badges
          for park guides.
        </p>

      </div>

      {/* ================= BADGES LIST ================= */}

      <div className="badges-list">

        {badges.length === 0 ? (

          <div className="empty-badge-state">

            No badges earned yet.

          </div>

        ) : (

          badges.map((badge) => (

            <div
              key={badge.certificate_id}
              className="badge-card"
            >

              {/* LEFT */}

              <div className="badge-info">

                <h2>
                  {badge.user_name}
                </h2>

                <p>
                  {badge.park_name}
                </p>

              </div>

              {/* RIGHT */}

              <div className="badge-actions">

                <span
                  className="
                    badge-status
                    earned
                  "
                >
                  Earned
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

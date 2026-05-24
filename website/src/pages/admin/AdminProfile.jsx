import React, {
  useState,
} from "react";

import logo from "../../assets/logo.png";

import {
  Pencil,
  X,
} from "lucide-react";

import { apiFetch } from "../../api";

export default function AdminProfile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    name:
      user?.name || "Emily Pui",

    email:
      user?.email ||
      "emily@test.com",

    phone:
      user?.phone ||
      "0123456789",

    password: "",
  });

  const handleSave = async () => {

  try {

    const res = await apiFetch(
      `/users/${user.user_id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          newPassword: form.password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email,
        phone: form.phone,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Profile updated!");

      setShowModal(false);

    } else {

      alert(data.message);
    }

  } catch (err) {

    console.error(err);

    alert("Server error");
  }
};

  return (

    <div style={{ padding: "40px" }}>

      {/* HEADER */}

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
  {user?.role === "admin"
    ? "Admin Profile"
    : "My Profile"}
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
{user?.role === "admin"
  ? "Manage your account settings and preferences."
  : "Manage your personal information and account settings."}
        </p>

      </div>

      {/* PROFILE CARD */}

      <div
        style={{
          background: "#fff",

          border:
            "1px solid #e5e7eb",

          borderRadius: "24px",

          padding: "40px",

          marginBottom: "30px",

          textAlign: "center",
        }}
      >

        <img
          src={logo}
          alt="logo"

          style={{
            width: "120px",
            marginBottom: "20px",
          }}
        />

        <h2
          style={{
            fontSize: "40px",
            fontWeight: "700",
          }}
        >
          {form.name}
        </h2>

        <p
          style={{
            color: "#059669",

            fontSize: "24px",

            fontWeight: "600",

            marginTop: "10px",
          }}
        >
{user?.role === "admin"
  ? "System Administrator"
  : "Park Guide"}
        </p>

      </div>

      {/* ACCOUNT INFO */}

      <div
        style={{
          background: "#fff",

          border:
            "1px solid #e5e7eb",

          borderRadius: "24px",

          padding: "40px",
        }}
      >

        <h2
          style={{
            fontSize: "32px",
            marginBottom: "30px",
          }}
        >
{user?.role === "admin"
  ? "Account Information"
  : "Account Details"}
        </h2>

        <ProfileRow
          label="Name"
          value={form.name}
        />

        <ProfileRow
          label="Email Address"
          value={form.email}
        />

        <ProfileRow
          label="Phone Number"
          value={form.phone}
        />

        <ProfileRow
          label="Password"
          value="••••••••"
        />

      </div>

      {/* BUTTON */}

      <button
        onClick={() =>
          setShowModal(true)
        }

        style={{
          width: "100%",

          marginTop: "30px",

          background: "#059669",

          color: "#fff",

          border: "none",

          padding: "18px",

          borderRadius: "16px",

          fontSize: "20px",

          fontWeight: "600",

          cursor: "pointer",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          gap: "12px",
        }}
      >

        <Pencil size={20} />
        Edit Profile

      </button>

      {/* MODAL */}

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
                Edit Profile
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

            <InputField
              label="Name"

              value={form.name}

              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <InputField
              label="Email Address"

              value={form.email}

              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <InputField
              label="Phone Number"

              value={form.phone}

              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <InputField
              label="New Password"

              type="password"

              placeholder="Leave blank to keep current"

              value={form.password}

              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

<button
  onClick={handleSave}

  style={{
    background: "#059669",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  Save Changes
</button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProfileRow({
  label,
  value,
}) {

  return (

    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        padding: "20px 0",

        borderBottom:
          "1px solid #f3f4f6",
      }}
    >

      <span
        style={{
          color: "#6b7280",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontWeight: "600",
        }}
      >
        {value}
      </span>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {

  return (

    <div
      style={{
        marginBottom: "18px",
      }}
    >

      <label
        style={{
          display: "block",

          marginBottom: "8px",

          fontWeight: "600",
        }}
      >
        {label}
      </label>

      <input
        type={type}

        value={value}

        placeholder={placeholder}

        onChange={onChange}

        style={{
          width: "100%",

          padding: "14px",

          border:
            "1px solid #d1d5db",

          borderRadius: "12px",

          fontSize: "16px",

          boxSizing:
            "border-box",
        }}
      />

    </div>
  );
}
